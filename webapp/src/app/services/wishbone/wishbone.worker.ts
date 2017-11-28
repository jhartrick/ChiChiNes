import { Subject } from 'rxjs';
import { WishboneMachine } from './wishbone';
import { Observable } from 'rxjs/Observable';
import { Local } from 'protractor/built/driverProviders';
import { Injectable } from '@angular/core';
import { MemoryPatch, IBaseCart } from 'chichi';
import { BaseCart } from 'chichi';

export class Buffers{
    vbuffer: Uint8Array;
    abuffer: Float32Array;
}

@Injectable()
export class WishboneWorker {
    ready: boolean = false;

    worker: Worker;
    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_CONTROL_PAD_1 = 4;
    readonly NES_AUDIO_AVAILABLE = 3;
    nesInterop: Int32Array = new Int32Array(<any>new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT));
    
    pendingMessages: Array<any> = new Array<any>();
    
    nesMessageData: Subject<any> = new Subject<any>();

    beforeClose() {

    }

    constructor(private wishbone: WishboneMachine) {
        wishbone.nesInterop = this.nesInterop;
    }

    private onready() {

    }

    createAndLoadRom(cart: BaseCart, rom: number[], buffers: Buffers) : Observable<any> {
        return new Observable((subj)=>{
            if (this.worker) {
                this.worker.terminate();
                this.worker = undefined;
                this.ready = false;
            }        
            const nesWorker = require('file-loader?name=worker.[hash:20].[ext]!../../../assets/emulator.worker.bootstrap.js');
    
            this.worker = new Worker(nesWorker);

            this.onready = () => {
                this.wishbone.nesInterop = this.nesInterop;
                
                this.postNesMessage({ 
                    command: 'create',
                    vbuffer: buffers.vbuffer,
                    abuffer: buffers.abuffer,
                    audioSettings: this.wishbone.SoundBopper.cloneSettings(),
                    iops: this.wishbone.nesInterop
                });

                this.postNesMessage({ command: 'loadrom', rom: rom, name: '' });

                this.wishbone.insertCart(cart);
                subj.next();
                
            }

            this.worker.onmessage = (data: MessageEvent) => {
                this.handleMessage(data);
            };

        });
    }

    stop() {
        this.beforeClose();
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

            }
        }
        if (data.sound) {
            wishbone.SoundBopper.updateSettings(data.sound.settings);
        }


    }

    private handleMessage(data: MessageEvent) {
        const d = data.data;
        if (d === 'ready') {
            this.onready();

            while (this.pendingMessages.length > 0) {
                this.worker.postMessage(this.pendingMessages.pop());
            }
            return;

        }
        this.sync(d);
        this.nesMessageData.next(d);
    }

    private postNesMessage(message: any) {
        if (this.worker) {
            this.worker.postMessage(message);
            <any>Atomics.store(this.nesInterop, this.NES_GAME_LOOP_CONTROL , 0);
            <any>Atomics.wake(this.nesInterop, this.NES_GAME_LOOP_CONTROL, 9999);
        } else {
            this.pendingMessages.push(message);
        }
    }
    
    updateAudioSettings() {
        this.postNesMessage({ command: 'audiosettings', settings : this.wishbone.SoundBopper.audioSettings });
    }

    reset() {
        this.postNesMessage({ command: 'reset', debug: false });
    }

    powerOff() {
        this.postNesMessage({ command: 'stop' });
        this.beforeClose();
    }

    ejectCart() {
        this.postNesMessage({ command: 'stop' });
        this.beforeClose();
    }

    run() {
        this.postNesMessage({ command: 'run', debug: false });
    }

    debugStep() {
        this.postNesMessage({ command: 'step', debug: true });
    }

    debugStepFrame() {
        this.postNesMessage({ command: 'runframe', debug: true });
    }
            
    continue() {
        this.postNesMessage({ command: 'continue', debug: false });
    }

    saveState(){
        const r = this.wishbone.Cart.realCart ;
        if (r)
        {
            let obs = this.nesMessageData.filter((d) => d.state ? true: false).subscribe((d) => {
                localStorage.setItem(r.ROMHashFunction + '_state', JSON.stringify(d.state));
                obs.unsubscribe();
            });

            this.postNesMessage({ command: 'getstate' })
        }
    }

    restoreState() {
        const r = this.wishbone.Cart.realCart ;
        if (r)
        {
            let item = localStorage.getItem(r.ROMHashFunction + '_state');
            if (item) {
                this.postNesMessage({ command: 'setstate', state: JSON.parse(item) })
            }

        }
        
    }


    setCheats(cheats: Array<MemoryPatch>) {
        this.postNesMessage({ command: 'cheats', cheats: cheats });
    }

}
