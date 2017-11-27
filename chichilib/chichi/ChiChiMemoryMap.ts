import { IChiChiCPPU } from "./ChiChiCPU";
import { IChiChiPPU } from "./ChiChiPPU";
import { IChiChiAPU } from "./ChiChiAudio";
import { BaseCart, IBaseCart } from "../chichicarts/BaseCart";
import { ChiChiInputHandler } from "./ChiChiControl";

export class MemoryMap {
    constructor(
        private cpu: IChiChiCPPU, 
        private ppu: IChiChiPPU, 
        private apu: IChiChiAPU, 
        private pad1: ChiChiInputHandler, 
        private pad2: ChiChiInputHandler,
        private cart: IBaseCart) {
        
    }

    getByte(clock: number, address: number): number {
        let result: number = 0;
        // check high byte, find appropriate handler
        switch (address & 0xF000) {
            case 0:
            case 0x1000:
                if (address < 2048) {
                    result = this.cpu.Rams[address];
                } else {
                    result = address >> 8;
                }
                break;
            case 0x2000:
            case 0x3000:
                result = this.ppu.GetByte(clock, address);
                break;
            case 0x4000:
                switch (address) {
                    case 0x4015:
                        result = this.apu.GetByte(clock, address);
                        break;
                    case 0x4016:
                        result = this.pad1.GetByte(clock, address);
                        break;
                    case 0x4017:
                        result = this.pad2.GetByte(clock, address);
                        break;

                    default:
                        if (this.cart.mapsBelow6000)
                            result = this.cart.GetByte(clock, address);
                        else
                            result = address >> 8;
                        break;
                }
                break;
            case 20480:
                // ??
                result = address >> 8;
                break;
            case 24576:
            case 28672:
            case 32768:
            case 36864:
            case 40960:
            case 45056:
            case 49152:
            case 53248:
            case 57344:
            case 61440:
                // cart 
                result = this.cart.GetByte(clock, address);
                break;
            default:
                throw new Error("Bullshit!");
        }

        return result & 255;
    }

    setByte(clock: number, address: number, data: number): void {
        // check high byte, find appropriate handler
        if (address < 2048) {
            this.cpu.Rams[address & 2047] = data;
            return;
        }
        switch (address & 61440) {
            case 0:
            case 4096:
                // nes sram
                this.cpu.Rams[address & 2047] = data;
                break;
            case 20480:
                this.cart.SetByte(clock, address, data);
                break;
            case 24576:
            case 28672:
            case 32768:
            case 36864:
            case 40960:
            case 45056:
            case 49152:
            case 53248:
            case 57344:
            case 61440:
                // cart rom banks
                this.cart.SetByte(clock, address, data);
                break;
            case 8192:
            case 12288:
                this.ppu.SetByte(clock, address, data);
                break;
            case 16384:
                switch (address) {
                    case 16384:
                    case 16385:
                    case 16386:
                    case 16387:
                    case 16388:
                    case 16389:
                    case 16390:
                    case 16391:
                    case 16392:
                    case 16393:
                    case 16394:
                    case 16395:
                    case 16396:
                    case 16397:
                    case 16398:
                    case 16399:
                    case 16405:
                    case 16407:
                        this.apu.SetByte(clock, address, data);
                        break;
                    case 16404:
                        this.ppu.copySprites(data * 256);
                        this.cpu._currentInstruction_ExtraTiming = this.cpu._currentInstruction_ExtraTiming + 513;
                        if (clock & 1) {
                            this.cpu._currentInstruction_ExtraTiming++;
                        }
                        break;
                    case 16406:
                        this.pad1.SetByte(clock, address, data & 1);
                        this.pad2.SetByte(clock, address, data & 1);
                        break;
                    default:
                        if (this.cart.mapsBelow6000)
                            this.cart.SetByte(clock, address, data);
                }
                break;
        }
    }

}