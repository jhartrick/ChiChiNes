import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { WishboneMachine } from "./wishbone/wishbone";
import { ChiChiCPPU, AudioSettings, ChiChiPPU, BaseCart } from 'chichi';
import { Http } from '@angular/http';
import * as crc from 'crc';
import { WishboneWorker } from './wishbone/wishbone.worker';
import { IBaseCart } from 'chichi';

class NesInfo {
    stateupdate = true;
    runStatus: any = {};
    cartInfo: any = {};
    sound: any = {};
    debug: any = {
        currentCpuStatus: {
            PC: 0,
            A: 0,
            X: 0,
            Y: 0,
            SP: 0,
            SR: 0
        },
        currentPPUStatus: {}
    };
}

export enum RunStatus {
    Off,
    Running,
    Paused,
    DebugRunning,
    Stepping
}


export class EmuState {
    constructor(public romLoaded: string, public powerState: boolean, public paused: boolean, public debugging: boolean) {
    }
}



@Injectable()
export class Emulator {
    public wishbone;

    initNes: any;

    private callback: () => void;

    public DebugUpdateEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        console.log("making wishbone")
        this.wishbone = new WishboneMachine();
        this.worker = new WishboneWorker(this.wishbone);

        
    }


    setupCart(cart: BaseCart, rom: number[]) {

        this.worker.start((threadHandler)=>{
            this.wishbone.nesInterop = threadHandler.nesInterop;
            this.wishbone.insertCart(cart);
            
            threadHandler.postNesMessage({ 
                command: 'create',
                vbuffer: this.wishbone.ppu.byteOutBuffer,
                abuffer: this.wishbone.WaveForms.SharedBuffer,
                audioSettings: this.wishbone.SoundBopper.cloneSettings(),
                iops: this.wishbone.nesInterop
            });

            threadHandler.postNesMessage({ command: 'loadrom', rom: rom, name: cart.CartName });
        });
    }

    get isDebugging(): boolean {
        return false;
    }

    vbuffer: Uint8Array;

    SetVideoBuffer(array: Uint8Array): void {
        // this.vbuffer = array;
        this.wishbone.ppu.byteOutBuffer = array;
        // this.machine.PPU.ByteOutBuffer = array;
    }

    abuffer: Float32Array;
    SetAudioBuffer(array: Float32Array): void {
        this.wishbone.WaveForms.SharedBuffer = array;
    }

    SetDebugCallbackFunction(callback: () => void) {
    }


    worker: WishboneWorker;

}
