export class BaseCart implements ChiChiNES.BaseCart {
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
    prgRomBank6 = new Uint8Array(<any>new SharedArrayBuffer(8192));
    private _ROMHashfunction: any = null;
    checkSum: any = null;
    private mirroring = -1;
    updateIRQ: () => void = null;
    ppuBankStarts: number[] = new Array<number>(16);
    private bankStartCache = new Array<number>(4096);
    bankSwitchesChanged = false;
    oneScreenOffset = 0

    Mirroring: ChiChiNES.NameTableMirroring;


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


    irqRaised = false;
    Debugging: boolean;
    DebugEvents: any = null;
    ROMHashFunction: (prg: any, chr: any) => string;
    Whizzler: ChiChiNES.CPU2A03;
    IrqRaised: boolean;
    CheckSum: string;
    CPU: ChiChiNES.CPU2A03;
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

    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void {
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
            chrRomData = new Array(32768); //System.Array.init(32768, 0, System.Byte);
            chrRomData.fill(0);
        }


        this.chrRom = new Uint8Array(chrRomData.length + 4096);//     System.Array.init(((chrRomData.length + 4096) | 0), 0, System.Int32);

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

        // by default we have to call Mirror() at least once to set up the bank offsets
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
        // if cart is half sized, adjust
        if (((bank + (address & 8191)) | 0) > this.nesCart.length) {
            throw new Error("THis is broken!");
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
        this.CurrentBank = (this.CurrentBank + 1) | 0;

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
        var newAddress = (this.bankStartCache[(this.CurrentBank * 16) + bank | 0] + (address & 1023)) | 0;

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
        //    //        must contain 2kB of additional VRAM (i got vram up the wazoo)
        //    // 0xC00 = 110000000000
        //    // 0x800 = 100000000000
        //    // 0x400 = 010000000000
        //    // 0x000 = 000000000000

        //if (this.debugging) {
        //    this.DebugEvents.add(($t = new ChiChiNES.CartDebugEvent(), $t.Clock = clockNum, $t.EventType = System.String.format("Mirror set to {0}", mirroring), $t));
        //}

        //if (mirroring == this.mirroring) return;

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

export class NesCart extends BaseCart implements ChiChiNES.CPU.NESCart {
    prevBSSrc = new Uint8Array(8);

    irqRaised: boolean;
    Debugging: boolean;
    DebugEvents: any;
    ROMHashFunction: (prg: any, chr: any) => string;
    //Whizzler: ChiChiNES.CPU2A03;
    IrqRaised: boolean;
    CheckSum: string;
    CPU: ChiChiNES.CPU2A03;
    SRAM: any;
    CartName: string;
    NumberOfPrgRoms: number;
    NumberOfChrRoms: number;
    //MapperID: number;
    Mirroring: ChiChiNES.NameTableMirroring;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    //PpuBankStarts: any;
    BankStartCache: any;
    CurrentBank: number;
    BankSwitchesChanged: boolean;
    OneScreenOffset: number;
    UsesSRAM: boolean;
    ChrRamStart: number;
    //PPUBankStarts: any;

    InitializeCart(): void {

        for (var i = 0; i < 8; i = (i + 1) | 0) {
            this.prevBSSrc[i] = -1;
        }
        //SRAMEnabled = SRAMCanSave;


        switch (this.mapperId) {
            case 0:
            case 1:
            case 2:
            case 3:
                if (this.chrRomCount > 0) {
                    this.CopyBanks(0, 0, 0, 1);
                }
                this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
                break;
            case 7:
                //SetupBanks(0, 1, 2, 3);
                this.SetupBankStarts(0, 1, 2, 3);
                this.Mirror(0, 0);
                break;
            default:
                throw new Error("Mapper " + (this.mapperId.toString() || "") + " not implemented.");
        }
    }
    CopyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void {

        if (dest >= this.chrRomCount) {
            dest = (this.chrRomCount - 1) | 0;
        }

        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf8kBanks << 3); i = (i + 1) | 0) {
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

        if (this.mapperId === 7) {
            // val selects which bank to swap, 32k at a time
            var newbank8 = 0;
            newbank8 = (val & 15) << 2;

            this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
            // whizzler.DrawTo(clock);
            if ((val & 16) === 16) {
                this.OneScreenOffset = 1024;
            } else {
                this.OneScreenOffset = 0;
            }
            this.Mirror(clock, 0);
        }

        if (this.mapperId === 3 && address >= 32768) {

            this.CopyBanks(clock, 0, val, 1);
        }

        if (this.mapperId === 2 && address >= 32768) {
            var newbank81 = 0;

            newbank81 = val * 2;
            // keep two high banks, swap low banks

            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
        }


    }


}

export class NsfCart extends BaseCart {
    runNsfAt: number;
    initNsfAt: number;
    loadNsfAt: number = 0;
    bank_select = 0;
    rams = new Uint8Array(0x3000);
    InitializeCart() {
        this.SetupBankStarts(0, 1, 3, 4);
        this.rams.fill(0);
    }

    GetPPUByte(clock: number, address: number): number {
        return 0;
    }

    __SetByte(address: number, data: number): number {
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
        // if cart is half sized, adjust
        if (((bank + (address & 8191)) | 0) > this.nesCart.length) {
            throw new Error("THis is broken!");
        }
        this.nesCart[((bank + (address & 8191)) | 0)] = data;
    }

    LoadNSFFile(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void {
        this.mapperId = -1;
        this.loadNsfAt = (header[0x09] << 8) + header[0x08];
        this.initNsfAt = (header[0x0B] << 8) + header[0x0A];
        this.runNsfAt = (header[0x0D] << 8) + header[0x0C];

        //System.Array.copy(header, 0, this.iNesHeader, 0, header.length);
        this.prgRomCount = prgRoms;
        this.chrRomCount = chrRoms;

        //  this.nesCart = System.Array.init(prgRomData.length, 0, System.Byte);
        // System.Array.copy(prgRomData, 0, this.nesCart, 0, prgRomData.length);
        this.nesCart = new Uint8Array(32768); //System.Array.init(32768, 0, System.Byte);
        this.nesCart.fill(0);

        // chrRom is going to be RAM
        chrRomData = new Array(32768); //System.Array.init(32768, 0, System.Byte);
        chrRomData.fill(0);
        let address = this.loadNsfAt;
        for (let i = 0; i < prgRomData.length - 0x80; ++i) {
            this.__SetByte(address + i, prgRomData[0x80 + i]);
        }

        this.prgRomCount = prgRomData.length / 1024;
        this.chrRomCount = 0;//this.iNesHeader[5];

        this.SRAMEnabled = true;
        this.checkSum = ""; //ROMHashFunction(nesCart, chrRom);

        this.InitializeCart();
    }

}

export class MMC1Cart extends BaseCart implements ChiChiNES.NesCartMMC1 {
    lastClock: number = 0;
    sequence = 0;
    accumulator = 0;
    bank_select = 0;
    _registers = new Array<number>(4);
    lastwriteAddress = 0;

    InitializeCart() {

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
        switch (address & 61440) {
            case 24576:
            case 28672:
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
                            this.SetMMC1Mirroring(clock);
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
        this.CPU.DrawTo(clock);
        if ((this._registers[0] & 16) === 16) {
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, this._registers[2], 1);
        } else {
            //CopyBanks(0, _registers[1], 2);
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, ((this._registers[1] + 1) | 0), 1);
        }
        this.bankSwitchesChanged = true;

        this.CPU.UpdatePixelInfo();
    }

    SetMMC1PrgBanking() {
        let reg = 0;
        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;

        } else {
            this.bank_select = 0;
        }


        if ((this._registers[0] & 8) === 0) {
            reg = (4 * ((this._registers[3] >> 1) & 15) + this.bank_select) | 0;
            this.SetupBankStarts(reg, ((reg + 1) | 0), ((reg + 2) | 0), ((reg + 3) | 0));
        } else {
            reg = (2 * (this._registers[3]) + this.bank_select) | 0;
            //bit 2 - toggles between low PRGROM area switching and high
            //PRGROM area switching
            //0 = high PRGROM switching, 1 = low PRGROM switching
            if ((this._registers[0] & 4) === 4) {
                // select 16k bank in register 3 (setupbankstarts switches 8k banks)
                this.SetupBankStarts(reg, ((reg + 1) | 0), (((this.prgRomCount << 1) - 2) | 0), (((this.prgRomCount << 1) - 1) | 0));
                //SetupBanks(reg8, reg8 + 1, 0xFE, 0xFF);
            } else {
                this.SetupBankStarts(0, 1, reg, ((reg + 1) | 0));
            }
        }
    }

    SetMMC1Mirroring(clock: number) {
        //bit 1 - toggles between H/V and "one-screen" mirroring
        //0 = one-screen mirroring, 1 = H/V mirroring
        this.CPU.DrawTo(clock);
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
        this.CPU.UpdatePixelInfo();
    }


}

export class MMC3Cart extends BaseCart implements ChiChiNES.NesCartMMC3 {
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
