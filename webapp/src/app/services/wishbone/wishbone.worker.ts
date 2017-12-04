import { Subject } from 'rxjs';
import { WishboneMachine } from './wishbone';
import { Observable } from 'rxjs/Observable';
import { Local } from 'protractor/built/driverProviders';
import { Injectable } from '@angular/core';
import { MemoryPatch, IBaseCart, BaseCart, ChiChiMessages, RunningStatuses, DebugStepTypes, StateBuffer } from 'chichi';
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

    createAndLoadRom(cart: BaseCart, rom: ArrayBuffer, buffers: Buffers) : Observable<any> {
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


    messageNumber = 0;

    private sync(data: any) {
        const wishbone = this.wishbone;
        if (data.state) {

        }
        if (data.machine) {
            this.wishbone.runningStatus = data.machine.runStatus;
        }

        if (data.bufferupdate) {
            wishbone.stateBuffer.syncBuffer(data.stateBuffer);

            if (data.sound) {
                wishbone.WaveForms.controlBuffer = data.sound.waveForms_controlBuffer; 
            }
        }

        if (data.stateupdate) {
            if (data.Cpu) {
                wishbone.ppu.backgroundPatternTableIndex = data.Cpu.backgroundPatternTableIndex;
                wishbone.cpuStatus = data.Cpu.status;
                wishbone.ppuStatus = data.Cpu.ppuStatus;
                wishbone.ppu.controlByte0 = data.Cpu.controlByte0;
                wishbone.ppu.controlByte1 = data.Cpu.controlByte1;

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
            const innerSub = this.nesMessageData.filter((p) => 
            {   
                return p.messageId === message.messageId ;
            }
            )
            .subscribe((resp) => {
                subject.next(resp);
                innerSub.unsubscribe();
            }, err => {
                subject.error(err);
                innerSub.unsubscribe();
            } );
            this.worker.postMessage(message);
            this.interop.unloop();
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
        this.postNesMessage(new ChiChiMessages.ResetCommand());
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

    stop() {
        this.setRunStatus(RunningStatuses.Off);
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
