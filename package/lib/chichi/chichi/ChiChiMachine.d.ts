import { BaseCart } from '../chichicarts/BaseCart';
import { ChiChiAPU } from './ChiChiAudio';
import { RunningStatuses } from './ChiChiTypes';
import { ChiChiPPU } from "./ChiChiPPU";
import { ChiChiWavSharer } from './Audio/CommonAudio';
import { ChiChiCPPU } from './ChiChiCPU';
import { StateBuffer } from './StateBuffer';
import { MemoryMap } from './chichi';
import { ChiChiControlPad } from './ChiChiControl';
export declare class ChiChiMachine {
    mapFactory: (cart: BaseCart) => MemoryMap;
    private frameJustEnded;
    private frameOn;
    private totalCPUClocks;
    stateBuffer: StateBuffer;
    controllerPortOne: ChiChiControlPad;
    controllerPortTwo: ChiChiControlPad;
    constructor(cpu?: ChiChiCPPU);
    loadCart(cart: BaseCart): void;
    Drawscreen(): void;
    RunState: RunningStatuses;
    ppu: ChiChiPPU;
    Cpu: ChiChiCPPU;
    readonly Cart: BaseCart;
    SoundBopper: ChiChiAPU;
    WaveForms: ChiChiWavSharer;
    private _enableSound;
    EnableSound: boolean;
    FrameCount: number;
    IsRunning: boolean;
    Reset(): void;
    PowerOn(): void;
    PowerOff(): void;
    Step(): void;
    evenFrame: boolean;
    RunFrame(): void;
    EjectCart(): void;
    LoadNSF(rom: any): void;
    frameFinished(): void;
    dispose(): void;
}
