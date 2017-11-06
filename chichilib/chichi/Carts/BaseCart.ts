import { ChiChiCPPU } from '../ChiChiMachine';
import { ChiChiPPU } from '../ChiChiPPU';
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

    mapsBelow6000: boolean;
    irqRaised: boolean;
    nextEventAt: number;
    handleNextEvent(clock: number): void;
    advanceClock(clock: number): void;
    Whizzler: ChiChiPPU;
    CPU: ChiChiCPPU;

    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: Uint8Array, chrRomData: Uint8Array, chrRomOffset: number): void;

    InitializeCart(): void;
    ResetBankStartCache(): void;
    UpdateScanlineCounter(): void;

    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    GetPPUByte(clock: number, address: number): number;
    SetPPUByte(clock: number, address: number, data: number): void;
}

export class BaseCart implements IBaseCart {
    handleNextEvent(clock: number){};
    advanceClock(clock: number){}
    fourScreen: boolean = false;
    mapperName: string = 'base';
    supported: boolean = true;
    submapperId: number = 0;
    mapsBelow6000: boolean = false;
    // compatible with .net array.copy method
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

    // shared components
    nextEventAt = 0;
    
    prgRomBank6 = new Uint8Array(<any>new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));
    ppuBankStarts: Uint32Array = new Uint32Array(<any>new SharedArrayBuffer(16 * Uint32Array.BYTES_PER_ELEMENT));
    bankStartCache = new Uint32Array(<any>new SharedArrayBuffer(4096 * Uint32Array.BYTES_PER_ELEMENT));

    iNesHeader = new Uint8Array(16);
    romControlBytes = new Uint8Array(2);

    nesCart: Uint8Array = null;
    chrRom: Uint8Array = null;

    current8 = -1;
    currentA = -1;
    currentC = -1;
    currentE = -1;

    SRAMCanWrite = false;
    SRAMEnabled = false;
    private SRAMCanSave = false;
    prgRomCount = 0;
    chrRomOffset = 0;
    chrRamStart = 0;
    chrRomCount = 0;
    mapperId = 0;

    bank8start = 0;
    bankAstart = 0;
    bankCstart = 0;
    bankEstart = 0;


    ROMHashFunction: string = null;
    checkSum: any = null;
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
    //IRQAsserted: boolean;
    //NextEventAt: number;
    //PpuBankStarts: any;
    //BankStartCache: any;
    CurrentBank: number = 0;

    //BankSwitchesChanged: boolean;
    //OneScreenOffset: number;
    UsesSRAM: boolean = false;
    //ChrRamStart: number;

    constructor() {
        this.prgRomBank6.fill(0);

        for (var i = 0; i < 16; i = (i + 1) | 0) {
            this.ppuBankStarts[i] = i * 1024;
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

        BaseCart.arrayCopy(chrRomData, 0, this.chrRom, 0, chrRomData.length);

        this.prgRomCount = this.iNesHeader[4];
        this.chrRomCount = this.iNesHeader[5];


        this.romControlBytes[0] = this.iNesHeader[6];
        this.romControlBytes[1] = this.iNesHeader[7];

        this.SRAMCanSave = (this.romControlBytes[0] & 2) === 2;
        this.SRAMEnabled = true;

        this.UsesSRAM = (this.romControlBytes[0] & 2) === 2;

        // rom0.0=0 is horizontal mirroring, rom0.0=1 is vertical mirroring

        // by default  have to call Mirror() at least once to set up the bank offsets
        this.Mirror(0, (this.romControlBytes[0] & 1) + 1);

        this.fourScreen = (this.romControlBytes[0] & 8) === 8; 

        if ((this.romControlBytes[0] & 8) === 8) {
            this.Mirror(0, 3);
        }


        this.checkSum = ""; //ROMHashFunction(nesCart, chrRom);

        this.InitializeCart();
    }

    GetByte(clock: number, address: number): number {
        var bank = 0;

        switch (address & 0xE000) {
            case 0x6000:
                return this.prgRomBank6[address & 0x1FFF];
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
        }
        return this.nesCart[bank + (address & 0x1FFF)];

    }

    SetByte(clock: number, address: number, data: number): void {
        // throw new Error('Method not implemented.');
    }

    GetPPUByte(clock: number, address: number): number {
        var bank = address >> 10 ;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);

        //while (newAddress > chrRamStart)
        //{
        //    newAddress -= chrRamStart;
        //}
        return this.chrRom[newAddress];
    }

    SetPPUByte(clock: number, address: number, data: number): void {
        var bank = address >> 10; //, 1024)) | 0;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        this.chrRom[newAddress] = data;
    }

    SetupBankStarts(reg8: number, regA: number, regC: number, regE: number): void {
        reg8 = this.MaskBankAddress(reg8);
        regA = this.MaskBankAddress(regA);
        regC = this.MaskBankAddress(regC);
        regE = this.MaskBankAddress(regE);

        this.current8 = reg8;
        this.currentA = regA;
        this.currentC = regC;
        this.currentE = regE;
        this.bank8start = reg8 * 8192;
        this.bankAstart = regA * 8192;
        this.bankCstart = regC * 8192;
        this.bankEstart = regE * 8192;
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

    ResetBankStartCache(): void {
        // if (currentBank > 0)
        this.CurrentBank = 0;
        // Array.Clear(bankStartCache, 0, 16 * 256 * 256);
        //System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, 0, 16);
        // this.bankStartCache.fill(0);
        // for (let i = 0; i < 16; ++i) {
        //     this.bankStartCache[i] = this.ppuBankStarts[i];
        // }
        //Mirror(-1, this.mirroring);
        //chrRamStart = ppuBankStarts[8];
        //Array.Copy(ppuBankStarts, 0, bankStartCache[0], 0, 16 * 4);
        //bankSwitchesChanged = false;
    }

    UpdateBankStartCache(): number {
        this.CurrentBank = 0;// (this.CurrentBank + 1) | 0;

        // for (let i = 0; i < 16; ++i) {
        //     this.bankStartCache[(this.CurrentBank * 16) + i] = this.ppuBankStarts[i];
        // }
        //System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, this.CurrentBank * 16, 16);

        this.Whizzler.UpdatePixelInfo();
        return this.CurrentBank;
    }

    ActualChrRomOffset(address: number): number {
        var bank = address >> 10 | 0;
        //int newAddress = ppuBankStarts[bank] + (address & 0x3FF);
        var newAddress = (this.bankStartCache[(this.CurrentBank * 16) + bank ] + (address & 1023));

        return newAddress;
    }

    Mirror(clockNum: number, mirroring: number): void {


        //    //            A11 A10 Effect
        //    //----------------------------------------------------------
        //    // 0   0  All four screen buffers are mapped to the same
        //    //        area of memory which repeats at $2000, $2400,
        //    //        $2800, and $2C00.
        //    // 0   x  "Upper" and "lower" screen buffers are mapped to
        //    //        separate areas of memory at $2000, $2400 and
        //    //        $2800, $2C00. ( horizontal mirroring)
        //    // x   0  "Left" and "right" screen buffers are mapped to
        //    //        separate areas of memory at $2000, $2800 and
        //    //        $2400,$2C00.  (vertical mirroring)
        //    // x   x  All four screen buffers are mapped to separate
        //    //        areas of memory. In this case, the cartridge
        //    //        must contain 2kB of additional VRAM 



        this.mirroring = mirroring;

        if (clockNum > -1) {
            this.Whizzler.DrawTo(clockNum);
        }

        //Console.WriteLine("Mirroring set to {0}", mirroring);

        switch (mirroring) {
            case 0:
                this.ppuBankStarts[8] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                this.ppuBankStarts[9] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                this.ppuBankStarts[10] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                this.ppuBankStarts[11] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                break;
            case 1:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024) | 0;
                this.ppuBankStarts[10] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) | 0;
                break;
            case 2:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[9] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[10] = (this.chrRamStart + 1024) | 0;
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) | 0;
                break;
            case 3:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024) | 0;
                this.ppuBankStarts[10] = (this.chrRamStart + 2048) | 0;
                this.ppuBankStarts[11] = (this.chrRamStart + 3072) | 0;
                break;
        }
        this.UpdateBankStartCache();
        this.Whizzler.UpdatePixelInfo();


    }

    // utility functions used by mappers
    // CopyBanksXX sets up chrRom bankswitching
    CopyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void {

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
        this.UpdateBankStartCache();
    }

    CopyBanks4k(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        

        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }

        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
        this.UpdateBankStartCache();
    }

    CopyBanks2k(clock: number, dest: number, src: number, numberOf2kBanks: number): void {
        
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }

        var oneKsrc = src << 1;
        var oneKdest = dest << 1;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
        this.UpdateBankStartCache();
    }
    
    CopyBanks1k(clock: number, dest: number, src: number, numberOf1kBanks: number): void {
        
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }

        var oneKsrc = src ;
        var oneKdest = dest ;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < numberOf1kBanks ; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
        this.UpdateBankStartCache();
    }        

    InitializeCart(): void {
        //throw new Error('Method not implemented.');
    }

    UpdateScanlineCounter(): void {
        //throw new Error('Method not implemented.');
    }

}

export class BaseCart4k implements IBaseCart {
    handleNextEvent(clock: number){};
    advanceClock(clock: number){}    
    mapperName: string = 'base';
    supported: boolean = true;
    submapperId: number = 0;
    mapsBelow6000: boolean = false;
    nextEventAt: number = 0;
    // compatible with .net array.copy method
    // shared components

    prgRomBank6 = new Uint8Array(<any>new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));
    ppuBankStarts: Uint32Array = new Uint32Array(<any>new SharedArrayBuffer(16 * Uint32Array.BYTES_PER_ELEMENT));
    bankStartCache = new Uint32Array(<any>new SharedArrayBuffer(4096 * Uint32Array.BYTES_PER_ELEMENT));

    private iNesHeader = new Uint8Array(16);

    private romControlBytes = new Uint8Array(2);
    nesCart: Uint8Array = null;
    chrRom: Uint8Array = null;

    current8 = -1;
    current9 = -1;
    currentA = -1;
    currentB = -1;
    currentC = -1;
    currentD = -1;
    currentE = -1;
    currentF = -1;

    SRAMCanWrite = false;
    SRAMEnabled = false;
    private SRAMCanSave = false;
    prgRomCount = 0;
    chrRomOffset = 0;
    chrRamStart = 0;
    chrRomCount = 0;
    mapperId = 0;

    bank8start = 0;
    bank9start = 0;
    bankAstart = 0;
    bankBstart = 0;
    bankCstart = 0;
    bankDstart = 0;
    bankEstart = 0;
    bankFstart = 0;
    

    ROMHashFunction: string = null;
    checkSum: any = null;
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
    //IRQAsserted: boolean;
    //NextEventAt: number;
    //PpuBankStarts: any;
    //BankStartCache: any;
    CurrentBank: number = 0;

    //BankSwitchesChanged: boolean;
    //OneScreenOffset: number;
    UsesSRAM: boolean = false;
    //ChrRamStart: number;

    constructor() {
        this.prgRomBank6.fill(0);

        for (var i = 0; i < 16; i = (i + 1) | 0) {
            this.ppuBankStarts[i] = i * 1024;
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

        BaseCart.arrayCopy(chrRomData, 0, this.chrRom, 0, chrRomData.length);

        this.prgRomCount = this.iNesHeader[4];
        this.chrRomCount = this.iNesHeader[5];


        this.romControlBytes[0] = this.iNesHeader[6];
        this.romControlBytes[1] = this.iNesHeader[7];

        this.SRAMCanSave = (this.romControlBytes[0] & 2) === 2;
        this.SRAMEnabled = true;

        this.UsesSRAM = (this.romControlBytes[0] & 2) === 2;

        // rom0.0=0 is horizontal mirroring, rom0.0=1 is vertical mirroring

        // by default  have to call Mirror() at least once to set up the bank offsets
        this.Mirror(0, 0);
        if ((this.romControlBytes[0] & 1) === 1) {
            this.Mirror(0, 1);
        } else {
            this.Mirror(0, 2);
        }

        if ((this.romControlBytes[0] & 8) === 8) {
            this.Mirror(0, 3);
        }


        this.checkSum = ""; //ROMHashFunction(nesCart, chrRom);

        this.InitializeCart();
    }

    GetByte(clock: number, address: number): number {
        var bank = 0;

        switch (address & 0xF000) {
            case 0x6000:
            case 0x7000:
                return this.prgRomBank6[address & 0x1FFF];
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0x9000:
                bank = this.bank9start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xB000:
                bank = this.bankBstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xD000:
                bank = this.bankDstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
            case 0xF000:
                bank = this.bankFstart;
                break;
        }
        return this.nesCart[bank + (address & 0xFFF)];

    }
    
    SetByte(clock: number, address: number, data: number): void {
        // throw new Error('Method not implemented.');
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

    SetupBankStarts(reg8: number, reg9: number, regA: number, regB: number, regC: number, regD: number, regE: number, regF: number): void {
        this.current8 = reg8 = this.maskBankAddress(reg8);
        this.current9 = reg9 = this.maskBankAddress(reg9);
        this.currentA = regA = this.maskBankAddress(regA);
        this.currentB = regB = this.maskBankAddress(regB);
        this.currentC = regC = this.maskBankAddress(regC);
        this.currentD = regD = this.maskBankAddress(regD);
        this.currentE = regE = this.maskBankAddress(regE);
        this.currentF = regF = this.maskBankAddress(regF);

        this.bank8start = reg8 * 4096;
        this.bank9start = reg9 * 4096;
        this.bankAstart = regA * 4096;
        this.bankBstart = regB * 4096;
        this.bankCstart = regC * 4096;
        this.bankDstart = regD * 4096;
        this.bankEstart = regE * 4096;
        this.bankFstart = regF * 4096;
    }

    maskBankAddress(bank: number): number {
        if (bank >= this.prgRomCount * 4) {
            let i = 0xFFFF;
            while ((bank & i) >= this.prgRomCount * 4) {
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

    ResetBankStartCache(): void {
        // if (currentBank > 0)
        this.CurrentBank = 0;
        // Array.Clear(bankStartCache, 0, 16 * 256 * 256);
        //System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, 0, 16);
        this.bankStartCache.fill(0);
        for (let i = 0; i < 16; ++i) {
            this.bankStartCache[i] = this.ppuBankStarts[i];
        }
        //Mirror(-1, this.mirroring);
        //chrRamStart = ppuBankStarts[8];
        //Array.Copy(ppuBankStarts, 0, bankStartCache[0], 0, 16 * 4);
        //bankSwitchesChanged = false;
    }

    UpdateBankStartCache(): number {
        this.CurrentBank = 0;// (this.CurrentBank + 1) | 0;

        for (let i = 0; i < 16; ++i) {
            this.bankStartCache[(this.CurrentBank * 16) + i] = this.ppuBankStarts[i];
        }
        //System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, this.CurrentBank * 16, 16);

        this.Whizzler.UpdatePixelInfo();
        return this.CurrentBank;
    }

    ActualChrRomOffset(address: number): number {
        var bank = address >> 10 | 0;
        //int newAddress = ppuBankStarts[bank] + (address & 0x3FF);
        var newAddress = (this.bankStartCache[(this.CurrentBank * 16) + bank ] + (address & 1023));

        return newAddress;
    }

    Mirror(clockNum: number, mirroring: number): void {


        //    //            A11 A10 Effect
        //    //----------------------------------------------------------
        //    // 0   0  All four screen buffers are mapped to the same
        //    //        area of memory which repeats at $2000, $2400,
        //    //        $2800, and $2C00.
        //    // 0   x  "Upper" and "lower" screen buffers are mapped to
        //    //        separate areas of memory at $2000, $2400 and
        //    //        $2800, $2C00. ( horizontal mirroring)
        //    // x   0  "Left" and "right" screen buffers are mapped to
        //    //        separate areas of memory at $2000, $2800 and
        //    //        $2400,$2C00.  (vertical mirroring)
        //    // x   x  All four screen buffers are mapped to separate
        //    //        areas of memory. In this case, the cartridge
        //    //        must contain 2kB of additional VRAM 



        this.mirroring = mirroring;

        if (clockNum > -1) {
            this.Whizzler.DrawTo(clockNum);
        }

        //Console.WriteLine("Mirroring set to {0}", mirroring);

        switch (mirroring) {
            case 0:
                this.ppuBankStarts[8] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                this.ppuBankStarts[9] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                this.ppuBankStarts[10] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                this.ppuBankStarts[11] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                break;
            case 1:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024) | 0;
                this.ppuBankStarts[10] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) | 0;
                break;
            case 2:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[9] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[10] = (this.chrRamStart + 1024) | 0;
                this.ppuBankStarts[11] = (this.chrRamStart + 1024) | 0;
                break;
            case 3:
                this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                this.ppuBankStarts[9] = (this.chrRamStart + 1024) | 0;
                this.ppuBankStarts[10] = (this.chrRamStart + 2048) | 0;
                this.ppuBankStarts[11] = (this.chrRamStart + 3072) | 0;
                break;
        }
        this.UpdateBankStartCache();
        this.Whizzler.UpdatePixelInfo();


    }

    // utility functions used by mappers
    // CopyBanksXX sets up chrRom bankswitching
    CopyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void {

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
        this.UpdateBankStartCache();
    }

    CopyBanks4k(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        

        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }

        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
        this.UpdateBankStartCache();
    }

    CopyBanks2k(clock: number, dest: number, src: number, numberOf2kBanks: number): void {
        
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }

        var oneKsrc = src << 1;
        var oneKdest = dest << 1;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
        this.UpdateBankStartCache();
    }
    
    CopyBanks1k(clock: number, dest: number, src: number, numberOf1kBanks: number): void {
        
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }

        var oneKsrc = src ;
        var oneKdest = dest ;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < numberOf1kBanks ; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;

        }
        this.UpdateBankStartCache();
    }        

    InitializeCart(): void {
        //throw new Error('Method not implemented.');
    }

    UpdateScanlineCounter(): void {
        //throw new Error('Method not implemented.');
    }

}

export class UnsupportedCart extends BaseCart {
    supported: boolean = false;
    InitializeCart(): void {
        this.mapperName = 'unsupported';
        
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
     }
}
