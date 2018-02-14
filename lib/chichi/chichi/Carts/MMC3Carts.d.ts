import { BaseCart } from './BaseCart';

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
