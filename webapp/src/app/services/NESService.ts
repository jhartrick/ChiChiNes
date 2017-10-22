import { Injectable, EventEmitter } from '@angular/core';
import { Debugger, DecodedInstruction, DebugEventInfo } from './debug.interface'; 
import { AngControlPad } from './chichines.service.controlpad'; 
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as JSZip from 'jszip';
import { AudioSettings } from "../../../workers/chichi/ChiChiTypes";

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

export class CartInfo {
    mapperId: number;
    name = '';
    prgRomCount = 0;
    chrRomCount = 0;
    constructor(nes?: ChiChiNES.NESMachine) {
      if (nes && nes.Cart) {
          this.mapperId = nes.Cart.MapperID;
          this.prgRomCount = nes.Cart.NumberOfPrgRoms;
          this.chrRomCount = nes.Cart.NumberOfChrRoms;
        }
    }
}

export enum RunStatus {
    Off,
    Running,
    Paused,
    DebugRunning,
    Stepping
}


//export class Tiler {

//    constructor(private nes: ChiChiNES.NESMachine) { }
//    patternTables: Uint8ClampedArray[] = new Array<Uint8ClampedArray>(2);

//    DoodleNameTable(nametable: number, outbuf:  Uint8ClampedArray ): void
//    {
//        //var data = new Uint32Array(this.nes.Tiler.DoodlePatternTable(0));
//        const doodle1 = this.nes.Tiler.DoodleNameTable(nametable);
//        const pal = ChiChiNES.PixelWhizzler.pal;

//        for (let i = 0; i <= doodle1.length; ++i) {
//            const color = pal[doodle1[i]];
//            outbuf[i * 4] = (color >> 0) & 0xFF;
//            outbuf[(i * 4) + 1] = (color >> 9) & 0xFF;
//            outbuf[(i * 4) + 2] = (color >> 16 ) & 0xFF;
//            outbuf[(i * 4) + 3] =  0xFF;
//        }

//        this.patternTables[1] = new Uint8ClampedArray(this.nes.Tiler.DoodlePatternTable(0x1000));
//    }
//}

export class EmuState {
    constructor(public romLoaded: string, public powerState: boolean, public paused: boolean, public debugging: boolean) {
    }
}

export class RomFile  {
    name: string;
    data: number[];
    nsf: boolean = false;
}

@Injectable()
export class RomLoader {

    loadZipRom(files: FileList): Observable<RomFile> {
        const file = files[0];
        const romLoader = new Observable<RomFile>(observer => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = (e) => {
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                // zip file
                JSZip.loadAsync(rom).then((zip: any) => {
                    zip.forEach((relativePath, zipEntry) => {  // 2) print entries
                        zipEntry.async('blob').then((fileData) => {
                            fileReader.onload = (ze) => {
                                const zrom: number[] = Array.from(new Uint8Array(fileReader.result));
                                observer.next({ name: file.name, data: zrom, nsf: false});
                            };
                            fileReader.readAsArrayBuffer(fileData);
                        });
                    });
                });

            };
            fileReader.readAsArrayBuffer(file);
        });
        return romLoader;
    }

    loadRom(files: FileList): Observable<RomFile> {
        const file = files[0];
        if (file.name.endsWith('.zip')) {
            return this.loadZipRom(files);
        }
        //if (file.name.endsWith('.nsf')) {
        //    return this.loadNsf(files);
        //}
        if (file.name.endsWith('.nes')) {
            const romLoader = new Observable<RomFile>(observer => {
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e) => {
                    const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                    observer.next({ name: file.name, data: rom, nsf: false });
                };
                fileReader.readAsArrayBuffer(file);
            });
            return romLoader;
        }
    }

    loadNsf(files: FileList): Observable<RomFile> {
        const file = files[0];
        const romLoader = new Observable<RomFile>(observer => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = (e) => {
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                observer.next({ name: file.name, data: rom, nsf: true });
            };
            fileReader.readAsArrayBuffer(file);
        });
        return romLoader;
    }

}

@Injectable()
export class Emulator {
    private myAudioSettings: AudioSettings = new AudioSettings();;

    get audioSettings(): AudioSettings {
        return this.myAudioSettings;
    }

    set audioSettings(value: AudioSettings) {
        this.myAudioSettings = value;
    }

    sync() {
        this.postNesMessage({ command: "audiosettings", settings: this.myAudioSettings });
    }
    initNes: any;
   // private ready: boolean = false;
    
    private callback: () => void;
    private _soundEnabled = false;

    public get soundEnabled() {
        return this._soundEnabled;
    }
    public set soundEnabled(value: boolean) {
        this._soundEnabled = value;
        if (this._soundEnabled) {
            this.postNesMessage({ command: "unmute" });
        } else {
            this.postNesMessage({ command: "mute" });
        }

    }

    private romName: string;
    public runStatus: RunStatus = RunStatus.Off;
    public debugger: Debugger ;
    public controlPad: AngControlPad;
    private framesRendered: number = 0;

    private framesSubj = new Subject<number>();
    public get framesPerSecond(): Observable<number> {
        return this.framesSubj.asObservable();
    }
    public fps = 0;

    private emuStateSubject: Subject<EmuState> = new Subject<EmuState>();

    public get emuState() : Observable<EmuState> {
        return this.emuStateSubject.asObservable();
    }

    public grabRam(start: number, finish: number): number[] {

        return [];
    }

    public DebugUpdateEvent: EventEmitter<DebugEventInfo> = new EventEmitter<DebugEventInfo>();
    public cartInfo: CartInfo = new CartInfo();

    padOneState: number = 0;

    constructor() {
        this.framesSubj.next(0);

        this.emuStateSubject.next(new EmuState('', false, false, false));

        this.initWebWorker();
    }

    // control pad
    handleKeyDownEvent(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37: //left arrow
                this.padOneState |= 64 & 0xFF;
                break;
            case 38: //up arrow	
                this.padOneState |= 16 & 0xFF;
                break;
            case 39: //right arrow	39
                this.padOneState |= 128 & 0xFF;
                break;
            case 40: //down arrow	40
                this.padOneState |= 32 & 0xFF;
                break;
            case 90: //	z
                this.padOneState |= 2 & 0xFF;
                break;
            case 88: //x
                this.padOneState |= 1 & 0xFF;
                break;
            case 13: case 89: // enter
                this.padOneState |= 8 & 0xFF;
                break;
            case 9: // tab
                this.padOneState |= 4 & 0xFF;
                break;
        }
        //debugger;
        this.nesInterop[2] = this.padOneState & 0xFF;
        //this.postNesMessage({ command: "setpad", padOneState: this.padOneState });
    }

    handleKeyUpEvent(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37: //left arrow
                this.padOneState &= ~64 & 0xFF;
                break;
            case 38: //up arrow	
                this.padOneState &= ~16 & 0xFF;
                break;
            case 39: //right arrow	39
                this.padOneState &= ~128 & 0xFF;
                break;
            case 40: //down arrow	40
                this.padOneState &= ~32 & 0xFF;
                break;
            case 90: //	z
                this.padOneState &= ~2 & 0xFF;
                break;
            case 88: //x
                this.padOneState &= ~1 & 0xFF;
                break;
            case 13: // enter
                this.padOneState &= ~8 & 0xFF;
                break;
            case 9: // tab
                this.padOneState &= ~4 & 0xFF;
                break;
        }
        this.nesInterop[2] = this.padOneState & 0xFF;

        //this.postNesMessage({ command: "setpad", padOneState: this.padOneState });
    }

    get isDebugging(): boolean {
        return false; 
    }

    IsRunning(): boolean {
        return true;
    }
    
    public wavBuffer: any;
    private buffering = false;
    private bufferPos: number = 0;
    private maxBufferLength = 10000;


    // platform hooks
    SetCallbackFunction(callback: () => void) {
        this.callback = callback;
        //this.machine.Drawscreen = callback;
      //  this.ready = true;
    }

    vbuffer: Uint8Array;

    SetVideoBuffer(array: Uint8Array): void {
        this.vbuffer = array;
        //this.machine.PPU.ByteOutBuffer = array;
    }

    abuffer: Float32Array;
    SetAudioBuffer(array: Float32Array): void {
        this.abuffer = array;
        //this.machine.PPU.ByteOutBuffer = array;
    }


    SetDebugCallbackFunction(callback: () => void) {
        //this.machine.addDebugCallback(callback);
    }

    // rom loading
    LoadRom(rom: number[],  romName :string) {
        this.postNesMessage({ command: "loadrom", rom: rom, name: romName });
//        this.machine.LoadCart(rom);
        this.romName = romName;
        this.emuStateSubject.next(new EmuState(this.romName, false, false, false));
    }

    LoadNsf(rom: number[], romName: string) {
        this.postNesMessage({ command: "loadnsf", rom: rom, name: romName });
        //        this.machine.LoadCart(rom);
        this.romName = romName;
        this.emuStateSubject.next(new EmuState(this.romName, false, false, false));
    }

    // control
    StartEmulator(): void {
        this.nesInterop[0] = 1;
        setInterval(() => {
            this.fps = this.nesInterop[1];
            this.framesSubj.next(this.fps);
        },500);
        (<any>Atomics).store(this.nesInterop, 2, 1);
        this.postNesMessage({ command: "run" });
    }

    Continue(): void {
        this.postNesMessage({ command: "continue" });
    }
    private runFunction(): void {
        this.postNesMessage({ command: "run", debug: false });
    }


    get canStart(): boolean {
        return true;
      //return (this.machine.Cart) ? true: false;
    }

    StopEmulator(): void {
        (<any>Atomics).store(this.nesInterop, 2, 0);
        this.postNesMessage({ command: "stop" });
    }

    ResetEmulator(): void {
        this.postNesMessage({ command: "reset", debug: true });
        //this.machine.Reset();
    }

    DebugStepFrame(): void {
        this.postNesMessage({ command: "runframe", debug: true });
    }

    DebugStep(): void {
        this.postNesMessage({ command: "step", debug: true });

    }

    private worker: Worker;

    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array .BYTES_PER_ELEMENT);
    private nesInterop: Int32Array = new Int32Array (<any>this.nesControlBuf);

    readonly iop_runStatus = 2;

    private nesStateSubject: Subject<any> = new Subject();

    public get nesState(): Observable<any> {
        return this.nesStateSubject.asObservable();
    }

    private oldOp: number = 0;

    private postNesMessage(message: any) {
        //this.oldOp = this.nesInterop[0] ;
        //this.nesInterop[0] = 0;
        this.worker.postMessage(message);
    }

    private postNesMessageAndStop(message: any) {
        //this.oldOp = 0;
        //this.nesInterop[0] = 0;
        this.worker.postMessage(message);
    }

    public clearAudio(): void {
        (<any>Atomics).store(this.nesInterop, 0, 1);
        (<any>Atomics).wake(this.nesInterop, 0, 1);
    }

    private nesReady = false;
    private initWebWorker() {
        this.debugger = new Debugger(this.nesStateSubject.asObservable());
        this.nesStateSubject.next(new NesInfo());

        const nesWorker = require('file-loader?name=worker.[hash:20].[ext]!../../assets/emulator.worker.bootstrap.js');

        this.worker = new Worker(nesWorker);

        this.worker.onmessage = (data: MessageEvent) => {
            var d = data.data;
            if (d === 'ready') {
                this.nesReady = true;

                var createCommand = 'create';
                this.postNesMessage({ command: createCommand, vbuffer: this.vbuffer, abuffer: this.abuffer, iops: this.nesInterop });
                return;
            }
            this.nesStateSubject.next(d);
            if (d.frame) {
                this.callback();
                if (d.fps) this.framesSubj.next(d.fps);
                this.fps = d.fps;
            }
            if (d.debug) {
                //update debug info
            }
            if (d.stateupdate) {
                //this.runStatus = data.data.runStatus;
                if (data.data.cartInfo) {
                    this.cartInfo = data.data.cartInfo;
                }
            }
            if (d.sound) {
                this._soundEnabled = d.sound.soundEnabled,
                this.myAudioSettings = d.sound.settings
            }
            //console.log(data.data);
        };
        

    }
    
}