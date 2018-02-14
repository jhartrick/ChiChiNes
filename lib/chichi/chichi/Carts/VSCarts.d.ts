import { BaseCart } from "./BaseCart";
export declare class VSCart extends BaseCart {
    bankSelect: number;
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
