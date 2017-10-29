export interface DecodedInstruction {
    asm: string;
    AddressingMode: number;
    frame: number;
    time: number;
    A: number;
    X: number;
    Y: number;
    SR: number;
    SP: number;
    Address: number;
    OpCode: number;
    Parameters0: number;
    Parameters1: number;
    ExtraTiming: number;
    Length: number;
}
export declare class Debugger {
    static SRMasks_CarryMask: number;
    static SRMasks_ZeroResultMask: number;
    static SRMasks_InterruptDisableMask: number;
    static SRMasks_DecimalModeMask: number;
    static SRMasks_BreakCommandMask: number;
    static SRMasks_ExpansionMask: number;
    static SRMasks_OverflowMask: number;
    static SRMasks_NegativeResultMask: number;
    lastInstructions: Array<DecodedInstruction>;
    constructor();
    doUpdate(): void;
    decodedStatusRegister: string;
    static decodeCpuStatusRegister(sr: number): string;
    appendInstructionPage(): void;
    private setInstructionPage(inst, start, frameNumber?);
    getMnemnonic(opcode: number): string;
    disassemble(inst: DecodedInstruction): string;
}
