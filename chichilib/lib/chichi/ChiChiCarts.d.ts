import { ChiChiCPPU } from './ChiChiMachine';
import { ChiChiPPU } from './ChiChiPPU';
export declare class iNESFileHandler {
    static LoadROM(cpu: ChiChiCPPU, thefile: number[]): BaseCart;
    static LoadNSF(cpu: ChiChiCPPU, thefile: number[]): BaseCart;
}
export declare enum NameTableMirroring {
    OneScreen = 0,
    Vertical = 1,
    Horizontal = 2,
    FourScreen = 3,
}
export declare class BaseCart {
    mapperName: string;
    supported: boolean;
    submapperId: number;
    mapsBelow6000: boolean;
    static arrayCopy(src: any, spos: number, dest: any, dpos: number, len: number): void;
    prgRomBank6: Uint8Array;
    ppuBankStarts: Uint32Array;
    bankStartCache: Uint32Array;
    private iNesHeader;
    private romControlBytes;
    nesCart: Uint8Array;
    chrRom: Uint8Array;
    current8: number;
    currentA: number;
    currentC: number;
    currentE: number;
    SRAMCanWrite: boolean;
    SRAMEnabled: boolean;
    private SRAMCanSave;
    prgRomCount: number;
    chrRomOffset: number;
    chrRamStart: number;
    chrRomCount: number;
    mapperId: number;
    bank8start: number;
    bankAstart: number;
    bankCstart: number;
    bankEstart: number;
    ROMHashFunction: string;
    checkSum: any;
    private mirroring;
    updateIRQ: () => void;
    bankSwitchesChanged: boolean;
    oneScreenOffset: number;
    readonly NumberOfPrgRoms: number;
    readonly NumberOfChrRoms: number;
    readonly MapperID: number;
    readonly MapperName: string;
    irqRaised: boolean;
    Debugging: boolean;
    DebugEvents: any;
    Whizzler: ChiChiPPU;
    CheckSum: string;
    CPU: ChiChiCPPU;
    SRAM: any;
    CartName: string;
    NMIHandler: () => void;
    CurrentBank: number;
    UsesSRAM: boolean;
    constructor();
    ClearDebugEvents(): void;
    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: Uint8Array, chrRomData: Uint8Array, chrRomOffset: number): void;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    GetPPUByte(clock: number, address: number): number;
    SetPPUByte(clock: number, address: number, data: number): void;
    SetupBankStarts(reg8: number, regA: number, regC: number, regE: number): void;
    MaskBankAddress(bank: number): number;
    WriteState(state: any): void;
    ReadState(state: any): void;
    HandleEvent(Clock: number): void;
    ResetClock(Clock: number): void;
    ResetBankStartCache(): void;
    UpdateBankStartCache(): number;
    ActualChrRomOffset(address: number): number;
    Mirror(clockNum: number, mirroring: number): void;
    InitializeCart(): void;
    UpdateScanlineCounter(): void;
}
export declare class UnsupportedCart extends BaseCart {
    supported: boolean;
    InitializeCart(): void;
}
export declare class NesCart extends BaseCart {
    InitializeCart(): void;
    CopyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class CNROMCart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Mapper087Cart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Mapper145Cart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class VSSystemGames extends NesCart {
    supported: boolean;
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class ColorDreams extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class MHROMCart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Mapper070Cart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Mapper152Cart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class JF1xCart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Irem097Cart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class BitCorp038Cart extends NesCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class AxROMCart extends BaseCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class NsfCart extends BaseCart {
    copyright: string;
    artist: string;
    songName: string;
    firstSong: number;
    songCount: number;
    runNsfAt: number;
    initNsfAt: number;
    loadNsfAt: number;
    bank_select: number;
    rams: Uint8Array;
    InitializeCart(): void;
    GetPPUByte(clock: number, address: number): number;
    GetByte(clock: number, address: number): number;
    __SetByte(address: number, data: number): void;
    LoadNSFFile(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;
}
export declare class BNROMCart extends AxROMCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class NINA001Cart extends AxROMCart {
    InitializeCart(): void;
    CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class MMC1Cart extends BaseCart {
    chrRomBankMode: number;
    prgRomBankMode: number;
    lastClock: number;
    sequence: number;
    accumulator: number;
    bank_select: number;
    _registers: number[];
    lastwriteAddress: number;
    InitializeCart(): void;
    MaskBankAddress$1(bank: number): number;
    CopyBanks(dest: number, src: number, numberOf4kBanks: number): void;
    SetByte(clock: number, address: number, val: number): void;
    SetMMC1ChrBanking(clock: number): void;
    SetMMC1PrgBanking(): void;
    SetMMC1Mirroring(clock: number): void;
}
export declare class MMC2Cart extends BaseCart {
    selector: number[];
    banks: number[];
    InitializeCart(): void;
    CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void;
    GetPPUByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class MMC3Cart extends BaseCart {
    private _registers;
    private chr2kBank0;
    private chr2kBank1;
    private chr1kBank0;
    private chr1kBank1;
    private chr1kBank2;
    private chr1kBank3;
    private prgSwap;
    private prgSwitch1;
    private prgSwitch2;
    private prevBSSrc;
    private _mmc3Command;
    private _mmc3ChrAddr;
    private _mmc3IrqVal;
    private _mmc3TmpVal;
    private scanlineCounter;
    private _mmc3IrcOn;
    private ppuBankSwap;
    private PPUBanks;
    InitializeCart(): void;
    MaskBankAddress(bank: number): number;
    CopyBanks(dest: number, src: number, numberOf1kBanks: number): void;
    SetByte(clock: number, address: number, val: number): void;
    SwapChrBanks(): void;
    SwapPrgRomBanks(): void;
    UpdateScanlineCounter(): void;
}
