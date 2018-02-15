import { ChiChiCPPU } from "../ChiChiCPU";
import { ChiChiPPU } from "../ChiChiPPU";
import { ChiChiAPU } from "../ChiChiAudio";
import { ChiChiInputHandler } from "../ChiChiControl";
import { BaseCart } from "../chichi";
import { MemoryMap } from "./ChiChiMemoryMap";
export declare const getByte: (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (Rams: Uint8Array) => (pad1: ChiChiInputHandler) => (pad2: ChiChiInputHandler) => (cart: BaseCart) => (clock: number, address: number) => number;
export declare const setByte: (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (Rams: Uint8Array) => (pad1: ChiChiInputHandler) => (pad2: ChiChiInputHandler) => (cart: BaseCart) => (clock: number, address: number, data: number) => void;
export declare const setupVSMemoryMap: (cpu: ChiChiCPPU) => (ppu: ChiChiPPU) => (apu: ChiChiAPU) => (pad1: ChiChiInputHandler) => (pad2: ChiChiInputHandler) => (cart: BaseCart) => MemoryMap;
