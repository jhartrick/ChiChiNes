import { BaseCart, IBaseCart } from '../chichicarts/BaseCart'
import { ChiChiAPU, IChiChiAPU } from './ChiChiAudio'
import { ChiChiCPPU_AddressingModes, ChiChiInstruction, ChiChiSprite, RunningStatuses, PpuStatus, CpuStatus } from './ChiChiTypes'
import { ChiChiInputHandler, ChiChiControlPad } from './ChiChiControl'
import { ChiChiPPU, IChiChiPPU } from "./ChiChiPPU";
import { GameGenieCode, MemoryPatch } from './ChiChiCheats';
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
        this.ppu.frameFinished = () => { this.frameFinished(); };
    }


    Drawscreen(): void {
    }

    RunState: RunningStatuses;
    ppu: IChiChiPPU;
    Cpu: ChiChiCPPU;
    get Cart(): BaseCart {
        if (this.Cpu && this.Cpu.memoryMap && this.Cpu.memoryMap.cart) {
            return <BaseCart>this.Cpu.memoryMap.cart;
        } else {
            return undefined;
        }
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

        do {
            this.Cpu.Step();
        } while (this.frameOn);

        this.totalCPUClocks = 0;
        this.Cpu.Clock = 0;
        
        this.ppu.LastcpuClock = 0;
    }

    EjectCart(): void {
        this.Cpu.memoryMap = null;
    }

    LoadNSF(rom: any) {
    }


    frameFinished(): void {
        this.frameJustEnded = true;
        this.frameOn = false;
        this.Drawscreen();
    }

    dispose(): void {
    }
}
