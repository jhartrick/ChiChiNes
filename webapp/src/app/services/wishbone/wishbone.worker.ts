import { Subject } from "rxjs";
import { WishboneMachine } from "./wishbone";
import { Observable } from "rxjs/Observable";
import { Local } from "protractor/built/driverProviders";

export class WishboneWorker {
    ready: boolean = false;

    worker: Worker;
    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_CONTROL_PAD_1 = 4;
    readonly NES_AUDIO_AVAILABLE = 3;

    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT);
    nesInterop: Int32Array = new Int32Array(<any>this.nesControlBuf);
    pendingMessages: Array<any> = new Array<any>();
    
    nesMessageData: Subject<any> = new Subject<any>();

    beforeClose() {

    }

    constructor(private wishbone: WishboneMachine) {
        console.log("making wishboneworker")

        wishbone.nesInterop = this.nesInterop;

        wishbone.Reset = () => {
            this.postNesMessage({ command: 'reset', debug: false });
        }
   
        wishbone.PowerOff = () => {
            this.postNesMessage({ command: 'stop' });
            this.beforeClose();
        }
    
        wishbone.Step = () => {
            this.postNesMessage({ command: 'step', debug: true });
        }
    
        wishbone.EjectCart = () =>  {
            this.postNesMessage({ command: 'stop' });
            this.beforeClose();
            
        }

        wishbone.Run = () => {
            this.postNesMessage({ command: 'run', debug: false });
        }

    }

    oncreate: (t: WishboneWorker)=>void;

    start (oncreate: (t: WishboneWorker)=>void)  {
        this.oncreate = oncreate;

        if (this.worker) {
            this.worker.terminate();
            this.worker = undefined;
            this.ready = false;
        }        
        const nesWorker = require('file-loader?name=worker.[hash:20].[ext]!../../../assets/emulator.worker.bootstrap.js');

        this.worker = new Worker(nesWorker);

        this.worker.onmessage = (data: MessageEvent) => {
            this.handleMessage(data);
        };
    
    }

    stop() {
        this.beforeClose();
    }

    postNesMessage(message: any) {
        if (this.worker) {
            this.worker.postMessage(message);
            <any>Atomics.store(this.nesInterop, this.NES_GAME_LOOP_CONTROL , 0);
            <any>Atomics.wake(this.nesInterop, this.NES_GAME_LOOP_CONTROL, 9999);
        } else {
            this.pendingMessages.push(message);
        }
    }
    
    messageNumber = 0;

    private sync(data: any) {
        const wishbone = this.wishbone;
        if (data.state) {
            
            // console.log("state "  + JSON.stringify(data.state));
        }

        if (data.bufferupdate) {
            if (data.Cpu.Rams) {
                wishbone.Cpu.Rams = data.Cpu.Rams;
                wishbone.ppu.spriteRAM = data.Cpu.spriteRAM;
                for (let i = 0; i < wishbone.ppu.unpackedSprites.length; ++i) {
                    wishbone.ppu.unpackedSprites[i].Changed = true;
                }
                wishbone.ppu.unpackSprites();
            }
            if (data.Cart && wishbone.Cart.realCart) {

                wishbone.Cart.realCart.prgRomBank6 = data.Cart.prgRomBank6;
                wishbone.Cart.realCart.ppuBankStarts = data.Cart.ppuBankStarts;
                //wishbonethis.Cart.realCart.bankStartCache = data.Cart.bankStartCache;
                wishbone.Cart.realCart.chrRom = data.Cart.chrRom;
            }
            if (data.sound) {
                wishbone.WaveForms.controlBuffer = data.sound.waveForms_controlBuffer;//
            }
        }
        if (data.stateupdate) {
            if (data.Cpu) {
                wishbone.ppu.backgroundPatternTableIndex = data.Cpu.backgroundPatternTableIndex;
                wishbone.cpuStatus = data.Cpu.status;
                wishbone.ppuStatus = data.Cpu.ppuStatus;
                wishbone.ppu._PPUControlByte0 = data.Cpu._PPUControlByte0;
                wishbone.ppu._PPUControlByte1 = data.Cpu._PPUControlByte1;

            }
            if (data.Cart && wishbone.Cart.realCart) {

                // this.Cart.realCart.CurrentBank = data.Cart.CurrentBank;
                // this.Cart.realCart.current8 = data.Cart.current8;
                // this.Cart.realCart.currentA = data.Cart.currentA;
                // this.Cart.realCart.currentC = data.Cart.currentC;
                // this.Cart.realCart.currentE = data.Cart.currentE;

                // this.Cart.realCart.bank8start = data.Cart.bank8start;
                // this.Cart.realCart.bankAstart = data.Cart.bankAstart;
                // this.Cart.realCart.bankCstart = data.Cart.bankCstart;
                // this.Cart.realCart.bankEstart = data.Cart.bankEstart;

            }
        }
        if (data.sound) {
            wishbone.SoundBopper.updateSettings(data.sound.settings);
        }


    }

    private handleMessage(data: MessageEvent) {
        const d = data.data;
        if (d === 'ready') {
            this.oncreate(this);

            while (this.pendingMessages.length > 0) {
                this.worker.postMessage(this.pendingMessages.pop());
            }
            return;

        }
        this.sync(d);
        this.nesMessageData.next(d);
    }
}
