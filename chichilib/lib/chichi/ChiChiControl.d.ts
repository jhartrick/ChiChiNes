export declare class ChiChiInputHandler {
    IsZapper: boolean;
    ControlPad: ChiChiControlPad;
    CurrentByte: number;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    controlPad_NextControlByteSet(sender: any, e: any): void;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    SetNextControlByte(data: number): void;
    HandleEvent(Clock: number): void;
    ResetClock(Clock: number): void;
}
export declare class ChiChiControlPad {
    currentByte: number;
    readNumber: number;
    padOneState: number;
    CurrentByte: number;
    refresh(): void;
    getByte(clock: number): number;
    setByte(clock: number, data: number): void;
}
