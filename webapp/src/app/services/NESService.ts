import { Injectable, EventEmitter } from '@angular/core';
import { AngControlPad } from './chichines.service.controlpad'; 
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


export class Tiler {

   constructor(private nes: WishboneMachine) { }
   patternTables: Uint8ClampedArray[] = new Array<Uint8ClampedArray>(2);

    DoodleSprite(spritenum: number, outbuf: Uint8ClampedArray): void
    {
        const patternTable = this.nes.ppu.SpritePatternTableIndex;
        const sprite = this.nes.ppu.unpackedSprites[spritenum];
        const doodle1 = this.nes.tileDoodler.GetSprite(patternTable, sprite.TileIndex, sprite.AttributeByte, sprite.FlipX, sprite.FlipY);
        const pal = ChiChiPPU.pal;
        for (let i = 0; i <= doodle1.length; ++i) {
            const color = pal[doodle1[i]];
            outbuf[i * 4] = (color >> 0) & 0xFF;
            outbuf[(i * 4) + 1] = (color >> 9) & 0xFF;
            outbuf[(i * 4) + 2] = (color >> 16 ) & 0xFF;
            outbuf[(i * 4) + 3] =  0xFF;
        }
    }

   DoodleNameTable(nametable: number, outbuf:  Uint8ClampedArray ): void
   {
       // var data = new Uint32Array(this.nes.Tiler.DoodlePatternTable(0));
       const doodle1 = this.nes.tileDoodler.DoodleNameTable(nametable);
       const pal = ChiChiPPU.pal;

       for (let i = 0; i <= doodle1.length; ++i) {
           const color = pal[doodle1[i]];
           outbuf[i * 4] = (color >> 0) & 0xFF;
           outbuf[(i * 4) + 1] = (color >> 9) & 0xFF;
           outbuf[(i * 4) + 2] = (color >> 16 ) & 0xFF;
           outbuf[(i * 4) + 3] =  0xFF;
       }

       // this.patternTables[1] = new Uint8ClampedArray(this.nes.tileDoodler.DoodlePatternTable(0x1000));
   }

   DoodlePatternTable(nametable: number, outbuf:  Uint8ClampedArray ): void
   {
       //var data = new Uint32Array(this.nes.Tiler.DoodlePatternTable(0));
       const doodle1 = this.nes.tileDoodler.DoodlePatternTable(nametable);
       const pal = ChiChiPPU.pal;

       for (let i = 0; i <= doodle1.length; ++i) {
           const color = pal[doodle1[i]];
           outbuf[i * 4] = (color >> 0) & 0xFF;
           outbuf[(i * 4) + 1] = (color >> 9) & 0xFF;
           outbuf[(i * 4) + 2] = (color >> 16 ) & 0xFF;
           outbuf[(i * 4) + 3] =  0xFF;
       }

       //this.patternTables[1] = new Uint8ClampedArray(this.nes.tileDoodler.DoodlePatternTable(0x1000));
   }
}

export class EmuState {
    constructor(public romLoaded: string, public powerState: boolean, public paused: boolean, public debugging: boolean) {
    }
}



@Injectable()
export class Emulator {
    public wishbone = new WishboneMachine();

    public tiler: Tiler = new Tiler(this.wishbone);
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
