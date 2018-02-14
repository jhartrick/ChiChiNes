import { BaseCart } from "./BaseCart";
export declare class Smb2jCart extends BaseCart {
    InitializeCart(): void;
    irqEnabled: boolean;
    irqCounter: number;
    nextEventAt: number;
    handleNextEvent(clock: number): void;
    bank6start: number;
    current6: number;
    advanceClock(value: number): void;
    Setup6BankStarts(reg6: number, reg8: number, regA: number, regC: number, regE: number): void;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
}
