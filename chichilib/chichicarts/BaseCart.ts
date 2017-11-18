import { ChiChiCPPU } from '../chichi/ChiChiMachine';
import { ChiChiPPU, IChiChiPPU } from '../chichi/ChiChiPPU';
import { CartridgeInfo } from './CartridgeInfo';

import * as crc from 'crc';


export enum NameTableMirroring {

    OneScreen = 0,
    Vertical = 1,
    Horizontal = 2,
    FourScreen = 3
}

export interface IBaseCart {
    mapperName: string;
    supported: boolean;
    submapperId: number;
    ROMHashFunction: string;

    cartInfo: any;

    mapsBelow6000: boolean;
    irqRaised: boolean;

    advanceClock(clock: number): void;
    Whizzler: IChiChiPPU;
    CPU: ChiChiCPPU;

    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: Uint8Array, chrRomData: Uint8Array, chrRomOffset: number): void;

    installCart(ppu:ChiChiPPU, cpu: ChiChiCPPU) : void;

    InitializeCart(): void;

    updateScanlineCounter(): void;

    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    GetPPUByte(clock: number, address: number): number;
    SetPPUByte(clock: number, address: number, data: number): void;
}

export class BaseCart implements IBaseCart {
    cartInfo: any;
    

    static arrayCopy(src: any, spos: number, dest: any, dpos: number, len: number) {
        if (!dest) {
            throw new Error("dest Value cannot be null");
        }

        if (!src) {
            throw new Error("src Value cannot be null");
        }

        if (spos < 0 || dpos < 0 || len < 0) {
            throw new Error("Number was less than the array's lower bound in the first dimension");
        }

        if (len > (src.length - spos) || len > (dest.length - dpos)) {
            throw new Error("Destination array was not long enough. Check destIndex and length, and the array's lower bounds");
        }

        if (spos < dpos && src === dest) {
            while (--len >= 0) {
                dest[dpos + len] = src[spos + len];
            }
        } else {
            for (var i = 0; i < len; i++) {
                dest[dpos + i] = src[spos + i];
            }
        }
    }

    advanceClock(clock: number){}
    fourScreen: boolean = false;
    mapperName: string = 'base';
    supported: boolean = true;
    submapperId: number = 0;
    mapsBelow6000: boolean = false;
    // compatible with .net array.copy method
    // shared components
    nextEventAt = 0;

    prgRomCount = 0;
    chrRomOffset = 0;
    chrRomCount = 0;

    chrRamStart = 0;
    chrRamLength = 0;

    mapperId = 0;

    prgRomBank6 = new Uint8Array(<any>new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));

    // starting locations of PPU 0x0000-0x3FFF in 1k blocks
    ppuBankStarts: Uint32Array = new Uint32Array(<any>new SharedArrayBuffer(16 * Uint32Array.BYTES_PER_ELEMENT));

    // starting locations of PRG rom 0x6000-0xFFFF in 4K blocks
    prgBankStarts: Uint32Array = new Uint32Array(<any>new SharedArrayBuffer(10 * Uint32Array.BYTES_PER_ELEMENT))

    iNesHeader = new Uint8Array(16);
    romControlBytes = new Uint8Array(2);

    nesCart: Uint8Array = null;
    chrRom: Uint8Array = null;

    get current6() : number {
        return this.prgBankStarts[0] / 8192;
    };

    get current8() : number {
        return this.prgBankStarts[2] / 8192;
    };
    get currentA() : number {
        return this.prgBankStarts[4] / 8192;
    };
    get currentC() : number {
        return this.prgBankStarts[6] / 8192;
    };
    get currentE() : number {
        return this.prgBankStarts[8] / 8192;
    };

    SRAMCanWrite = false;
    SRAMEnabled = false;
    private SRAMCanSave = false;

    ROMHashFunction: string = null;
    private mirroring = -1;
    updateIRQ: () => void = () => {
        this.NMIHandler();
    };

    bankSwitchesChanged = false;
    oneScreenOffset = 0

    // external api
    get NumberOfPrgRoms(): number {
        return this.prgRomCount;
    }

    get NumberOfChrRoms(): number {
        return this.chrRomCount;
    }
    get MapperID(): number {
        return this.mapperId;
    }

    get MapperName(): string {
        return this.mapperName;
    }

    irqRaised = false;
    Debugging: boolean;
    DebugEvents: any = null;
    Whizzler: ChiChiPPU;
    CheckSum: string;
    CPU: ChiChiCPPU;
    SRAM: any;
    CartName: string;
    NMIHandler: () => void;

    usesSRAM: boolean = false;
    //ChrRamStart: number;

    constructor() {
        this.prgRomBank6.fill(0);

        for (var i = 0; i < 16; i++) {
            this.ppuBankStarts[i] = i * 0x400;
        }
        for (var i = 0; i < 8; i++) {
            this.prgBankStarts[i] = i * 0x1000;
        }
    }

    ClearDebugEvents(): void {
        //this.DebugEvents.clear();
    }

    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: Uint8Array, chrRomData: Uint8Array, chrRomOffset: number, cartInfo?: CartridgeInfo): void {
        this.cartInfo = cartInfo;
        this.romControlBytes[0] = header[6];
        this.romControlBytes[1] = header[7];

        this.mapperId = (this.romControlBytes[0] & 240) >> 4;
        this.mapperId = (this.mapperId + (this.romControlBytes[1] & 240)) | 0;

        this.chrRomOffset = chrRomOffset;
        /* 
        .NES file format
        ---------------------------------------------------------------------------
        0-3      String "NES^Z" used to recognize .NES files.
        4        Number of 16kB ROM banks.
        5        Number of 8kB VROM banks.
        6        bit 0     1 for vertical mirroring, 0 for horizontal mirroring
                bit 1     1 for battery-backed RAM at $6000-$7FFF
                bit 2     1 for a 512-byte trainer at $7000-$71FF
                bit 3     1 for a four-screen VRAM layout 
                bit 4-7   Four lower bits of ROM Mapper Type.
        7        bit 0-3   Reserved, must be zeroes!
                bit 4-7   Four higher bits of ROM Mapper Type.
        8-15     Reserved, must be zeroes!
        16-...   ROM banks, in ascending order. If a trainer i6s present, its
                512 bytes precede the ROM bank contents.
        ...-EOF  VROM banks, in ascending order.
        ---------------------------------------------------------------------------
        */
        this.iNesHeader = new Uint8Array(header.slice(0, 16));
        //System.Array.copy(header, 0, this.iNesHeader, 0, header.length);
        this.prgRomCount = prgRoms;
        this.chrRomCount = chrRoms;

        //  this.nesCart = System.Array.init(prgRomData.length, 0, System.Byte);
        // System.Array.copy(prgRomData, 0, this.nesCart, 0, prgRomData.length);

        this.nesCart = new Uint8Array(prgRomData.length);
        BaseCart.arrayCopy(prgRomData, 0, this.nesCart, 0, prgRomData.length);

        if (this.chrRomCount === 0) {
            // chrRom is going to be RAM
            chrRomData = new Uint8Array(32768); //System.Array.init(32768, 0, System.Byte);
            chrRomData.fill(0);
        }

        const chrRomBuffer = new SharedArrayBuffer((chrRomData.length + 4096) * Uint8Array.BYTES_PER_ELEMENT)
        this.chrRom = new Uint8Array(<any>chrRomBuffer);//     System.Array.init(((chrRomData.length + 4096) | 0), 0, System.Int32);

        this.chrRamStart = chrRomData.length;
        this.chrRamLength  = 4096;

        BaseCart.arrayCopy(chrRomData, 0, this.chrRom, 0, chrRomData.length);

        this.prgRomCount = this.iNesHeader[4];
        this.chrRomCount = this.iNesHeader[5];


        this.romControlBytes[0] = this.iNesHeader[6];
        this.romControlBytes[1] = this.iNesHeader[7];

        this.usesSRAM = (this.romControlBytes[0] & 2) === 2;

    }

    installCart(ppu: ChiChiPPU, cpu: ChiChiCPPU) {
        this.Whizzler = ppu;
        this.CPU = cpu;

        //setup mirroring 
        this.mirror(0, 0);
        if ((this.romControlBytes[0] & 1) === 1) {
            this.mirror(0, 1);
        } else {
            this.mirror(0, 2);
        }

        this.fourScreen = (this.romControlBytes[0] & 8) === 8; 

        if ((this.romControlBytes[0] & 8) === 8) {
            this.mirror(0, 3);
        }
        // initialize
        this.InitializeCart();
    }
    ramMask = 0x1fff;
    GetByte(clock: number, address: number): number {
        let bank = (address >> 12) - 0x6;
        if ( bank < 2) {
            if (this.usesSRAM) {
                return this.prgRomBank6[address & this.ramMask];
            }else {
                return address >> 8;
            }
        }

        return this.nesCart[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    }

    peekByte(address: number) {
        return this.nesCart[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    }

    setPrgRam(address: number, data: number) {
        if (address >= 0x6000 && address <= 0x7fff) {
            this.prgRomBank6[address & 0x1fff] = data;
        }
    }

    SetByte(clock: number, address: number, data: number): void {
        if (this.usesSRAM) {
            this.setPrgRam(address, data);
        }
    }

    GetPPUByte(clock: number, address: number): number {
        var bank = address >> 10 ;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);

        return this.chrRom[newAddress];
    }

    SetPPUByte(clock: number, address: number, data: number): void {
        var bank = address >> 10; //, 1024)) | 0;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        this.chrRom[newAddress] = data;
    }

    Setup6BankStarts(reg6: number, reg8: number, regA: number, regC: number, regE: number): void {
        reg6 = this.MaskBankAddress(reg6);
        this.prgBankStarts[0] = reg6 * 8192;
        this.prgBankStarts[1] = (this.prgBankStarts[0] + 4096);
        this.SetupBankStarts(reg8, regA, regC, regE);

    }

    SetupBankStarts(reg8: number, regA: number, regC: number, regE: number): void {
        reg8 = this.MaskBankAddress(reg8);
        regA = this.MaskBankAddress(regA);
        regC = this.MaskBankAddress(regC);
        regE = this.MaskBankAddress(regE);
        this.prgBankStarts[2] = reg8 * 8192;
        this.prgBankStarts[3] = (this.prgBankStarts[2] + 4096);
        this.prgBankStarts[4] = regA * 8192;
        this.prgBankStarts[5] = (this.prgBankStarts[4] + 4096);
        this.prgBankStarts[6] = regC * 8192;
        this.prgBankStarts[7] = (this.prgBankStarts[6] + 4096);
        this.prgBankStarts[8] = regE * 8192;
        this.prgBankStarts[9] = (this.prgBankStarts[8] + 4096);

    }

    setupBanks4k(start: number, banks: number[]) {
        banks = banks.map((bank)=> {
            if (bank >= this.prgRomCount * 4) {
                let i = 0xFFFF;
                while ((bank & i) >= this.prgRomCount * 4) {
                    i = i >> 1;
                }
                return (bank & i);
            } else {
                return bank;
            }
        });
        for (let i = 0; i < banks.length; ++i ) {
            if (i >= this.prgBankStarts.length) {
                break;
            }
            this.prgBankStarts[start + i] = banks[i] * 4096;
        }
    }


    MaskBankAddress(bank: number): number {
        if (bank >= this.prgRomCount * 2) {
            var i = 255;
            while ((bank & i) >= this.prgRomCount * 2) {
                i = i >> 1;
            }
            return (bank & i);
        } else {
            return bank;
        }
    }

    WriteState(state: any): void {
        // throw new Error('Method not implemented.');
    }

    ReadState(state: any): void {
        // throw new Error('Method not implemented.');
    }

    HandleEvent(Clock: number): void {
        //  throw new Error('Method not implemented.');
    }

    ResetClock(Clock: number): void {
        // throw new Error('Method not implemented.');
    }


    // 0 - onescreen, 1 -v, 2- h, 3 - fourscreen
    mirror(clockNum: number, mirroring: number): void {
        this.mirroring = mirroring;

        switch (mirroring) {
            case 0:
                this.ppuBankStarts[8] = (this.chrRamStart  + this.oneScreenOffset);
                this.ppuBankStarts[9] = (this.chrRamStart  + this.oneScreenOffset);
                this.ppuBankStarts[10] = (this.chrRamStart + this.oneScreenOffset);
                this.ppuBankStarts[11] = (this.chrRamStart  + this.oneScreenOffset);
                break;
            case 1:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024);
                this.ppuBankStarts[10] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) ;
                break;
            case 2:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[9] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[10] = (this.chrRamStart + 1024);
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) ;
                break;
            case 3:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) ;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024) ;
                this.ppuBankStarts[10] = (this.chrRamStart + 2048);
                this.ppuBankStarts[11] = (this.chrRamStart + 3072);
                break;
        }
    }

    // utility functions used by mappers
    // CopyBanksXX sets up chrRom bankswitching
    copyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void {

        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }

        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf8kBanks << 3); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
    }

    copyBanks4k(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        

        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 2;
        }

        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
    }

    copyBanks2k(clock: number, dest: number, src: number, numberOf2kBanks: number): void {

        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 4;
        }


        var oneKsrc = src << 1;
        var oneKdest = dest << 1;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    }
    
    copyBanks1k(clock: number, dest: number, src: number, numberOf1kBanks: number): void {
        
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 8;
        }

        var oneKsrc = src ;
        var oneKdest = dest ;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < numberOf1kBanks ; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
    }        

    InitializeCart(reset?: boolean): void {
        //throw new Error('Method not implemented.');
    }

    updateScanlineCounter(): void {
        //throw new Error('Method not implemented.');
    }

}

export class UnsupportedCart extends BaseCart {
    supported: boolean = false;
    InitializeCart(): void {
        this.mapperName = 'unsupported';
        // maybe this will work - give it a go!
        this.SetupBankStarts(0, 1,(this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
        this.mirror(0, 0);
     }
}
