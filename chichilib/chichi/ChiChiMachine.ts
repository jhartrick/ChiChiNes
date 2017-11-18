import { BaseCart, IBaseCart } from '../chichicarts/BaseCart'
import { ChiChiAPU, IChiChiAPU } from './ChiChiAudio'
import { ChiChiCPPU_AddressingModes, ChiChiInstruction, ChiChiSprite, RunningStatuses, PpuStatus, CpuStatus } from './ChiChiTypes'
import { ChiChiInputHandler, ChiChiControlPad } from './ChiChiControl'
import { ChiChiPPU, IChiChiPPU } from "./ChiChiPPU";
import { GameGenieCode, GeniePatch } from './ChiChiCheats';
import { WavSharer } from './Audio/CommonAudio';
import { ChiChiCPPU } from './ChiChiCPU';


    //machine wrapper
export class ChiChiMachine {
    private frameJustEnded = true;
    private frameOn = false;
    private totalCPUClocks = 0;

    constructor(cpu? : ChiChiCPPU) {
        var wavSharer = new WavSharer();
        this.SoundBopper = new ChiChiAPU(wavSharer);
        this.WaveForms = wavSharer;
        this.ppu = new ChiChiPPU();
        this.Cpu = cpu ? cpu : new ChiChiCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.ppu.NMIHandler = () => {  this.Cpu.nmiHandler(); }
        this.SoundBopper.irqHandler = () => { this.Cpu.irqUpdater(); };
        this.ppu.frameFinished = () => { this.FrameFinished(); };
    }


    Drawscreen(): void {
    }

    RunState: RunningStatuses;
    ppu: IChiChiPPU;
    Cpu: ChiChiCPPU;
    get Cart(): BaseCart {
        return <BaseCart>this.Cpu.Cart;
    }

    SoundBopper: ChiChiAPU;
    WaveForms: WavSharer;

    private _enableSound: boolean = false;
    
    get EnableSound(): boolean {
        return this._enableSound;
    }

    set EnableSound(value: boolean) {
        this._enableSound = value;
        if (this._enableSound) {
                this.SoundBopper.rebuildSound();
        }
    }

    FrameCount: number;

    IsRunning: boolean;

    get PadOne(): ChiChiControlPad {
        return this.Cpu.PadOne.ControlPad;
    }

    get PadTwo(): ChiChiControlPad {
        return this.Cpu.PadTwo.ControlPad;
    }

    SRAMReader: (RomID: string) => any;

    SRAMWriter: (RomID: string, SRAM: any) => void;

    Reset(): void {
        if (this.Cpu  && this.Cart && this.Cart.supported) {

            this.Cart.InitializeCart(true);
            this.Cpu.ResetCPU();
            this.SoundBopper.rebuildSound();
            //ClearGenieCodes();
            //this.Cpu.PowerOn();
            this.RunState = RunningStatuses.Running;
        }
    }

    PowerOn(): void {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            this.Cart.InitializeCart();
            this.Cpu.ppu.Initialize();
            this.SoundBopper.rebuildSound();
            this.Cpu.PowerOn();
            this.RunState = RunningStatuses.Running;
        }
    }

    PowerOff(): void {
        this.RunState = RunningStatuses.Off;
    }

    Step(): void {
        if (this.frameJustEnded) {
            this.frameOn = true;
            this.frameJustEnded = false;
        }
        this.Cpu.Step();

        if (!this.frameOn) {
            this.totalCPUClocks = 0;
            this.Cpu.Clock = 0;
            this.ppu.LastcpuClock = 0;
            this.frameJustEnded = true;
        }
    }

    evenFrame=true;

    RunFrame(): void {
        this.frameOn = true;
        this.frameJustEnded = false;

        //_cpu.RunFrame();
        do {
            this.Cpu.Step();
        } while (this.frameOn);

        this.totalCPUClocks = this.Cpu.Clock;

        // this.SoundBopper.flushFrame(this.totalCPUClocks);
        // this.SoundBopper.endFrame(this.totalCPUClocks);
        //this.SoundBopper.writer.ReadWaves();

        this.totalCPUClocks = 0;
        this.Cpu.Clock = 0;
        this.ppu.LastcpuClock = 0;
    }

    EjectCart(): void {
        this.Cpu.Cart = null;
        this.ppu.chrRomHandler = null;

    }

    LoadNSF(rom: any) {

    }



    LoadCart(rom: any): void {
        this.EjectCart();
        // var cart = iNESFileHandler.LoadROM(this.Cpu, rom);
        // if (cart != null) {
        //     this.Cpu.cheating = false;
        //     this.Cpu.genieCodes = new Array<GeniePatch>();
        //     this.Cpu.Cart = cart;// Bridge.cast(this.Cart, ChiChiNES.IClockedMemoryMappedIOElement);
        //     this.Cart.NMIHandler = () => { this.Cpu.InterruptRequest() };
        //     this.ppu.ChrRomHandler = this.Cart;



        // } else {
        //     throw new Error("Unsupported ROM type - load failed.");
        // }
    }

    HasState(index: number): boolean {
        throw new Error("Method not implemented.");
    }

    GetState(index: number): void {
        throw new Error("Method not implemented.");
    }

    SetState(index: number): void {
        throw new Error("Method not implemented.");
    }

    SetupSound(): void {
        throw new Error("Method not implemented.");
    }

    FrameFinished(): void {
        this.frameJustEnded = true;
        this.frameOn = false;
        this.Drawscreen();
    }

    dispose(): void {
    }
}
