import { ChiChiCPPU } from '../chichi/ChiChiCPU';
import { ChiChiPPU, IChiChiPPU, IChiChiPPUState } from '../chichi/ChiChiPPU';

import * as crc from 'crc';
import { MemoryMap, IMemoryMap } from '../chichi/ChiChiMemoryMap';


export enum NameTableMirroring {

    OneScreen = 0,
    Vertical = 1,
    Horizontal = 2,
    FourScreen = 3
}

export interface IBaseCartState  {

    irqRaised: boolean;
    
    chrRamStart: number;
    chrRamLength: number;

    iNesHeader: Uint8Array;
    prgRomBank6: Uint8Array;

    // starting locations of PPU 0x0000-0x3FFF in 1k blocks
    ppuBankStarts: Uint32Array;
    // starting locations of PRG rom 0x6000-0xFFFF in 4K blocks
    prgBankStarts: Uint32Array; 

    romControlBytes: Uint8Array;
}

export interface IBaseCart extends IBaseCartState {

    nesCart: Uint8Array;
    chrRom: Uint8Array;

    customPalette: number[];
    mapperName: string;
    supported: boolean;
    submapperId: number;
    ROMHashFunction: string;
    usesSRAM: boolean;
    batterySRAM: boolean;
    
    mapsBelow6000: boolean;
    prgRomCount: number;
    chrRomOffset: number;
    chrRomCount: number;
    mapperId: number;

    advanceClock(clock: number): void;
    Whizzler: IChiChiPPU;
    CPU: ChiChiCPPU;

    createMemoryMap(cpu: ChiChiCPPU): IMemoryMap;

    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: Uint8Array, chrRomData: Uint8Array, chrRomOffset: number): void;

    installCart(ppu:ChiChiPPU, cpu: ChiChiCPPU) : void;

    InitializeCart(): void;

    updateScanlineCounter(): void;

    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    GetPPUByte(clock: number, address: number): number;
    SetPPUByte(clock: number, address: number, data: number): void;

    state: IBaseCartState;
    
}

export class BaseCart implements IBaseCart {
    batterySRAM: boolean = false;
    customPalette: number[];
    ramMask = 0x1fff;
    
    
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

    prgRomBank6 = new Uint8Array(<any>new SharedArrayBuffer(0x2000 * Uint8Array.BYTES_PER_ELEMENT));

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

    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: Uint8Array, chrRomData: Uint8Array, chrRomOffset: number): void {
        
        this.romControlBytes[0] = header[6];
        this.romControlBytes[1] = header[7];

        this.mapperId = (this.romControlBytes[0] & 240) >> 4;
        this.mapperId = (this.mapperId + (this.romControlBytes[1] & 240)) | 0;

        this.chrRomOffset = chrRomOffset;

        this.iNesHeader = new Uint8Array(header.slice(0, 16));

        this.prgRomCount = prgRoms;
        this.chrRomCount = chrRoms;

        this.nesCart = new Uint8Array(prgRomData.length);
        BaseCart.arrayCopy(prgRomData, 0, this.nesCart, 0, prgRomData.length);

        if (this.chrRomCount === 0) {
            // chrRom is going to be RAM
            chrRomData = new Uint8Array(32768); 
            chrRomData.fill(0);
        }

        const chrRomBuffer = new SharedArrayBuffer((chrRomData.length + 0x2000) * Uint8Array.BYTES_PER_ELEMENT)
        this.chrRom = new Uint8Array(<any>chrRomBuffer);

        this.chrRamStart = chrRomData.length;
        this.chrRamLength  =  0x2000;

        BaseCart.arrayCopy(chrRomData, 0, this.chrRom, 0, chrRomData.length);

        this.prgRomCount = this.iNesHeader[4];
        this.chrRomCount = this.iNesHeader[5];

        for (var i = 0; i < 8; i++) {
            this.ppuBankStarts[i] = i * 0x400;
        }
        for (var i = 0; i < 8; i++) {
            this.prgBankStarts[i] = i * 0x1000;
        }

        this.romControlBytes[0] = this.iNesHeader[6];
        this.romControlBytes[1] = this.iNesHeader[7];

        this.usesSRAM = (this.romControlBytes[0] & 2) === 2;
        this.batterySRAM = (this.romControlBytes[0] & 2) === 2;
        
    }

    installCart(ppu: ChiChiPPU, cpu: ChiChiCPPU) {
        this.Whizzler = ppu;
        this.CPU = cpu;
        // this.CPU.memoryMap = new MemoryMap(this.CPU, this.Whizzler, this.CPU.SoundBopper, this.CPU.PadOne, this.CPU.PadTwo, this);

        ppu.chrRomHandler = this;
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

    createMemoryMap(cpu: ChiChiCPPU): IMemoryMap {
        return new MemoryMap(cpu, this);
    }

    GetByte(clock: number, address: number): number {
        let bank = (address >> 12) - 0x6;
        if (bank < 2) {
            if (this.usesSRAM) {
                return this.prgRomBank6[address & this.ramMask];
            }else {
                return (address >> 8) & 0xff;
            }
        }

        return this.nesCart[this.prgBankStarts[bank] + (address & 0xfff)];
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
        reg6 = reg6 % (this.prgRomCount * 2);
        this.prgBankStarts[0] = reg6 * 8192;
        this.prgBankStarts[1] = (this.prgBankStarts[0] + 4096);
        this.SetupBankStarts(reg8, regA, regC, regE);

    }

    SetupBankStarts(reg8: number, regA: number, regC: number, regE: number): void {
        reg8 = reg8 % (this.prgRomCount * 2);
        regA = regA % (this.prgRomCount * 2);
        regC = regC % (this.prgRomCount * 2);
        regE = regE % (this.prgRomCount * 2);
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
            return bank % (this.prgRomCount << 2);
        });
        for (let i = 0; i < banks.length; ++i ) {
            if (i >= this.prgBankStarts.length) {
                break;
            }
            this.prgBankStarts[start + i] = banks[i] * 4096;
        }
    }


    MaskBankAddress(bank: number): number {
        return bank % (this.prgRomCount * 2);
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
            dest = dest % this.chrRomCount;
        }
        if (src >= this.chrRomCount) {
            src = src % this.chrRomCount;
        }
        const oneKsrc = src << 3;
        const oneKdest = dest << 3;

        for (var i = 0; i < (numberOf8kBanks << 3); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
    }

    copyBanks4k(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        const chrCount = this.chrRomCount << 1;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }

        const oneKsrc = src << 2;
        const oneKdest = dest << 2;
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    }

    copyBanks2k(clock: number, dest: number, src: number, numberOf2kBanks: number): void {

        const chrCount = this.chrRomCount << 2;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }
        

        var oneKsrc = src << 1;
        var oneKdest = dest << 1;

        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    }
    
    copyBanks1k(clock: number, dest: number, src: number, numberOf1kBanks: number): void {
        
        const chrCount = this.chrRomCount << 3;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }
        

        let oneKsrc = src ;
        let oneKdest = dest ;

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

    get state(): IBaseCartState {
        return {
                
            irqRaised: this.irqRaised,
            
            chrRamStart: this.chrRamStart,
            chrRamLength: this.chrRamLength,

            iNesHeader: this.iNesHeader.slice(),
            prgRomBank6: this.prgRomBank6.slice(),

            // starting locations of PPU 0x0000-0x3FFF in 1k blocks
            ppuBankStarts: this.ppuBankStarts.slice(),
            
            // starting locations of PRG rom 0x6000-0xFFFF in 4K blocks
            prgBankStarts: this.prgBankStarts.slice(),

            romControlBytes: this.romControlBytes.slice(),


        }
    }

    set state(value: IBaseCartState) {

        this.irqRaised = value.irqRaised;
        
        this.chrRamStart = value.chrRamStart;
        this.chrRamLength = value.chrRamLength;

        for (let i = 0; i < this.prgRomBank6.length; ++i) {
            this.prgRomBank6[i] = value.prgRomBank6[i];
        }
                            
        for (let i = 0; i < this.ppuBankStarts.length; ++i) {
            this.ppuBankStarts[i] = value.ppuBankStarts[i];
        }

        for (let i = 0; i < this.prgBankStarts.length; ++i) {
            this.prgBankStarts[i] = value.prgBankStarts[i];
        }

        for (let i = 0; i < this.romControlBytes.length; ++i) {
            this.romControlBytes[i] = value.romControlBytes[i];
        }


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
