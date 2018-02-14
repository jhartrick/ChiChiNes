import { BaseCart } from '../chichicarts/BaseCart'
import { ChiChiAPU } from './ChiChiAudio'
import { ChiChiCPPU_AddressingModes, ChiChiInstruction, ChiChiSprite, RunningStatuses, PpuStatus, CpuStatus } from './ChiChiTypes'
import { ChiChiInputHandler, ChiChiControlPad } from './ChiChiControl'
import { ChiChiPPU } from "./ChiChiPPU";
import { GameGenieCode, MemoryPatch } from './ChiChiCheats';
import { ChiChiWavSharer } from './Audio/CommonAudio';
import { ChiChiCPPU } from './ChiChiCPU';
import { StateBuffer } from './StateBuffer';
import { setupMemoryMap } from './MemoryMaps/ChiChiMemoryMap';
import { MemoryMap } from './chichi';


    //machine wrapper
export class ChiChiMachine {
    mapFactory: (cart: BaseCart) => MemoryMap;
    private frameJustEnded = true;
    private frameOn = false;
    private totalCPUClocks = 0;
    private sb: StateBuffer;
    
    constructor(cpu? : ChiChiCPPU) {
        
        this.sb = new StateBuffer();
        const wavSharer = new ChiChiWavSharer(this.sb);
        this.SoundBopper = new ChiChiAPU(wavSharer);
        this.WaveForms = wavSharer;
        this.ppu = new ChiChiPPU();
        this.Cpu = cpu ? cpu : new ChiChiCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.ppu.NMIHandler = () => {  this.Cpu.nmiHandler(); }
        this.ppu.frameFinished = () => { this.frameFinished(); };
        this.mapFactory = setupMemoryMap(this.Cpu)(<ChiChiPPU>this.ppu)(this.SoundBopper)(this.Cpu.PadOne)(this.Cpu.PadTwo);
    }

    loadCart(cart: BaseCart) : void {
        this.mapFactory(cart);
        this.RebuildStateBuffer();
        cart.installCart(<ChiChiPPU>this.ppu, this.Cpu);
    }

    get StateBuffer(): StateBuffer {
        return this.sb;
    }

    RebuildStateBuffer() {
        const stateBuffer = new StateBuffer();

        this.Cpu.memoryMap.setupStateBuffer(stateBuffer);
        this.Cpu.setupStateBuffer(stateBuffer);
        this.ppu.setupStateBuffer(stateBuffer);
        this.Cart.setupStateBuffer(stateBuffer);
        stateBuffer.build();
        this.sb = stateBuffer;
    }

    Drawscreen(): void {
    }

    RunState: RunningStatuses;
    ppu: ChiChiPPU;
    Cpu: ChiChiCPPU;
    get Cart(): BaseCart {
        if (this.Cpu && this.Cpu.memoryMap && this.Cpu.memoryMap.cart) {
            return <BaseCart>this.Cpu.memoryMap.cart;
        } else {
            return undefined;
        }
    }

    SoundBopper: ChiChiAPU;
    WaveForms: ChiChiWavSharer;

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

    Reset(): void {
        if (this.Cpu  && this.Cart && this.Cart.supported) {

            this.Cart.initializeCart(true);
            this.Cpu.ResetCPU();
            this.SoundBopper.rebuildSound();
            //ClearGenieCodes();
            //this.Cpu.PowerOn();
            this.RunState = RunningStatuses.Running;
        }
    }

    PowerOn(): void {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            this.Cart.initializeCart();
            this.Cpu.ppu.initialize();
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
        this.Cpu.step();

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
            this.Cpu.step();
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
