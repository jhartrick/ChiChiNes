import { BaseCart } from "./BaseCart";
export declare class MMC2Cart extends BaseCart {
    latches: number[];
    banks: number[];
    InitializeCart(): void;
    CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void;
    GetPPUByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class MMC4Cart extends BaseCart {
    selector: number[];
    banks: number[];
    InitializeCart(): void;
    CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void;
    GetPPUByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, val: number): void;
}
