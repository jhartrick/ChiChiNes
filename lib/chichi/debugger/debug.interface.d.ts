import { ChiChiCPPU } from '../chichi/chichi';
export interface DecodedInstruction {
    asm: string;
    frame: number;
    time: number;
    AddressingMode: number;
    A: number;
    X: number;
    Y: number;
    SR: number;
    SP: number;
    Length: number;
    OpCode: number;
    Parameters0: number;
    Parameters1: number;
    ExtraTiming: number;
    Address: number;
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
    private _cpu;
    cpu: ChiChiCPPU;
    lastInstructions: Array<DecodedInstruction>;
    constructor();
    decodedStatusRegister: string;
    static decodeCpuStatusRegister(sr: number): string;
    appendInstructionPage(): void;
    private setInstructionPage(inst, start, frameNumber?);
    getMnemnonic(opcode: number): string;
    disassemble(inst: DecodedInstruction): string;
}
