import { ChiChiBopper, WavSharer } from "../../../../workers/chichi/ChiChiAudio";
import { ChiChiCPPU, ChiChiMachine, iNESFileHandler } from "../../../../workers/chichi/ChiChi.HWCore";
import { AudioSettings } from "../../../../workers/chichi/ChiChiTypes";
import { ChiChiInputHandler } from '../../../../workers/chichi/ChiChiControl'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { TileDoodler } from "./wishbone.tiledoodler";

class WishboneCart implements ChiChiNES.INESCart {

    realCart: ChiChiNES.BaseCart = null;

    Whizzler: ChiChiNES.CPU2A03;
    CPU: ChiChiNES.CPU2A03;
    ChrRom: any;
    ChrRamStart: number;
    PPUBankStarts: any;
    ROMHashFunction: (prg: any, chr: any) => string;
    CheckSum: string;
    SRAM: any;
    Mirroring: ChiChiNES.NameTableMirroring;
    CartName: string;

    get NumberOfPrgRoms(): number {
        return this.realCart ? this.realCart.NumberOfPrgRoms : -1;
    }
    
    get NumberOfChrRoms(): number {
        return this.realCart ? this.realCart.NumberOfChrRoms : -1;
    }

    get MapperID(): number {
        return this.realCart ? this.realCart.MapperID : -1;
    }

    BankSwitchesChanged: boolean;
    BankStartCache: any;
    CurrentBank: number;

    UsesSRAM: boolean;

    LoadiNESCart(header: any, prgRoms: number, chrRoms: number, prgRomData: any, chrRomData: any, chrRomOffset: number): void {
        throw new Error('Method not implemented.');
    }
    InitializeCart(): void {
        throw new Error('Method not implemented.');
    }
    UpdateScanlineCounter(): void {
        throw new Error('Method not implemented.');
    }
    WriteState(state: any): void {
        throw new Error('Method not implemented.');
    }
    ReadState(state: any): void {
        throw new Error('Method not implemented.');
    }
    ActualChrRomOffset(address: number): number {
        throw new Error('Method not implemented.');
    }
    UpdateBankStartCache(): number {
        throw new Error('Method not implemented.');
    }
    ResetBankStartCache(): void {
        throw new Error('Method not implemented.');
    }

    NMIHandler: () => void;

    IRQAsserted: boolean;

    NextEventAt: number;

    GetPPUByte(clock: number, address: number): number {
        if (this.realCart)
            return this.realCart.GetPPUByte(clock, address);
        else
            return 0;
    }

    SetPPUByte(clock: number, address: number, data: number): void {
        throw new Error('Method not implemented.');
    }

    GetByte(Clock: number, address: number): number {
        if (this.realCart) {
            return this.realCart.GetByte(Clock, address);
        } else  {
            return 0;
        }
    }
    SetByte(Clock: number, address: number, data: number): void {
        throw new Error('Method not implemented.');
    }

    HandleEvent(Clock: number): void {
        throw new Error('Method not implemented.');
    }
    ResetClock(Clock: number): void {
        throw new Error('Method not implemented.');
    }

}

class WishBopper implements ChiChiNES.BeepsBoops.Bopper {

    audioSettings: AudioSettings = new AudioSettings();
    EnableNoise: boolean = true;
    EnableSquare0: boolean = true;
    EnableSquare1: boolean = true;
    EnableTriangle: boolean = true;


    lastClock: number;
    throwingIRQs: boolean;
    reg15: number;
    SampleRate: number;
    sampleRate: number;
    Muted: boolean;
    InterruptRaised: boolean;
    enableTriangle: boolean;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    RebuildSound(): void {
        throw new Error('Method not implemented.');
    }
    GetByte(Clock: number, address: number): number {
        throw new Error('Method not implemented.');
    }
    ReadStatus(): number {
        throw new Error('Method not implemented.');
    }
    SetByte(Clock: number, address: number, data: number): void {
        throw new Error('Method not implemented.');
    }
    DoSetByte(Clock: number, address: number, data: number): void {
        throw new Error('Method not implemented.');
    }
    UpdateFrame(time: number): void {
        throw new Error('Method not implemented.');
    }
    RunFrameEvents(time: number, step: number): void {
        throw new Error('Method not implemented.');
    }
    EndFrame(time: number): void {
        throw new Error('Method not implemented.');
    }
    FlushFrame(time: number): void {
        throw new Error('Method not implemented.');
    }
    HandleEvent(Clock: number): void {
        throw new Error('Method not implemented.');
    }
    ResetClock(Clock: number): void {
        throw new Error('Method not implemented.');
    }

}

export class WishBoneControlPad implements ChiChiNES.IControlPad {
    constructor(private machine: WishboneMachine) {
    }

    padOneState: number = 0;

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
        this.machine.nesInterop[2] = this.padOneState;
        //this.nesInterop[2] = this.padOneState & 0xFF; 
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
        this.machine.nesInterop[2] = this.padOneState;

        //this.postNesMessage({ command: "setpad", padOneState: this.padOneState });
    }


    currentByte: number = 0;
    readNumber: number = 0;

    CurrentByte: number = 0;

    refresh(): void {
    }

    getByte(clock: number) {
        return 0;
    }

    setByte(clock: number, data: number): void {

    }
}

export class WishboneMachine implements ChiChiNES.NESMachine {
    fps: number = 0;
    nesReady: boolean;
    tileDoodler: TileDoodler;
    private worker: Worker;

    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT);
    nesInterop: Int32Array = new Int32Array(<any>this.nesControlBuf);


    constructor() {
        const wavSharer = new WavSharer();
        this.SoundBopper = new WishBopper();
        this.WaveForms = wavSharer;
        this.Cpu = new WishboneCPPU(this.SoundBopper);
        this.Cart = new WishboneCart();
        this.PadOne = new WishBoneControlPad(this);


        const nesWorker = require('file-loader?name=worker.[hash:20].[ext]!../../../assets/emulator.worker.bootstrap.js');

        this.worker = new Worker(nesWorker);

        this.worker.onmessage = (data: MessageEvent) => {
            this.handleMessage(data);
            //if (d.frame) {
            //    this.callback();
            //    if (d.fps) this.framesSubj.next(d.fps);
            //    this.fps = d.fps;
            //}
            //if (d.debug) {
            //    //update debug info
            //}
            //if (d.stateupdate) {
            //    //this.runStatus = data.data.runStatus;
            //    if (data.data.cartInfo) {
            //        this.cartInfo = data.data.cartInfo;
            //    }
            //}
            //if (d.sound) {
            //    this._soundEnabled = d.sound.soundEnabled,
            //        this.wishbone.Sync(d);
            //}
            //console.log(data.data);
        };


    }

    handleMessage(data: MessageEvent) {
        const d = data.data;
        if (d === 'ready') {
            this.nesReady = true;

            const createCommand = 'create';
            this.postNesMessage({ command: createCommand,
                vbuffer: this.Cpu.byteOutBuffer, 
                abuffer: this.WaveForms.SharedBuffer, 
                iops: this.nesInterop });

            return;
        }

        this.Sync(d);
        this.nesStateSubject.next(this);
    }

    private nesStateSubject: Subject<WishboneMachine> = new Subject<WishboneMachine>();

    readonly iop_runStatus = 2;

    initChiChiWorker() {

    }

    asObservable() {
        return this.nesStateSubject.asObservable();
    }

    postNesMessage(message: any) {
        //this.oldOp = this.nesInterop[0] ;
        //this.nesInterop[0] = 0;
        this.worker.postMessage(message);
    }

    Run() {
        this.postNesMessage({ command: 'run', debug: false });
        setInterval(() => {
            this.fps = this.nesInterop[1];
        }, 500);
        // (<any>Atomics).store(this.nesInterop, 2, 1);

    }

    RunFrame() {
    }

    RequestSync() {
        //case 'audiosettings':
        // this.machine.SoundBopper.audioSettings = event.data.settings;

        this.postNesMessage({ command: 'audiosettings', settings: this.SoundBopper.audioSettings });
    }

    Sync(data: any) {
        this.SoundBopper.audioSettings = data.sound.settings;
        if (data.Cpu.Rams) {
            this.Cpu.Rams = data.Cpu.Rams;
        }
        if (data.debug && data.debug.InstructionHistory) {
            this.Cpu._instructionHistory = data.debug.InstructionHistory.Buffer;
            this.Cpu.instructionHistoryPointer = data.debug.InstructionHistory.Index;
            this.Cpu.flushHistory = data.debug.InstructionHistory.Finish ? true : false;

            // {
            //    currentCpuStatus: this.machine.Cpu.GetStatus ? this.machine.Cpu.GetStatus() : {
            //        PC: 0,
            //        A: 0,
            //        X: 0,
            //        Y: 0,
            //        SP: 0,
            //        SR: 0
            //    },
            //        currentPPUStatus: this.machine.Cpu.GetPPUStatus ? this.machine.Cpu.GetPPUStatus() : {},
            //            InstructionHistory: {
            //        Buffer: this.machine.Cpu.InstructionHistory.slice(0),
            //            Index: this.machine.Cpu.InstructionHistoryPointer,
            //                Finish : true
            //    }

            // }

        }
    }

    Drawscreen() {
        // throw new Error('Method not implemented.');
    }
    RunState: ChiChiNES.Machine.ControlPanel.RunningStatuses;
    Cpu: WishboneCPPU;

    Cart: WishboneCart;

    SoundBopper: ChiChiNES.BeepsBoops.Bopper;
    WaveForms: any;
    EnableSound: boolean;
    FrameCount: number;
    IsRunning: boolean;
    PadOne: ChiChiNES.IControlPad;
    PadTwo: ChiChiNES.IControlPad;
    SRAMReader: (RomID: string) => any;
    SRAMWriter: (RomID: string, SRAM: any) => void;

    Reset() {
        this.postNesMessage({ command: "reset", debug: true });
    }

    PowerOn() {
        throw new Error('Method not implemented.');
    }

    PowerOff() {
        this.postNesMessage({ command: "stop" });
    }

    Step() {
        this.postNesMessage({ command: "step", debug: true });
    }

    EjectCart() {
        this.postNesMessage({ command: "stop" });
    }

    LoadCart(rom: any) {
        let cartName = this.Cart.CartName;
        let cart = iNESFileHandler.LoadROM(this.Cpu, rom);

        this.Cart = new WishboneCart();
        this.Cart.realCart = cart;
        this.Cart.realCart.CPU = this.Cpu;
        this.Cart.realCart.Whizzler = this.Cpu;
        this.Cart.CartName = cartName;

        this.tileDoodler = new TileDoodler(this.Cpu);
        this.postNesMessage({ command: 'loadrom', rom: rom, name: this.Cart.CartName });
        //        this.machine.LoadCart(rom);
    }

    HasState(index: number): boolean {
        throw new Error('Method not implemented.');
    }

    GetState(index: number) {
        throw new Error('Method not implemented.');
    }

    SetState(index: number) {
        throw new Error('Method not implemented.');
    }

    SetupSound() {
        throw new Error('Method not implemented.');
    }

    FrameFinished() {
        throw new Error('Method not implemented.');
    }


}

class WishboneCPPU extends ChiChiCPPU {
    flushHistory = false;


}
