import { ChiChiCPPU } from './ChiChiMachine';
import { ChiChiPPU } from './ChiChiPPU';
import * as crc from 'crc';

export class iNESFileHandler  {
    
            static LoadROM(cpu: ChiChiCPPU, thefile: number[]): BaseCart  {
                let _cart: BaseCart = null;
    
                let iNesHeader = thefile.slice(0, 16);
                let bytesRead = 16;
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
                16-...   ROM banks, in ascending order. If a trainer is present, its
                512 bytes precede the ROM bank contents.
                ...-EOF  VROM banks, in ascending order.
                ---------------------------------------------------------------------------
                */
                let mapperId = (iNesHeader[6] & 240);
                mapperId = mapperId >> 4;
                mapperId = mapperId | (iNesHeader[7] & 0xF0);
    
                
                // byte 7  lower bits PC10/VSUNI, xxPV 
                let isPC10 = (iNesHeader[7] & 0x2) == 0x2;
                let isVS = (iNesHeader[7] & 0x1) == 0x01;
                


// NES2.0 stuff 
                mapperId |= (iNesHeader[8] & 0xF) << 8;
                let submapperId = iNesHeader[8] >> 4;
// Byte 9 (Upper bits of ROM size)
                let upperPrgRomSize = iNesHeader[9] & 0xF;
                console.log('upperprgrom ' + upperPrgRomSize);
                let upperChrRomSize = (iNesHeader[9] & 0xF0) >> 4;
                console.log('upperChrRom ' + upperChrRomSize);
// byte 10 (RAM Size) 
                let prgRamBanks = iNesHeader[10]  & 0xF;
                let prgRamBanks_batteryBacked = (iNesHeader[10] >> 4) & 0xF;
// byte 11 (video RAM size) 
                let chrRamBanks = iNesHeader[11]  & 0xF;
                let chrRamBanks_batteryBacked = (iNesHeader[11] >> 4) & 0xF;

// byte 12 (video RAM size) 

                let prgRomCount: number = iNesHeader[4]; // | (upperPrgRomSize << 8);
                let chrRomCount: number = iNesHeader[5]; // | (upperChrRomSize << 8);
                const prgRomLength = prgRomCount * 16384;
                const chrRomLength = chrRomCount * 8192;
                const theRom = new Uint8Array(prgRomLength); 

                // System.Array.init(Bridge.Int.mul(prgRomCount, 16384), 0, System.Byte);
                theRom.fill(0);
                const chrRom = new Uint8Array(chrRomLength);
                chrRom.fill(0);
    
                // var chrRom = new Uint8Array(thefile.slice(16 + prgRomLength, 16 + prgRomLength + chrRomLength)); //System.Array.init(Bridge.Int.mul(chrRomCount, 16384), 0, System.Byte);
                // chrRom.fill(0);
                let chrOffset = 0;
    
                // bytesRead = zipStream.Read(theRom, 0, theRom.Length);
                BaseCart.arrayCopy(thefile, 16, theRom, 0, theRom.length);
                chrOffset = (16 + theRom.length) | 0;
                let len = chrRom.length;
                if (((chrOffset + chrRom.length) | 0) > thefile.length) {
                    len = (thefile.length - chrOffset) | 0;
                }
                BaseCart.arrayCopy(thefile, chrOffset, chrRom, 0, len);
                // zipStream.Read(chrRom, 0, chrRom.Length);
                switch (mapperId) {
                    case 58: 
                        _cart = new Mapper058Cart();
                        break;
                    case 9: 
                        _cart = new MMC2Cart();
                        break;
                    case 93: 
                        _cart = new Mapper093Cart();
                        break;                        
                    case 77: 
                        _cart = new Mapper077Cart();
                        break;
                    case 2:
                        _cart = new UxROMCart();
                        break;
                    case 71:
                        _cart = new Mapper071Cart();
                        break;
                    case 0:
                    case 180:
                        _cart = new NesCart();
                        break;
               
                    case 3:
                        _cart = new CNROMCart();
                        break;
                    case 87:
                        _cart = new Mapper087Cart();
                        break;
                    case 145:
                        _cart = new Mapper145Cart();
                        break;
                    case 97:
                        _cart = new Irem097Cart();
                        break;
                    case 7:
                        _cart = new AxROMCart();
                        break;
                    case 11:
                        _cart = new ColorDreams();
                        break;
                    case 66:
                        _cart = new MHROMCart();
                        break;
                    case 70:
                        _cart = new Mapper070Cart();
                        break;
                    case 152:
                        _cart = new Mapper152Cart();
                        break;
                    case 140:
                        _cart = new JF1xCart();
                        break;
                    case 38:
                        _cart = new BitCorp038Cart();
                        break;
                    case 34:
                        if (chrRomCount > 0) {
                            _cart = new NINA001Cart();
                        } else {
                            _cart = new BNROMCart();
                        }
                        break;
                    case 1:
                        _cart = new MMC1Cart();
                        break;
                    case 4:
                        _cart = new MMC3Cart();
                        break;
                    default:
                        _cart = new UnsupportedCart();
                }

                _cart.submapperId  = submapperId;

                if (_cart != null) {
                    _cart.Whizzler = cpu.ppu;
                    _cart.CPU = cpu;
                    cpu.Cart = _cart;
                    cpu.ppu.ChrRomHandler = _cart;
                    _cart.ROMHashFunction = crc.crc32(new Buffer(thefile.slice(16, thefile.length))).toString(16).toUpperCase(); //Hashers.HashFunction;
                    _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
                }
    
                return _cart;
            }
    
        }
    


export enum NameTableMirroring {
    OneScreen = 0,
    Vertical = 1,
    Horizontal = 2,
    FourScreen = 3
}

export class BaseCart  {
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

    prgRomBank6 = new Uint8Array(<any>new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));
    ppuBankStarts: Uint32Array = new Uint32Array(<any>new SharedArrayBuffer(16 * Uint32Array.BYTES_PER_ELEMENT));
    bankStartCache = new Uint32Array(<any>new SharedArrayBuffer(4096 * Uint32Array.BYTES_PER_ELEMENT));

    private iNesHeader = new Uint8Array(16);

    private romControlBytes = new Uint8Array(2);
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

        switch (address & 57344) {
            case 24576:
                return this.prgRomBank6[address & 8191];
            case 32768:
                bank = this.bank8start;
                break;
            case 40960:
                bank = this.bankAstart;
                break;
            case 49152:
                bank = this.bankCstart;
                break;
            case 57344:
                bank = this.bankEstart;
                break;
        }

        return this.nesCart[((bank + (address & 8191)) | 0)];

    }

    SetByte(clock: number, address: number, data: number): void {
        // throw new Error('Method not implemented.');
    }

    GetPPUByte(clock: number, address: number): number {
        var bank = address >> 10 ;
        var newAddress = this.ppuBankStarts[bank] + (address & 1023);

        //while (newAddress > chrRamStart)
        //{
        //    newAddress -= chrRamStart;
        //}
        return this.chrRom[newAddress];
    }

    SetPPUByte(clock: number, address: number, data: number): void {
        var bank = address >> 10; //, 1024)) | 0;
        var newAddress = this.bankStartCache[(this.CurrentBank << 4) + bank] + (address & 1023); // ppuBankStarts[bank] + (address & 0x3FF);
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

export class NesCart extends BaseCart {
   // prevBSSrc = new Uint8Array(8);

    InitializeCart(): void {

        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        switch (this.mapperId) {
        case 0:
            this.mapperName = 'NROM';
            break;
        case 3:
            this.mapperName = 'CNROM';
            break;
        case 180:
            this.mapperName  = 'UNROM (Crazy Climber?)';

            break;
        }

        switch (this.mapperId) {
            case 0:
            case 180:
            
            case 3:
                if (this.chrRomCount > 0) {
                    this.CopyBanks(0, 0, 0, 1);
                }
                this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
                break;
            default:
                throw new Error("Mapper " + (this.mapperId.toString() || "") + " not implemented.");
        }
    }
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

    SetByte(clock: number, address: number, val: number): void {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }

            return;
        }

        if (this.mapperId === 3 && address >= 0x8000) {

            this.CopyBanks(clock, 0, val, 1);
        }

        if (this.mapperId === 180 && address >= 32768) {
            let newbankC1 = 0;

            newbankC1 = val * 2;
            // keep two LOW banks, swap high banks

            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));
        }

    }
}

export class UxROMCart extends NesCart {
    InitializeCart(): void {
        this.mapperName = 'UxROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000) {
            let newbank81 = 0;

            newbank81 = val << 1;
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
        }

    }
    
}

export class Mapper071Cart extends NesCart {
    InitializeCart(): void {
        this.mapperName = 'Camerica UNROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000) {
            let newbank81 = 0;

            newbank81 = val << 1;
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
        }

    }
    
}


export class CNROMCart extends NesCart {

        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
    InitializeCart() {
        this.mapperName = 'CNROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
       }

    SetByte(clock: number, address: number, val: number): void {
        if (address >= 0x8000) {
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, val, 1);
        }
    }
    
}

export class Mapper058Cart extends NesCart {
    InitializeCart() {
        this.mapperName = 'Charlie Multi-Cart';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1,  2, 3);
       }

    SetByte(clock: number, address: number, val: number): void {
        if (address >= 0x8000) {
            let mode = (address >> 6) & 0x01;

            if (mode)  {
                // 16k banks 
                let newbank81 = (address & 7) << 1;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
                    
            } else {
                // 32k banks 
                let newbank81 = 0;
                newbank81 = (address & 7) << 2;
                this.SetupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
        
            }

            this.Whizzler.DrawTo(clock);
            this.Mirror(clock, (( address >> 7) & 0x1) + 1 );
            this.CopyBanks(clock, 0,(address >> 3) & 7, 1);
        }
    }
    
}

export class Mapper087Cart extends NesCart {
    
            //for (var i = 0; i < 8; i = (i + 1) | 0) {
            //    this.prevBSSrc[i] = -1;
            //}
            //SRAMEnabled = SRAMCanSave;
        InitializeCart() {
            this.mapperName = 'CNROM Clone';
            if (this.chrRomCount > 0) {
                this.CopyBanks(0, 0, 0, 1);
            }
            this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
           }
    
        SetByte(clock: number, address: number, val: number): void {
            if (address >= 0x6000 && address <= 0x7FFF) {
                const chrbank = ((val & 0x1) << 1) | ((val & 0x2) >> 1)
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 0, chrbank, 1);
        }
    }
        
}

export class Mapper145Cart extends NesCart {
    
            //for (var i = 0; i < 8; i = (i + 1) | 0) {
            //    this.prevBSSrc[i] = -1;
            //}
            //SRAMEnabled = SRAMCanSave;
        InitializeCart() {
            this.mapperName = 'Sachen Sidewinder';
            if (this.chrRomCount > 0) {
                this.CopyBanks(0, 0, 0, 1);
            }
            this.SetupBankStarts(0, 1, 2, 3);
           }
    
        SetByte(clock: number, address: number, val: number): void {
            if ((address & 0xE100) == 0x4100 ) {
                const chrbank = val;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 0, chrbank, 1);
        }
    }
        
}

export class VSSystemGames extends NesCart {
    
            //for (var i = 0; i < 8; i = (i + 1) | 0) {
            //    this.prevBSSrc[i] = -1;
            //}
            //SRAMEnabled = SRAMCanSave;
        supported = false;
        InitializeCart() {
            this.mapperName = 'VS System';
            if (this.chrRomCount > 0) {
                this.CopyBanks(0, 0, 0, 1);
            }
            this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
           }
    
        SetByte(clock: number, address: number, val: number): void {
            if (address >= 0x6000 && address <= 0x7FFF) {
                if (this.SRAMEnabled) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
    
                return;
            }
            // TODO: Cpu.ppu mem mapping needs changing vs unisystem and pc10 (new machine extensions?)
            if (address >= 4016 ) {
                const chrbank = val;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 0, chrbank, 1);
        }
    }
        
}

export class ColorDreams extends NesCart {
    // https://wiki.nesdev.com/w/index.php/Color_Dreams
    InitializeCart(): void {
        
        this.mapperName = 'Color Dreams';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            const prgbank = (val & 0x3) << 2 ;
            const chrbank = ((val >> 4) & 0xf);

            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);

            // two high bits set mirroring
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }
        //         %00 = 1ScA
        //         %01 = Horz
        //         %10 = Vert
        //         %11 = 1ScB
        //this.Mirror(clock,(val >> 6));
    }

}

export class MHROMCart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = 'GxROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            let newbank81 = 0;

            const chrbank = (val) & 0x3 ;
            const prgbank = ((val >> 4) & 0x3) << 2;

            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);

            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }

    }

}

export class Mapper070Cart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = '~Family Trainer';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            let newbank81 = 0;

            const chrbank = (val) & 0xF ;
            const prgbank = ((val >> 4) & 0xF) << 1;

            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }

    }

}

export class Mapper077Cart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = '~Mapper 077';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            const prgbank = (val & 0xF) << 2;
            const chrbank = ((val >> 4) & 0xF);

            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            
            this.Whizzler.DrawTo(clock);
            this.CopyBanks2k(clock, 0, chrbank, 1);
        }

    }

}

export class Mapper093Cart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = 'Sunsoft-2';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            
            const prgbank = ((val >> 4) & 0x7) << 1;

            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            
        }

    }

}

export class Mapper152Cart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = '~FT + mirroring';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            let newbank81 = 0;

            const chrbank = (val) & 0xF ;
            const prgbank = ((val >> 4) & 0x31) << 1;

            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
            this.oneScreenOffset = (val >> 7) == 1 ? 1024 : 0;
            this.Mirror(clock, 0);
        }

    }

}

export class JF1xCart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = 'Jaleco JF-11, JF-14';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x6000 && address <= 0x7FFF) {
            let newbank81 = 0;

            const chrbank = (val) & 0xF ;
            const prgbank = ((val >> 4) & 0x3) << 2;

            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);

            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }

    }

}

export class Irem097Cart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = '~Irem TAM-S1 IC';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts((this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1, 0, 1);
    }

    SetByte(clock: number, address: number, val: number): void {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }

            return;
        }

        let newbankC1 = 0;

        newbankC1 = (val & 0xF) * 2;
        // keep two LOW banks, swap high banks

        // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
        this.SetupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));

        // two high bits set mirroring
        this.Whizzler.DrawTo(clock);
        //         %00 = 1ScA
        //         %01 = Horz
        //         %10 = Vert
        //         %11 = 1ScB
        this.Mirror(clock,(val >> 6));
    }

    
}

export class BitCorp038Cart extends NesCart {
    InitializeCart(): void {
        
        this.mapperName = 'Bit Corp Crime Busters';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x7000 && address <= 0x7FFF) {
            let newbank81 = 0;

            const prgbank = (val & 0x3) <<2;
            const chrbank = ((val >> 2) & 0x3);

            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);

            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }

    }

}


//  Mapper 7 and derivatives 34
export class AxROMCart extends BaseCart {
    // prevBSSrc = new Uint8Array(8);

 
     InitializeCart(): void {
        this.mapperName = 'AxROM';
        
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
     }

     SetByte(clock: number, address: number, val: number): void {
        if (address < 0x5000) return;         
         if (address >= 24576 && address <= 32767) {
             if (this.SRAMEnabled) {
                 this.prgRomBank6[address & 8191] = val & 255;
             }
             return;
         }
 
        // val selects which bank to swap, 32k at a time
        var newbank8 = 0;
        newbank8 = (val & 15) << 2;
        
        this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
        // whizzler.DrawTo(clock);
        if ((val & 16) === 16) {
            this.oneScreenOffset = 1024;
        } else {
            this.oneScreenOffset = 0;
        }
        this.Whizzler.DrawTo(clock);
        this.Mirror(clock, 0);

     }
 
 
 }


export class BNROMCart extends AxROMCart {
    InitializeCart(): void {
        this.mapperName = 'BNROM';
        
        this.SetupBankStarts(0, 1, 2, 3);
        //this.Mirror(0, 0);
     }

     SetByte(clock: number, address: number, val: number): void {
        if (address < 0x5000) return;
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }

            return;
        }

       // val selects which bank to swap, 32k at a time
       var newbank8 = 0;
       newbank8 = (val & 15) << 2;
       
       this.Whizzler.DrawTo(clock);

       this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
       // whizzler.DrawTo(clock);

    }

}

export class NINA001Cart extends AxROMCart {
    InitializeCart(): void {
        this.mapperName = 'NINA-001';
        
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 1);
     }

     CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        
            if (dest >= this.chrRomCount) {
                dest = (this.chrRomCount - 1) | 0;
            }
    
            const oneKsrc = src << 2;
            const oneKdest = dest << 2;

            for (let i = 0; i < (numberOf4kBanks << 2); i++) {
                this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
    
            }
            this.UpdateBankStartCache();
    }

     SetByte(clock: number, address: number, val: number): void {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }

            return;
        }
        switch (address) {
            case 0x7FFD:
                // val selects which bank to swap, 32k at a time
                let newbank8 = 0;
                newbank8 = (val & 1) << 2;
                this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
                break;
            case 0x7FFE:
                // Select 4 KB CHR ROM bank for PPU $0000-$0FFF
                this.CopyBanks(clock, 0, val & 0xf, 1);
                break;
            case 0x7FFF:
                // Select 4 KB CHR ROM bank for PPU $1000-$1FFF
                this.CopyBanks(clock, 1, val & 0xf, 1);
                break;
            
        }


    }

}

// MMC 
export class MMC1Cart extends BaseCart  {
    chrRomBankMode: number = 0;
    prgRomBankMode: number = 0;

    lastClock: number = 0;
    sequence = 0;
    accumulator = 0;
    bank_select = 0;
    _registers = new Array<number>(4);
    lastwriteAddress = 0;

    InitializeCart() {
        this.mapperName = 'MMC1';
        
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 4);
        }
        this._registers[0] = 12;
        this._registers[1] = 0;
        this._registers[2] = 0;
        this._registers[3] = 0;

        this.SetupBankStarts(0, 1, ((this.prgRomCount * 2 - 2) | 0), ((this.prgRomCount * 2 - 1) | 0));

        this.sequence = 0;
        this.accumulator = 0;
    }

    MaskBankAddress$1(bank: number) {
        if (bank >= (this.prgRomCount << 1)) {
            var i;
            i = 255;
            while ((bank & i) >= this.prgRomCount * 2) {

                i = (i >> 1) & 255;
            }

            return (bank & i);
        } else {
            return bank;
        }
    }

    CopyBanks(dest: number, src: number, numberOf4kBanks: number) {
        if (this.chrRomCount > 0) {
            var oneKdest = dest * 4;
            var oneKsrc = src * 4;
            //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
            //  setup ppuBankStarts in 0x400 block chunks 
            for (var i = 0; i < (numberOf4kBanks << 2); i = (i + 1) | 0) {
                this.ppuBankStarts[((oneKdest + i) | 0)] = (((oneKsrc + i) | 0)) << 10;
            }

            //Array.Copy(chrRom, src * 0x1000, whizzler.cartCopyVidRAM, dest * 0x1000, numberOf4kBanks * 0x1000);
        }
        this.UpdateBankStartCache();
    }

    SetByte(clock: number, address: number, val: number) {
        // if write is to a different register, reset
        this.lastClock = clock;
        switch (address & 0xF000) {
            case 0x6000:
            case 0x7000:
                this.prgRomBank6[address & 8191] = val & 255;
                break;
            default:
                this.lastwriteAddress = address;
                if ((val & 128) === 128) {
                    this._registers[0] = this._registers[0] | 12;
                    this.accumulator = 0; // _registers[(address / 0x2000) & 3];
                    this.sequence = 0;
                } else {
                    if ((val & 1) === 1) {
                        this.accumulator = this.accumulator | (1 << this.sequence);
                    }
                    this.sequence = (this.sequence + 1) | 0;
                }
                if (this.sequence === 5) {
                    var regnum = (address & 32767) >> 13;
                    this._registers[(address & 32767) >> 13] = this.accumulator;
                    this.sequence = 0;
                    this.accumulator = 0;

                    switch (regnum) {
                        case 0:
                        // 4bit0
                        // -----
                        // CPPMM
                        // |||||
                        // |||++- Mirroring (0: one-screen, lower bank; 1: one-screen, upper bank;
                        // |||               2: vertical; 3: horizontal)
                        // |++--- PRG ROM bank mode (0, 1: switch 32 KB at $8000, ignoring low bit of bank number;
                        // |                         2: fix first bank at $8000 and switch 16 KB bank at $C000;
                        // |                         3: fix last bank at $C000 and switch 16 KB bank at $8000)
                        // +----- CHR ROM bank mode (0: switch 8 KB at a time; 1: switch two separate 4 KB banks)
                            this.SetMMC1Mirroring(clock);
                            this.prgRomBankMode = (this._registers[0] >> 2 ) & 0x3;
                            this.chrRomBankMode = (this._registers[0] >> 4 ) & 0x1;
                            
                            break;
                        case 1:
                        case 2:
                            this.SetMMC1ChrBanking(clock);
                            break;
                        case 3:
                            this.SetMMC1PrgBanking();
                            break;
                    }

                }
                break;
        }

    }

    SetMMC1ChrBanking(clock: number) {
        //	bit 4 - sets 8KB or 4KB CHRROM switching mode
        // 0 = 8KB CHRROM banks, 1 = 4KB CHRROM banks
        this.Whizzler.DrawTo(clock);
        
        //if ((this._registers[0] & 16) === 16) {
        if (this.chrRomBankMode === 1) {
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, this._registers[2], 1);
        } else {
            //CopyBanks(0, _registers[1], 2);
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, ((this._registers[1] + 1) | 0), 1);
        }
        this.bankSwitchesChanged = true;

        this.Whizzler.UpdatePixelInfo();
    }

    SetMMC1PrgBanking() {

        let reg = 0;

        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;

        } else {
            this.bank_select = 0;
        }

        // |++--- PRG ROM bank mode (0, 1: switch 32 KB at $8000, ignoring low bit of bank number;
        // |                         2: fix first bank at $8000 and switch 16 KB bank at $C000;
        // |                         3: fix last bank at $C000 and switch 16 KB bank at $8000)

        switch (this.prgRomBankMode){
            case 0:
            case 1:
                reg = (4 * ((this._registers[3] >> 1) & 0xF) + this.bank_select) | 0;
                this.SetupBankStarts(reg, reg + 1, reg + 2, reg + 3);
                break;
            case 2:
                reg = (2 * (this._registers[3]) + this.bank_select) | 0;
                this.SetupBankStarts(0, 1, reg, reg + 1);
                break;
            case 3:
                reg = (2 * (this._registers[3]) + this.bank_select) | 0;
                this.SetupBankStarts(reg, reg + 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
            break;
        }

    }

    SetMMC1Mirroring(clock: number) {
        //bit 1 - toggles between H/V and "one-screen" mirroring
        //0 = one-screen mirroring, 1 = H/V mirroring
        this.Whizzler.DrawTo(clock);
        switch (this._registers[0] & 3) {
            case 0:
                this.oneScreenOffset = 0;
                this.Mirror(clock, 0);
                break;
            case 1:
                this.oneScreenOffset = 1024;
                this.Mirror(clock, 0);
                break;
            case 2:
                this.Mirror(clock, 1); // vertical
                break;
            case 3:
                this.Mirror(clock, 2); // horizontal
                break;
        }
        this.bankSwitchesChanged = true;
        this.Whizzler.UpdatePixelInfo();
    }


}

export class MMC2Cart extends BaseCart {
    selector: number[] = [0,0];
    banks: number[] = [0,0,0,0];
    
    InitializeCart() {
        this.mapperName='MMC2';
        this.selector[0] = 1;
        this.selector[1] = 2;

        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;

        // prg.SwapBank<SIZE_32K,0x0000>(~0U);
        this.SetupBankStarts(0,(this.prgRomCount * 2) - 3,(this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);

        // chr.SetAccessor( this, &Mmc2::Access_Chr );
        this.CopyBanks(0, 0,this.banks[this.selector[0]], 1);
        this.CopyBanks(0,1,this.banks[this.selector[1]], 1);
        // Map( 0xA000U, 0xAFFFU, PRG_SWAP_8K_0    );
        // Map( 0xB000U, 0xEFFFU, &Mmc2::Poke_B000 );
        // Map( 0xF000U, 0xFFFFU, NMT_SWAP_HV      );
    }
    
    CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        
            if (dest >= this.chrRomCount) {
                dest = (this.chrRomCount - 1) | 0;
            }
    
            const oneKsrc = src << 2;
            const oneKdest = dest << 2;

            for (let i = 0; i < (numberOf4kBanks << 2); i++) {
                this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
    
            }
            this.UpdateBankStartCache();
    }
    GetPPUByte(clock: number, address: number) : number {
        var bank: number =0;
        if (address == 0xFD8)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[0] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
        }else if (address == 0xFE8) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[0] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
        }else if (address >= 0x1FD8 && address <= 0x1FDF)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[1] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
        }else if (address >= 0x1FE8 && address <= 0x1FEF) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[1] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
        }

        bank = address >> 10 ;
        let newAddress = this.ppuBankStarts[bank] + (address & 1023);

        //while (newAddress > chrRamStart)
        //{
        //    newAddress -= chrRamStart;
        //}
        let data = this.chrRom[newAddress];
        return data;
    }

    SetByte(clock: number, address: number, val: number) {

        this.Whizzler.DrawTo(clock);

        switch (address >> 12) {
            case 0x6:
            case 0x7:
            if (this.SRAMEnabled && this.SRAMCanWrite) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
                break;
            case 0xA:
                this.SetupBankStarts((val & 0xF), this.currentA, this.currentC, this.currentE);
                break
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.UnpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
                break;
            case 0xF:
                this.Mirror(clock, (val & 0x1) + 1);
                 break;

        }

        // this.SetupBankStarts()
        
        //chr.SwapBanks<SIZE_4K,0x0000>( banks[selector[0]], banks[selector[1]] );

    }



}

export class MMC3Cart extends BaseCart {
    private _registers = new Uint8Array(4);
    private chr2kBank0 = 0;
    private chr2kBank1 = 1;
    private chr1kBank0 = 0;
    private chr1kBank1 = 0;
    private chr1kBank2 = 0;
    private chr1kBank3 = 0;
    private prgSwap = 0;
    private prgSwitch1 = 0;
    private prgSwitch2 = 0;
    private prevBSSrc = new Uint8Array(8);
    private _mmc3Command = 0;
    private _mmc3ChrAddr = 0;
    private _mmc3IrqVal = 0;
    private _mmc3TmpVal = 0;
    private scanlineCounter = 0;
    private _mmc3IrcOn = false;
    private ppuBankSwap = false;
    private PPUBanks = new Uint32Array(8);

    InitializeCart() {

        this.mapperName = 'MMC3';
        this._registers.fill(0);
        this.PPUBanks.fill(0);
        this.prevBSSrc.fill(0);

        this.prgSwap = 1;

        //SetupBanks(0, 1, 0xFE, 0xFF);
        this.prgSwitch1 = 0;
        this.prgSwitch2 = 1;
        this.SwapPrgRomBanks();
        this._mmc3IrqVal = 0;
        this._mmc3IrcOn = false;
        this._mmc3TmpVal = 0;

        this.chr2kBank0 = 0;
        this.chr2kBank1 = 0;

        this.chr1kBank0 = 0;
        this.chr1kBank1 = 0;
        this.chr1kBank2 = 0;
        this.chr1kBank3 = 0;

        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 8);
        }
    }

    MaskBankAddress(bank: number) {

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

    CopyBanks(dest: number, src: number, numberOf1kBanks: number) {
        var $t;
        if (this.chrRomCount > 0) {
            for (var i = 0; i < numberOf1kBanks; i = (i + 1) | 0) {
                this.ppuBankStarts[((dest + i) | 0)] = (src + i) * 1024;
            }
            this.bankSwitchesChanged = true;
            //Array.Copy(chrRom, src * 0x400, whizzler.cartCopyVidRAM, dest * 0x400, numberOf1kBanks * 0x400);
        }
    }

    SetByte(clock: number, address: number, val: number) {
        if (address >= 24576 && address < 32768) {
            if (this.SRAMEnabled && this.SRAMCanWrite) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        //Bank select ($8000-$9FFE, even)

        //7  bit  0
        //---- ----
        //CPxx xRRR
        //||    |||
        //||    +++- Specify which bank register to update on next write to Bank Data register
        //_mmc3Command
        //||         0: Select 2 KB CHR bank at PPU $0000-$07FF (or $1000-$17FF);
        //||         1: Select 2 KB CHR bank at PPU $0800-$0FFF (or $1800-$1FFF);
        //||         2: Select 1 KB CHR bank at PPU $1000-$13FF (or $0000-$03FF);
        //||         3: Select 1 KB CHR bank at PPU $1400-$17FF (or $0400-$07FF);
        //||         4: Select 1 KB CHR bank at PPU $1800-$1BFF (or $0800-$0BFF);
        //||         5: Select 1 KB CHR bank at PPU $1C00-$1FFF (or $0C00-$0FFF);
        //||         6: Select 8 KB PRG bank at $8000-$9FFF (or $C000-$DFFF);
        //||         7: Select 8 KB PRG bank at $A000-$BFFF

        //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
        //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)
        //+--------- CHR ROM bank configuration (0: two 2 KB banks at $0000-$0FFF, four 1 KB banks at $1000-$1FFF;
        //                                       1: four 1 KB banks at $0000-$0FFF, two 2 KB banks at $1000-$1FFF)
        switch (address & 57345) {
            case 32768:
                this._mmc3Command = val & 7;
                if ((val & 128) === 128) {
                    this.ppuBankSwap = true;
                    this._mmc3ChrAddr = 4096;
                } else {
                    this.ppuBankSwap = false;
                    this._mmc3ChrAddr = 0;
                }
                if ((val & 64) === 64) {
                    this.prgSwap = 1;
                } else {
                    this.prgSwap = 0;
                }
                this.SwapPrgRomBanks();
                break;
            case 32769:
                switch (this._mmc3Command) {
                    case 0:
                        this.chr2kBank0 = val;
                        this.SwapChrBanks();
                        // CopyBanks(0, val, 1);
                        // CopyBanks(1, val + 1, 1);
                        break;
                    case 1:
                        this.chr2kBank1 = val;
                        this.SwapChrBanks();
                        // CopyBanks(2, val, 1);
                        // CopyBanks(3, val + 1, 1);
                        break;
                    case 2:
                        this.chr1kBank0 = val;
                        this.SwapChrBanks();
                        //CopyBanks(4, val, 1);
                        break;
                    case 3:
                        this.chr1kBank1 = val;
                        this.SwapChrBanks();
                        //CopyBanks(5, val, 1);
                        break;
                    case 4:
                        this.chr1kBank2 = val;
                        this.SwapChrBanks();
                        //CopyBanks(6, val, 1);
                        break;
                    case 5:
                        this.chr1kBank3 = val;
                        this.SwapChrBanks();
                        //CopyBanks(7, val, 1);
                        break;
                    case 6:
                        this.prgSwitch1 = val;
                        this.SwapPrgRomBanks();
                        break;
                    case 7:
                        this.prgSwitch2 = val;
                        this.SwapPrgRomBanks();
                        break;
                }
                break;
            case 40960:
                if ((val & 1) === 1) {
                    this.Mirror(clock, 2);
                } else {
                    this.Mirror(clock, 1);
                }
                break;
            case 40961:
                //PRG RAM protect ($A001-$BFFF, odd)
                //7  bit  0
                //---- ----
                //RWxx xxxx
                //||
                //|+-------- Write protection (0: allow writes; 1: deny writes)
                //+--------- Chip enable (0: disable chip; 1: enable chip)
                this.SRAMCanWrite = ((val & 64) === 0);
                this.SRAMEnabled = ((val & 128) === 128);
                break;
            case 49152:
                this._mmc3IrqVal = val;
                if (val === 0) {
                    // special treatment for one-time irq handling
                    this.scanlineCounter = 0;
                }
                break;
            case 49153:
                this._mmc3TmpVal = this._mmc3IrqVal;
                break;
            case 57344:
                this._mmc3IrcOn = false;
                this._mmc3IrqVal = this._mmc3TmpVal;
                this.irqRaised = false;
                if (this.updateIRQ) {
                    this.updateIRQ();
                }
                break;
            case 57345:
                this._mmc3IrcOn = true;
                break;
        }
    }

    SwapChrBanks() {
        if (this.ppuBankSwap) {
            this.CopyBanks(0, this.chr1kBank0, 1);
            this.CopyBanks(1, this.chr1kBank1, 1);
            this.CopyBanks(2, this.chr1kBank2, 1);
            this.CopyBanks(3, this.chr1kBank3, 1);
            this.CopyBanks(4, this.chr2kBank0, 2);
            this.CopyBanks(6, this.chr2kBank1, 2);
        } else {
            this.CopyBanks(4, this.chr1kBank0, 1);
            this.CopyBanks(5, this.chr1kBank1, 1);
            this.CopyBanks(6, this.chr1kBank2, 1);
            this.CopyBanks(7, this.chr1kBank3, 1);
            this.CopyBanks(0, this.chr2kBank0, 2);
            this.CopyBanks(2, this.chr2kBank1, 2);
        }
    }

    SwapPrgRomBanks() {
        //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
        //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)

        if (this.prgSwap === 1) {

            this.SetupBankStarts(((this.prgRomCount * 2 - 2) | 0), this.prgSwitch2, this.prgSwitch1, ((this.prgRomCount * 2 - 1) | 0));
        } else {
            this.SetupBankStarts(this.prgSwitch1, this.prgSwitch2, ((this.prgRomCount * 2 - 2) | 0), ((this.prgRomCount * 2 - 1) | 0));
        }

    }

    UpdateScanlineCounter() {
        //if (scanlineCounter == -1) return;

        if (this.scanlineCounter === 0) {
            this.scanlineCounter = this._mmc3IrqVal;
            //Writing $00 to $C000 will result in a single IRQ being generated on the next rising edge of PPU A12. 
            //No more IRQs will be generated until $C000 is changed to a non-zero value, upon which the 
            // counter will start counting from the new value, generating an IRQ once it reaches zero. 
            if (this._mmc3IrqVal === 0) {
                if (this._mmc3IrcOn) {
                    this.irqRaised = true;
                    this.updateIRQ();
                }
                this.scanlineCounter = -1;
                return;
            }
        }

        if (this._mmc3TmpVal !== 0) {
            this.scanlineCounter = this._mmc3TmpVal;
            this._mmc3TmpVal = 0;
        } else {
            this.scanlineCounter = (((this.scanlineCounter - 1) | 0)) & 255;
        }

        if (this.scanlineCounter === 0) {
            if (this._mmc3IrcOn) {
                this.irqRaised = true;
                if (this.updateIRQ) {
                    this.updateIRQ();
                }
            }
            if (this._mmc3IrqVal > 0) {
                this.scanlineCounter = this._mmc3IrqVal;
            }
        }

    }

}
