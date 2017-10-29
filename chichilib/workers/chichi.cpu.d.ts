////chichipig
export class ChiChiCPPU {

    constructor(soundbopper: ChiChiBopper, ppu: ChiChiPPU);

    FireDebugEvent(s: string): void;
    ppu: ChiChiPPU;

    frameFinished: () => void;

    //LastcpuClock: number;
    Rams: Uint8Array;

    // CPU Status
    _statusRegister: number;
    _programCounter: number;

    _handleNMI: boolean;
    _handleIRQ: boolean;
    //    // CPU Op info

    _accumulator: number;
    _indexRegisterX: number;
    _indexRegisterY: number;

    //    // Current Instruction
    _currentInstruction_AddressingMode: number;
    _currentInstruction_Address: number;
    _currentInstruction_OpCode: number;
    _currentInstruction_Parameters0: number;
    _currentInstruction_Parameters1: number;
    _currentInstruction_ExtraTiming: number;
    systemClock: number;
    //nextEvent = -1;

    //    //tbi
    //    _cheating;
    //    __frameFinished = true;
    PatternTableIndex: number;
    SpritePatternTableIndex: number;


    Debugging: boolean;

    InstructionHistoryPointer: number;
    InstructionHistory: Array<any>;

    instructionHistoryPointer: number;
    _instructionHistory: Array<any>;


    _PPUAddress: number;
    _PPUStatus: number;


    PadOne: any;
    PadTwo: any;
    SoundBopper: any;

    Cart: any;

    constructor(bopper: any);

    Step(): void;
    ResetCPU(): void;
    PowerOn(): void;


    NMIHandler(): void;

    IRQUpdater(): void;

    GetByte(address: number): number;
    SetByte(address: number, data: number): void;
    PeekByte(address: number): number;
    PeekBytes(start: number, finish: number): number[];

    GetStatus(): CpuStatus;

}
