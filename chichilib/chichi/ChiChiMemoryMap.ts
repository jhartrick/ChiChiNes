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

export class MemoryMap implements IMemoryMap {
    ppu: IChiChiPPU;
    apu: IChiChiAPU;
    pad1: ChiChiInputHandler;
    pad2: ChiChiInputHandler;

    // system ram
    Rams = new Uint8Array(<any>new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));// System.Array.init(vv, 0, System.Int32);

    get irqRaised(): boolean {
        return this.cart.irqRaised || this.apu.interruptRaised;
    }


    constructor(
        public cpu: IChiChiCPPU, 
        public cart: IBaseCart
    ) {
        this.apu = cpu.SoundBopper;
        this.ppu = cpu.ppu;
        this.pad1 = cpu.PadOne;
        this.pad2 = cpu.PadTwo;
        this.cart = cart;

        this.ppu.memoryMap = this;
        this.apu.memoryMap = this;
    }

    private lastAddress = 0;

    getByte(clock: number, address: number): number {

        let result: number = 0;
        // check high byte, find appropriate handler
        switch (address & 0xF000) {
            case 0:
            case 0x1000:
                if (address < 2048) {
                    result = this.Rams[address];
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
                            result = this.cart.getByte(clock, address);
                        else
                            result = address >> 8;
                        break;
                }
                break;
            case 0x5000:
                // ??
                result = address >> 8;
                break;
            case 0x6000:
            case 0x7000:
            case 0x8000:
            case 0x9000:
            case 0xa000:
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
            case 0xf000:
                // cart 
                result = this.cart.getByte(clock, address);
                break;
            default:
                throw new Error("Bullshit!");
        }

        return result & 255;
    }

    setByte(clock: number, address: number, data: number): void {


        // check high byte, find appropriate handler
        if (address < 2048) {
            this.Rams[address & 2047] = data;
            return;
        }
        switch (address & 61440) {
            case 0:
            case 0x1000:
                // nes sram
                this.Rams[address & 2047] = data;
                break;
            case 20480:
                this.cart.setByte(clock, address, data);
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
                this.cart.setByte(clock, address, data);
                break;
            case 8192:
            case 12288:
                this.ppu.SetByte(clock, address, data);
                break;
            case 16384:
            
                switch (address) {
                    case 0x4000:
                    case 0x4001:
                    case 0x4002:
                    case 0x4003:
                    case 0x4004:
                    case 0x4005:
                    case 0x4006:
                    case 0x4007:
                    case 0x4008:
                    case 0x4009:
                    case 0x400a:
                    case 0x400b:
                    case 0x400c:
                    case 0x400d:
                    case 0x400e:
                    case 0x400f:
                    case 0x4010:
                    case 0x4011:
                    case 0x4012:
                    case 0x4013:
                    
                    case 0x4015:
                    case 0x4017:
                        this.apu.SetByte(clock, address, data);
                        break;
                    case 0x4014:
                        this.ppu.copySprites(data * 256);
                        this.cpu._currentInstruction_ExtraTiming = this.cpu._currentInstruction_ExtraTiming + 513;
                        if (clock & 1) {
                            this.cpu._currentInstruction_ExtraTiming++;
                        }
                        break;
                    case 0X4016:
                        this.pad1.SetByte(clock, address, (data & 1) | 0x40);
                        this.pad2.SetByte(clock, address,(data & 1) | 0x40);
                        break;
                    default:
                        if (this.cart.mapsBelow6000)
                            this.cart.setByte(clock, address, data);
                }
                break;
        }
    }

    getPPUByte(clock: number, address: number): number {

        return this.cart.getPPUByte(clock, address);
    }

    setPPUByte(clock: number, address: number, data: number): void {


        this.cart.setPPUByte(clock, address, data);
    }

    advanceClock(value: number) {
        this.apu.advanceClock(value);
        this.ppu.advanceClock(value);
        this.cart.advanceClock(value);
    }

    advanceScanline(value: number) {
        while(value-- >= 0) {
            this.cart.updateScanlineCounter();
        }
    }

    setupStateBuffer(sb: StateBuffer) {
        sb.onRestore.subscribe((buffer: StateBuffer) => {
            this.Rams = buffer.getUint8Array('rams');
        })

        sb  .pushSegment(8192 * Uint8Array.BYTES_PER_ELEMENT, 'rams');
        return sb;

    }

    
}