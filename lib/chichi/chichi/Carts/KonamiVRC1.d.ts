import { BaseCart } from "./BaseCart";
export declare class KonamiVRC1Cart extends BaseCart {
    InitializeCart(): void;
    chrbank0: number;
    chrbank1: number;
    SetByte(clock: number, address: number, data: number): void;
}
