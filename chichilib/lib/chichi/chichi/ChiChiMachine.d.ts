import { BaseCart, IBaseCart } from '../chichicarts/BaseCart';
import { ChiChiAPU, IChiChiAPU } from './ChiChiAudio';
import { ChiChiCPPU_AddressingModes, ChiChiInstruction, RunningStatuses, CpuStatus } from './ChiChiTypes';
import { ChiChiInputHandler, ChiChiControlPad } from './ChiChiControl';
import { IChiChiPPU } from "./ChiChiPPU";
import { GeniePatch } from './ChiChiCheats';
import { WavSharer } from './Audio/CommonAudio';
export declare class ChiChiMachine {
    private frameJustEnded;
    private frameOn;
    private totalCPUClocks;
    constructor(cpu?: ChiChiCPPU);
    Drawscreen(): void;
    RunState: RunningStatuses;
    ppu: IChiChiPPU;
    Cpu: ChiChiCPPU;
    readonly Cart: BaseCart;
    SoundBopper: ChiChiAPU;
    WaveForms: WavSharer;
    private _enableSound;
    EnableSound: boolean;
    FrameCount: number;
    IsRunning: boolean;
    readonly PadOne: ChiChiControlPad;
    readonly PadTwo: ChiChiControlPad;
    SRAMReader: (RomID: string) => any;
    SRAMWriter: (RomID: string, SRAM: any) => void;
    Reset(): void;
    PowerOn(): void;
    PowerOff(): void;
    Step(): void;
    evenFrame: boolean;
    RunFrame(): void;
    EjectCart(): void;
    LoadNSF(rom: any): void;
    LoadCart(rom: any): void;
    HasState(index: number): boolean;
    GetState(index: number): void;
    SetState(index: number): void;
    SetupSound(): void;
    FrameFinished(): void;
    dispose(): void;
}
export declare class ChiChiCPPU {
    readonly SRMasks_CarryMask: number;
    readonly SRMasks_ZeroResultMask: number;
    readonly SRMasks_InterruptDisableMask: number;
    readonly SRMasks_DecimalModeMask: number;
    readonly SRMasks_BreakCommandMask: number;
    readonly SRMasks_ExpansionMask: number;
    readonly SRMasks_OverflowMask: number;
    readonly SRMasks_NegativeResultMask: number;
    frameFinished: () => void;
    private static cpuTiming;
    private static addressModes;
    private _reset;
    private _clock;
    clock: number;
    private advanceClock(value);
    private _ticks;
    _statusRegister: number;
    _programCounter: number;
    _handleNMI: boolean;
    _handleIRQ: boolean;
    _addressBus: number;
    _dataBus: number;
    _operationCounter: number;
    _accumulator: number;
    _indexRegisterX: number;
    _indexRegisterY: number;
    _currentInstruction_AddressingMode: ChiChiCPPU_AddressingModes;
    _currentInstruction_Address: number;
    _currentInstruction_OpCode: number;
    _currentInstruction_Parameters0: number;
    _currentInstruction_Parameters1: number;
    _currentInstruction_ExtraTiming: number;
    systemClock: number;
    nextEvent: number;
    private _cheating;
    private __frameFinished;
    private _ramsBuffer;
    Rams: Uint8Array;
    private _stackPointer;
    private instructionUsage;
    private _debugging;
    Debugging: boolean;
    cheating: boolean;
    genieCodes: GeniePatch[];
    cheat(address: number, result: number): number;
    instructionHistoryPointer: number;
    _instructionHistory: ChiChiInstruction[];
    readonly InstructionHistory: Array<any>;
    readonly InstructionHistoryPointer: number;
    private _padOne;
    private _padTwo;
    ppu: IChiChiPPU;
    constructor(bopper: IChiChiAPU, ppu: IChiChiPPU);
    PadOne: ChiChiInputHandler;
    PadTwo: ChiChiInputHandler;
    private debugEvents;
    addDebugEvent(value: (sender: any, e: any) => void): void;
    removeDebugEvent(value: (sender: any, e: any) => void): void;
    CurrentInstruction: ChiChiInstruction;
    SoundBopper: IChiChiAPU;
    Cart: IBaseCart;
    FrameOn: boolean;
    CurrentFrame: number[];
    Clock: number;
    setFlag(Flag: number, value: boolean): void;
    GetFlag(flag: number): boolean;
    interruptRequest(): void;
    nonMaskableInterrupt(): void;
    RunFast(): void;
    Step(): void;
    fetchInstructionParameters(): any;
    ResetCPU(): void;
    PowerOn(): void;
    GetState(outStream: any): void;
    SetState(inStream: any): void;
    decodeAddress(): number;
    HandleBadOperation(): void;
    handleBreakpoint(): void;
    decodeOperand(): number;
    execute(): void;
    setZNFlags(data: number): void;
    compare(data: number): void;
    branch(): void;
    nmiHandler(): void;
    irqUpdater(): void;
    private pushStack(data);
    private popStack();
    GetByte(address: number): number;
    PeekByte(address: number): number;
    PeekBytes(start: number, finish: number): number[];
    SetByte(address: number, data: number): void;
    HandleNextEvent(): void;
    ResetInstructionHistory(): void;
    WriteInstructionHistoryAndUsage(): void;
    FireDebugEvent(s: string): void;
    PeekInstruction(address: number): ChiChiInstruction;
    GetStatus(): CpuStatus;
}
