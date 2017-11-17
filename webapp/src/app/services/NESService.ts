import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { WishboneMachine } from "./wishbone/wishbone";
import { ChiChiCPPU, AudioSettings, ChiChiPPU } from 'chichi';
import { Http } from '@angular/http';
import * as crc from 'crc';

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
    public wishbone = new WishboneMachine();

    initNes: any;

    private callback: () => void;

    public grabRam(start: number, finish: number): number[] {

        return this.wishbone.Cpu.PeekBytes(start, finish);
    }

    public DebugUpdateEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    get isDebugging(): boolean {
        return false;
    }

    IsRunning(): boolean {
        return true;
    }

    public wavBuffer: any;
    private buffering = false;
    private bufferPos = 0;
    private maxBufferLength = 10000;


    // platform hooks
    SetCallbackFunction(callback: () => void) {
        this.callback = callback;
        // this.machine.Drawscreen = callback;
      //  this.ready = true;
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

    // control
    StartEmulator(): void {
        this.wishbone.Run();
    }

    Continue(): void {
        this.wishbone.postNesMessage({ command: 'continue' });
    }


    get canStart(): boolean {
        return this.wishbone.Cart && this.wishbone.Cart.supported;
    }

    StopEmulator(): void {
        this.wishbone.PowerOff();
    }

    ResetEmulator(): void {
        this.wishbone.Reset();
    }

    DebugStepFrame(): void {
        this.wishbone.postNesMessage({ command: 'runframe', debug: true });
    }

    DebugStep(): void {
        this.wishbone.Step();

    }

    private worker: Worker;

    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array .BYTES_PER_ELEMENT);
    private nesInterop: Int32Array = new Int32Array (<any>this.nesControlBuf);

    readonly iop_runStatus = 2;

    private nesStateSubject: Subject<any> = new Subject();

    public get nesState(): Observable<any> {
        return this.nesStateSubject.asObservable();
    }

    private oldOp = 0;

}
