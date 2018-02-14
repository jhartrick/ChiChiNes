import { IChiChiCPPU } from "./ChiChiCPU";
import { IChiChiPPU } from "./ChiChiPPU";
import { IChiChiAPU } from "./ChiChiAudio";
import { IBaseCart } from "../chichicarts/BaseCart";
import { ChiChiInputHandler } from "./ChiChiControl";
import { StateBuffer } from "./StateBuffer";
export interface IMemoryMap {
    ppu: IChiChiPPU;
    apu: IChiChiAPU;
    pad1: ChiChiInputHandler;
    pad2: ChiChiInputHandler;
    cpu: IChiChiCPPU;
    cart: IBaseCart;
    Rams: Uint8Array;
    readonly irqRaised: boolean;
    getByte(clock: number, address: number): number;
    setByte(clock: number, address: number, data: number): void;
    getPPUByte(clock: number, address: number): number;
    setPPUByte(clock: number, address: number, data: number): void;
    advanceClock(value: number): void;
    advanceScanline(value: number): void;
    setupStateBuffer(sb: StateBuffer): void;
}
export declare class MemoryMap implements IMemoryMap {
    cpu: IChiChiCPPU;
    cart: IBaseCart;
    ppu: IChiChiPPU;
    apu: IChiChiAPU;
    pad1: ChiChiInputHandler;
    pad2: ChiChiInputHandler;
    Rams: Uint8Array;
    readonly irqRaised: boolean;
    constructor(cpu: IChiChiCPPU, cart: IBaseCart);
    private lastAddress;
    getByte(clock: number, address: number): number;
    setByte(clock: number, address: number, data: number): void;
    getPPUByte(clock: number, address: number): number;
    setPPUByte(clock: number, address: number, data: number): void;
    advanceClock(value: number): void;
    advanceScanline(value: number): void;
    setupStateBuffer(sb: StateBuffer): StateBuffer;
}
