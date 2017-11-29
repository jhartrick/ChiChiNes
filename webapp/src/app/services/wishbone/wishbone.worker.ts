import { Subject } from 'rxjs';
import { WishboneMachine } from './wishbone';
import { Observable } from 'rxjs/Observable';
import { Local } from 'protractor/built/driverProviders';
import { Injectable } from '@angular/core';
import { MemoryPatch, IBaseCart, BaseCart, ChiChiMessages, RunningStatuses, DebugStepTypes } from 'chichi';
import { WishboneWorkerInterop } from './wishbone.worker.interop';

class Buffers{
    vbuffer: Uint8Array;
    abuffer: Float32Array;
}

@Injectable()
export class WishboneWorker {
    ready: boolean = false;
    worker: Worker;
    
    pendingMessages: Array<any> = new Array<any>();
    nesMessageData: Subject<any> = new Subject<any>();
    
    beforeClose() {

    }
    constructor(private interop: WishboneWorkerInterop, private wishbone: WishboneMachine) {
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
                let msg = new ChiChiMessages.CreateCommand(buffers.vbuffer, buffers.abuffer, this.wishbone.SoundBopper.cloneSettings(), this.interop.iops);
                this.postMessageAndWait(msg).subscribe((resp)=> {
                    this.postMessageAndWait(new ChiChiMessages.LoadRomCommand(rom, cart.CartName)).subscribe(res=>{
                        this.wishbone.insertCart(cart);
                        subj.next();
                    });
                })
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

    private postMessageAndWait(message: ChiChiMessages.WorkerMessage) : Observable<ChiChiMessages.WorkerResponse> {
        let sub = new Observable<ChiChiMessages.WorkerResponse>((subject)=> {
            this.nesMessageData.filter((p) => 
            {   
                return p.messageId === message.messageId ;
            }
            )
            .subscribe((resp) => {
                subject.next(resp);
            }, err => {
                subject.error(err);
            } );
            this.worker.postMessage(message);
        });
        return sub;

    }

    private postNesMessage(message: any) {
        if (this.worker) {
            this.worker.postMessage(message);
            this.interop.unloop();
        } else {
            this.pendingMessages.push(message);
        }
    }
    
    updateAudioSettings() {
        const msg = new ChiChiMessages.AudioCommand(this.wishbone.SoundBopper.audioSettings)
        this.postNesMessage(msg);
    }

    private setRunStatus(status: RunningStatuses) {
        this.postMessageAndWait(new ChiChiMessages.RunStatusCommand(status))
        
        .subscribe(() => {
            this.wishbone.runningStatus = status;
        });
    }

    reset() {
        this.setRunStatus(RunningStatuses.Running);
    }

    powerOff() {
        this.setRunStatus(RunningStatuses.Off);
    }

    ejectCart() {
        this.setRunStatus(RunningStatuses.Off);
    }

    run() {
        this.setRunStatus(RunningStatuses.Running);
    }

    pause() {
        this.setRunStatus(RunningStatuses.Paused);
    }

    debugStep() {
        this.postNesMessage(new ChiChiMessages.DebugCommand(DebugStepTypes.Instruction));
    }

    debugStepFrame() {
        this.postNesMessage(new ChiChiMessages.DebugCommand(DebugStepTypes.Frame));
    }
            
    continue() {
        this.setRunStatus(RunningStatuses.Running);
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
        this.postNesMessage(new ChiChiMessages.CheatCommand(cheats));
    }

}
