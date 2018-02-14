import { BaseCart4k } from "./BaseCart";
export declare class Mapper031Cart extends BaseCart4k {
    registers: number[];
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
    GetByte(clock: number, address: number): number;
}
