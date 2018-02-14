export declare class ChiChiInputHandler {
    ControlPad: ChiChiControlPad;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
}
export interface ChiChiControlPad {
    padOneState: number;
    currentByte: number;
    readNumber: number;
    getByte(clock: number): number;
    setByte(clock: number, data: number): void;
}
export declare function createPad(): ChiChiControlPad;
