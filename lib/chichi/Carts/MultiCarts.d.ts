import { BaseCart } from "./BaseCart";
export declare class Mapper051Cart extends BaseCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Mapper058Cart extends BaseCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Mapper202Cart extends BaseCart {
    InitializeCart(): void;
    SetByte(clock: number, address: number, val: number): void;
}
export declare class Mapper212Cart extends BaseCart {
    InitializeCart(): void;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, val: number): void;
}
