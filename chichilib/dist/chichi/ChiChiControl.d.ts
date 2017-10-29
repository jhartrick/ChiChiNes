export declare class ChiChiInputHandler implements ChiChiNES.InputHandler {
    IsZapper: boolean;
    ControlPad: ChiChiNES.IControlPad;
    CurrentByte: number;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    controlPad_NextControlByteSet(sender: any, e: ChiChiNES.ControlByteEventArgs): void;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    SetNextControlByte(data: number): void;
    HandleEvent(Clock: number): void;
    ResetClock(Clock: number): void;
}
