import { ChiChiCPPU_AddressingModes, ChiChiInstruction, CpuStatus } from "./ChiChiTypes";
import { ChiChiInputHandler } from "./ChiChiControl";
import { IChiChiPPU } from "./ChiChiPPU";
import { IChiChiAPU, IChiChiAPUState } from "./ChiChiAudio";
import { IBaseCart } from '../chichicarts/BaseCart'
import { MemoryPatch } from "./ChiChiCheats";
import { MemoryMap, IMemoryMap } from "./ChiChiMemoryMap";
import { StateBuffer } from "./StateBuffer";
const PRG_CTR = 0;
const PRG_ADR = 1;

export interface IChiChiCPPUState {
    clock: number;
    
    statusRegister: number;
    programCounter: number;
    _handleNMI: boolean;
    addressBus: number;
    dataBus: number;
    _operationCounter: number;
    accumulator: number;
    indexRegisterX: number;
    indexRegisterY: number;
    
    _currentInstruction_AddressingMode: ChiChiCPPU_AddressingModes;
    _currentInstruction_Address: number;
    _currentInstruction_OpCode: number;
    _currentInstruction_Parameters0: number;
    _currentInstruction_Parameters1: number;
    _currentInstruction_ExtraTiming: number;
    systemClock: number;
 

    Debugging: boolean;
    cheating: boolean;
    genieCodes: MemoryPatch[];
}

export interface IChiChiCPPU extends IChiChiCPPUState {

    borrowedCycles: number;
    

    cheat(address: number, result: number): number;
    instructionHistoryPointer: number;
    _instructionHistory: ChiChiInstruction[];

    ppu: IChiChiPPU;
    PadOne: ChiChiInputHandler;
    PadTwo: ChiChiInputHandler;

    CurrentInstruction: ChiChiInstruction;
    SoundBopper: IChiChiAPU;
    FrameOn: boolean;

    step(): void;

    ResetCPU(): void;
    PowerOn(): void;

    decodeAddress(): number;
    HandleBadOperation(): void;
    handleBreakpoint(): void;
    decodeOperand(): number;
    execute(): void;
    setZNFlags(data: number): void;
    compare(data: number): void;
    branch(): void;
    nmiHandler(): void;

    GetByte(address: number): number;
    SetByte(address: number, data: number): void;

    memoryMap: IMemoryMap;

    HandleNextEvent(): void;
    ResetInstructionHistory(): void;
    writeInstructionHistory(): void;
    FireDebugEvent(s: string): void;
    
    GetStatus(): CpuStatus;

}

//chichipig
export class ChiChiCPPU implements IChiChiCPPU {
        
    readonly SRMasks_CarryMask = 0x01;
    readonly SRMasks_ZeroResultMask = 0x02;
    readonly SRMasks_InterruptDisableMask = 0x04;
    readonly SRMasks_DecimalModeMask = 0x08;
    readonly SRMasks_BreakCommandMask = 0x10;
    readonly SRMasks_ExpansionMask = 0x20;
    readonly SRMasks_OverflowMask = 0x40;
    readonly SRMasks_NegativeResultMask = 0x80;
    public frameFinished: () => void;


        // statics
    private static cpuTiming: number[] = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
    private static addressModes: number[] = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
    private _reset = false;

    //timing
    private _clock =0;
    
    get clock() : number {
        return this._clock;
    }  
    
    set clock(value : number ){
        this._clock = value;
    }

    private advanceClock(value: number) {
        if (value) {
            this.memoryMap.advanceClock(value);
            this._clock += value;
        }
    }

    borrowedCycles = 0;

    private _ticks = 0;

    // CPU Status
    cpuStatus16: Uint16Array = new Uint16Array(2);
    // programCounter = 0;
    get programCounter(): number {
        return this.cpuStatus16[PRG_CTR];
    }
    set programCounter(val: number) {
        this.cpuStatus16[PRG_CTR] = val;
    }
    
    get addressBus(): number {
        return this.cpuStatus16[PRG_ADR];
    }
    set addressBus(val: number) {
        this.cpuStatus16[PRG_ADR] = val;
    }
    // addressBus = 0;
    
    _handleNMI: boolean = false;
    // CPU Op info
    
    cpuStatus: Uint8Array = new Uint8Array(8);
    get statusRegister(): number {
        return this.cpuStatus[0];
    }
    set statusRegister(val: number) {
        this.cpuStatus[0] = val;
    }
    get accumulator(): number {
        return this.cpuStatus[1];
    }
    set accumulator(val: number) {
        this.cpuStatus[1] = val;
    }
    get indexRegisterX(): number {
        return this.cpuStatus[2];
    }
    set indexRegisterX(val: number) {
        this.cpuStatus[2] = val;
    }
    get indexRegisterY(): number {
        return this.cpuStatus[3];
    }
    set indexRegisterY(val: number) {
        this.cpuStatus[3] = val;
    } 
    get dataBus(): number {
        return this.cpuStatus[4];
    }
    set dataBus(val: number) {
        this.cpuStatus[4] = val;
    }

    get stackPointer (): number {
        return this.cpuStatus[5];
    }
    set stackPointer (val: number) {
        this.cpuStatus[5] = val;
    }

    // system ram
    // private stackPointer = 255;
    
    //statusRegister = 0;
    //accumulator = 0;
    // indexRegisterX = 0;
    // indexRegisterY = 0;
    // dataBus = 0;
    _operationCounter = 0;

    // Current Instruction
    _currentInstruction_AddressingMode = ChiChiCPPU_AddressingModes.Bullshit;
    _currentInstruction_Address = 0;
    _currentInstruction_OpCode = 0;
    _currentInstruction_Parameters0 = 0;
    _currentInstruction_Parameters1 = 0;
    _currentInstruction_ExtraTiming = 0;

    systemClock = 0;


    // debug helpers
    private instructionUsage = new Uint32Array(256);//System.Array.init(256, 0, System.Int32);
    private _debugging = false;

    public get Debugging(): boolean {
        return this._debugging;
    }

    public set Debugging(value: boolean) {
        this._debugging = value;
    }

    // #region Cheats
    cheating = false;
    
    genieCodes: MemoryPatch[] = new Array<MemoryPatch>();

    cheat(address: number, result: number) : number 
    {
        
        let patch = this.genieCodes.find((v)=>{ return v.address == address; });
        if (!patch) return result;
        if (patch.data > 0xFF)
        {
            // its a comparison
            const compare = patch.data  >> 8;
            if (compare == result)
            {
                result = patch.data & 0xFF;
            }
        }
        else
        {
            result = patch.data;
        }
        
        return result;
    }

// #endregion cheats

    instructionHistoryPointer = 255;
    _instructionHistory = new Array<ChiChiInstruction>(256);//System.Array.init(256, null, ChiChiInstruction);
    
    public get InstructionHistory(): Array<any> {
        return this._instructionHistory;
    }

    public get InstructionHistoryPointer(): number {
        return this.instructionHistoryPointer;
    }


    private _padOne: ChiChiInputHandler;
    private _padTwo: ChiChiInputHandler;

    ppu: IChiChiPPU;

    constructor(bopper: IChiChiAPU, ppu: IChiChiPPU) {

        this.SoundBopper = bopper;

        // init PPU
        this.ppu = ppu;

        this._padOne = new ChiChiInputHandler();
        this._padTwo = new ChiChiInputHandler();
        for (let i = 0; i < this._instructionHistory.length; ++i) {
            this._instructionHistory[i] = new ChiChiInstruction();
        }

    }

    public get PadOne(): ChiChiInputHandler {
        return this._padOne;
    }

    public set PadOne(value: ChiChiInputHandler) {
        this._padOne = value;
    }

    public get PadTwo(): ChiChiInputHandler {
        return this._padTwo;
    }

    public set PadTwo(value: ChiChiInputHandler) {
        this._padTwo = value;
    }

    memoryMap: IMemoryMap;

    CurrentInstruction: ChiChiInstruction;

    SoundBopper: IChiChiAPU;

    Cart: IBaseCart;

    FrameOn: boolean;

    CurrentFrame: number[];

    get Clock(): number {
        return this.clock;
    }

    set Clock(value: number) {
        this.advanceClock(value);
        this.clock = value;
    }

    setFlag(Flag: number, value: boolean): void {
        this.statusRegister = (value ? (this.statusRegister | Flag) : (this.statusRegister & ~Flag));

        this.statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    }

    GetFlag(flag: number): boolean {
        return ((this.statusRegister & flag) === flag);
    }

    interruptRequest(): void {
        if (!this.GetFlag(this.SRMasks_InterruptDisableMask)) {
            this.advanceClock(7);
            this.setFlag(this.SRMasks_InterruptDisableMask, true);
            
            const newStatusReg1 = this.statusRegister & ~0x10 | 0x20;

            this.pushStack(this.programCounter >> 8);
            this.pushStack(this.programCounter);
            this.pushStack(this.statusRegister);

            this.programCounter = this.GetByte(0xFFFE) + (this.GetByte(0xFFFF) << 8);
        }

    }

    nonMaskableInterrupt(): void {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        const newStatusReg = this.statusRegister & ~0x10 | 0x20;

        this.setFlag(this.SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.pushStack(this.programCounter >> 8);
        this.pushStack(this.programCounter & 0xFF);
        //c7ab
        // push sr onto stack
        this.pushStack(newStatusReg);
        // point pc to interrupt service routine
        const lowByte = this.GetByte(0xFFFA);
        const highByte = this.GetByte(0xFFFB);
        const jumpTo = lowByte | (highByte << 8);
        this.programCounter = jumpTo;
            //nonOpCodeticks = 7;
    }


    step(): void {

        this._currentInstruction_ExtraTiming = 0;

        if (this._handleNMI) {
            this.advanceClock(7);
            this._handleNMI = false;
            this.nonMaskableInterrupt();
        } else if (this.memoryMap.irqRaised) {
            this.interruptRequest();
        }

        //FetchNextInstruction();
        this._currentInstruction_Address = this.programCounter;
        this._currentInstruction_OpCode = this.GetByte(this.programCounter );
        this.programCounter = (this.programCounter + 1) & 0xffff;
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];
        
        this.fetchInstructionParameters();
        
        this.execute();

        this.advanceClock(ChiChiCPPU.cpuTiming[this._currentInstruction_OpCode]);
        this.advanceClock(this._currentInstruction_ExtraTiming);

        if (this.borrowedCycles) {
            this.advanceClock(this.borrowedCycles);
            this.borrowedCycles = 0;
        }

        if (this._debugging) {
            this.writeInstructionHistory();
            this._operationCounter++;
        }
    }

    fetchInstructionParameters(): any {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.GetByte((this.programCounter++) & 0xFFFF);
                this._currentInstruction_Parameters1 = this.GetByte((this.programCounter++) & 0xFFFF);
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiCPPU_AddressingModes.Relative:
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.GetByte((this.programCounter++) & 0xFFFF);
                break;
            case ChiChiCPPU_AddressingModes.Accumulator:
            case ChiChiCPPU_AddressingModes.Implicit:
                break;
            default:
                //  throw new Error("Invalid address mode!!");
                break;
        }
        
    }

    ResetCPU(): void {
        this.statusRegister = 52;
        this._operationCounter = 0;
        this.stackPointer = 253;
        this.programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
        this.advanceClock(4);
        this.genieCodes = [];
    }

    PowerOn(): void {
        // powers up with this state
        this.statusRegister = 52;
        this.stackPointer = 253;
        this._operationCounter = 0;
        this.advanceClock(4);


        this.programCounter =  this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
    }

    decodeAddress(): number {
        this._currentInstruction_ExtraTiming = 0;
        let result = 0;
        let lowByte = 0;
        let highByte = 0;

        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
                // two parameters refer to the memory position
                result = ((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0);
                break;
            case ChiChiCPPU_AddressingModes.AbsoluteX:
                // absolute, x indexed - two paramaters + Index register x
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this.indexRegisterX) | 0));
                if ((result & 0xFF) < this.indexRegisterX) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.AbsoluteY:
                // absolute, y indexed - two paramaters + Index register y
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this.indexRegisterY) | 0));
                if ((result & 0xFF) < this.indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
                // first parameter represents offset in zero page
                result = this._currentInstruction_Parameters0;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageX:
                result = (((this._currentInstruction_Parameters0 + this.indexRegisterX) | 0)) & 0xFF;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageY:
                result = ((((this._currentInstruction_Parameters0 & 0xFF) + (this.indexRegisterY & 0xFF)) | 0)) & 0xFF;
                break;
            case ChiChiCPPU_AddressingModes.Indirect:
                lowByte = this._currentInstruction_Parameters0;
                highByte = this._currentInstruction_Parameters1 << 8;
                let indAddr = (highByte | lowByte) & 65535;
                let indirectAddr = (this.GetByte(indAddr));
                lowByte = (((lowByte + 1) | 0)) & 0xFF;
                indAddr = (highByte | lowByte) & 65535;
                indirectAddr = indirectAddr | (this.GetByte(indAddr) << 8);
                result = indirectAddr;
                break;
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
                var addr = (((this._currentInstruction_Parameters0 + this.indexRegisterX) | 0)) & 0xFF;
                lowByte = this.GetByte(addr);
                addr = (addr + 1) | 0;
                highByte = this.GetByte(addr & 0xFF);
                highByte = highByte << 8;
                result = highByte | lowByte;
                break;
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
                lowByte = this.GetByte(this._currentInstruction_Parameters0);
                highByte = this.GetByte((((this._currentInstruction_Parameters0 + 1) | 0)) & 0xFF) << 8;
                addr = (lowByte | highByte);
                result = (addr + this.indexRegisterY) | 0;
                if ((result & 0xFF) > this.indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.Relative:
                result = (((this.programCounter + this._currentInstruction_Parameters0) | 0));
                break;
            default:
                this.HandleBadOperation();
                break;
        }
        return result & 65535;
    }

    HandleBadOperation(): void {
        
        //throw new Error('Method not implemented.');
    }

    handleBreakpoint(): void {
        
    }

    decodeOperand(): number {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Immediate:
                this.dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiCPPU_AddressingModes.Accumulator:
                return this.accumulator;
            default:
                this.dataBus = this.GetByte(this.decodeAddress());
                return this.dataBus;
        }
    }

    execute(): void {
        let data = 0;
        let lowByte = 0;
        let highByte = 0;
        let carryFlag = 0;
        let result = 0;
        let oldbit = 0;

        switch (this._currentInstruction_OpCode) {
            case 128: case 130: case 194: case 226: case 4: case 20: case 52: case 68: case 84: case 100: case 116:
            case 212: case 244: case 12: case 28: case 60: case 92: case 124: case 220: case 252:
                // SKB, SKW, DOP, - undocumented noops
                this.decodeAddress();
                break;
            case 105: case 101: case 117: case 109: case 125: case 121: case 97: case 113:
                //ADC
                data = this.decodeOperand();
                carryFlag = (this.statusRegister & 1);
                result = (this.accumulator + data + carryFlag) | 0;
                // carry flag
                this.setFlag(this.SRMasks_CarryMask, result > 255);
                // overflow flag
                this.setFlag(this.SRMasks_OverflowMask, ((this.accumulator ^ data) & 128) !== 128 && ((this.accumulator ^ result) & 128) === 128);
                // occurs when bit 7 is set
                this.accumulator = result & 0xFF;
                this.setZNFlags(this.accumulator);
                break;
            case 41: case 37: case 53: case 45: case 61: case 57: case 33: case 49:
                //AND
                this.accumulator = (this.accumulator & this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 10: case 6: case 22: case 14: case 30:
                //ASL
                data = this.decodeOperand();
                // set carry flag
                this.setFlag(this.SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.SetByte(this.decodeAddress(), data);
                }
                this.setZNFlags(data);
                break;
            case 144:
                //BCC
                if ((this.statusRegister & 1) !== 1) {
                    this.branch();
                }
                break;
            case 176:
                //BCS();
                if ((this.statusRegister & 1) === 1) {
                    this.branch();
                }
                break;
            case 240:
                //BEQ();
                if ((this.statusRegister & 2) === 2) {
                    this.branch();
                }
                break;
            case 36: case 44:
                //BIT();
                data = this.decodeOperand();
                // overflow is bit 6
                this.setFlag(this.SRMasks_OverflowMask, (data & 64) === 64);
                // negative is bit 7
                if ((data & 128) === 128) {
                    this.statusRegister = this.statusRegister | 128;
                } else {
                    this.statusRegister = this.statusRegister & 127;
                }
                if ((data & this.accumulator) === 0) {
                    this.statusRegister = this.statusRegister | 2;
                } else {
                    this.statusRegister = this.statusRegister & 253;
                }
                break;
            case 48:
                //BMI();
                if ((this.statusRegister & 128) === 128) {
                    this.branch();
                }
                break;
            case 208:
                //BNE();
                if ((this.statusRegister & 2) !== 2) {
                    this.branch();
                }
                break;
            case 16:
                // BPL();
                if ((this.statusRegister & 128) !== 128) {
                    this.branch();
                }
                break;
            case 0:
                // BRK();

                this.programCounter = this.programCounter + 1;
                this.pushStack(this.programCounter >> 8 & 0xFF);
                this.pushStack(this.programCounter & 0xFF);

                data = this.statusRegister | 16 | 32;
                this.pushStack(data);

                this.statusRegister = this.statusRegister | 20;
                this.addressBus = 65534;

                lowByte = this.GetByte(this.addressBus);
                this.addressBus = 65535;

                highByte = this.GetByte(this.addressBus);
                this.programCounter = lowByte + highByte * 256;
                break;
            case 80:
                // BVC();
                if ((this.statusRegister & 64) !== 64) {
                    this.branch();
                }
                break;
            case 112:
                // BVS();
                if ((this.statusRegister & 64) === 64) {
                    this.branch();
                }
                break;
            case 24:
                // CLC();
                this.setFlag(this.SRMasks_CarryMask, false);
                break;
            case 216:
                // CLD();
                this.setFlag(this.SRMasks_DecimalModeMask, false);
                break;
            case 88:
                // CLI();
                this.setFlag(this.SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                // CLV();
                this.setFlag(this.SRMasks_OverflowMask, false);
                break;
            case 201: case 197: case 213: case 205: case 221: case 217: case 193: case 209:
                // CMP();
                data = (this.accumulator + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 224: case 228: case 236:
                // CPX();
                data = (this.indexRegisterX + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 192: case 196: case 204:
                // CPY();
                data = (this.indexRegisterY + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 198: case 214: case 206: case 222:
                // DEC();
                data = this.decodeOperand();
                data = (data - 1) & 0xFF;
                this.SetByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 202:
                // DEX();
                this.indexRegisterX = this.indexRegisterX - 1;
                this.indexRegisterX = this.indexRegisterX & 0xFF;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 136:
                //DEY();
                this.indexRegisterY = this.indexRegisterY - 1;
                this.indexRegisterY = this.indexRegisterY & 0xFF;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 73:
            case 69:
            case 85:
            case 77:
            case 93:
            case 89:
            case 65:
            case 81:
                // EOR();
                this.accumulator = (this.accumulator ^ this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 230:
            case 246:
            case 238:
            case 254:
                // INC();
                data = this.decodeOperand();
                data = (data + 1) & 0xFF;
                this.SetByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 232:
                //INX();
                this.indexRegisterX = this.indexRegisterX + 1;
                this.indexRegisterX = this.indexRegisterX & 0xFF;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 200:
                this.indexRegisterY = this.indexRegisterY + 1;
                this.indexRegisterY = this.indexRegisterY & 0xFF;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 76:
            case 108:
                // JMP();
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this.programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                } else {
                    this.programCounter = this.decodeAddress();
                }
                break;
            case 32:
                //JSR();
                this.pushStack((this.programCounter >> 8) & 0xFF);
                this.pushStack((this.programCounter - 1) & 0xFF);
                this.programCounter = this.decodeAddress();
                break;
            case 169:
            case 165:
            case 181:
            case 173:
            case 189:
            case 185:
            case 161:
            case 177:
                //LDA();
                this.accumulator = this.decodeOperand();
                this.setZNFlags(this.accumulator);
                break;
            case 162:
            case 166:
            case 182:
            case 174:
            case 190:
                //LDX();
                this.indexRegisterX = this.decodeOperand();
                this.setZNFlags(this.indexRegisterX);
                break;
            case 160:
            case 164:
            case 180:
            case 172:
            case 188:
                //LDY();
                this.indexRegisterY = this.decodeOperand();
                this.setZNFlags(this.indexRegisterY);
                break;
            case 74: case 70: case 86: case 78: case 94:
                //LSR();
                data = this.decodeOperand();
                //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 
                this.setFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                data = data >> 1 & 0xFF;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.SetByte(this.decodeAddress(), data);
                }
                break;
            case 234: case 26: case 58: case 90: case 122: case 218: case 250: case 137:
                //NOP();
                this.decodeAddress();
                break;
            case 9:
            case 5:
            case 21:
            case 13:
            case 29:
            case 25:
            case 1:
            case 17:
                //ORA();
                this.accumulator = (this.accumulator | this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 72:
                //PHA();
                this.pushStack(this.accumulator);
                break;
            case 8:
                //PHP();
                data = this.statusRegister | 16 | 32;
                this.pushStack(data);
                break;
            case 104:
                //PLA();
                this.accumulator = this.popStack();
                this.setZNFlags(this.accumulator);
                break;
            case 40:
                //PLP();
                this.statusRegister = this.popStack(); // | 0x20;
                break;
            case 42:
            case 38:
            case 54:
            case 46:
            case 62:
                //ROL();
                data = this.decodeOperand();
                // old carry bit shifted into bit 1
                oldbit = (this.statusRegister & 1) === 1 ? 1 : 0;
                this.setFlag(this.SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.SetByte(this.decodeAddress(), data);
                }
                break;
            case 106:
            case 102:
            case 118:
            case 110:
            case 126:
                //ROR();
                data = this.decodeOperand();
                // old carry bit shifted into bit 7
                oldbit = (this.statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.setFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                } else {
                    this.SetByte(this.decodeAddress(), data);
                }
                break;
            case 64:
                //RTI();
                this.statusRegister = this.popStack(); // | 0x20;
                lowByte = this.popStack();
                highByte = this.popStack();
                this.programCounter = ((highByte << 8) | lowByte);
                break;
            case 96:
                //RTS();
                lowByte = (this.popStack() + 1) & 0xFF;
                highByte = this.popStack();
                this.programCounter = ((highByte << 8) | lowByte);
                break;
            case 235:
            case 233:
            case 229:
            case 245:
            case 237:
            case 253:
            case 249:
            case 225:
            case 241:  // undocumented sbc immediate
                //SBC();
                // start the read process
                data = this.decodeOperand() & 4095;
                carryFlag = ((this.statusRegister ^ 1) & 1);
                result = (((this.accumulator - data) & 4095) - carryFlag) & 4095;
                // set overflow flag if sign bit of accumulator changed
                this.setFlag(this.SRMasks_OverflowMask, ((this.accumulator ^ result) & 128) === 128 && ((this.accumulator ^ data) & 128) === 128);
                this.setFlag(this.SRMasks_CarryMask, (result < 256));
                this.accumulator = (result) & 0xFF;
                this.setZNFlags(this.accumulator);
                break;
            case 56:
                //SEC();
                this.setFlag(this.SRMasks_CarryMask, true);
                break;
            case 248:
                //SED();
                this.setFlag(this.SRMasks_DecimalModeMask, true);
                break;
            case 120:
                //SEI();
                this.setFlag(this.SRMasks_InterruptDisableMask, true);
                break;
            case 133:
            case 149:
            case 141:
            case 157:
            case 153:
            case 129:
            case 145:
                //STA();
                this.SetByte(this.decodeAddress(), this.accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.SetByte(this.decodeAddress(), this.indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.SetByte(this.decodeAddress(), this.indexRegisterY);
                break;
            case 170:
                //TAX();
                this.indexRegisterX = this.accumulator;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 168:
                //TAY();
                this.indexRegisterY = this.accumulator;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 186:
                //TSX();
                this.indexRegisterX = this.stackPointer;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 138:
                //TXA();
                this.accumulator = this.indexRegisterX;
                this.setZNFlags(this.accumulator);
                break;
            case 154:
                //TXS();
                this.stackPointer = this.indexRegisterX;
                break;
            case 152:
                //TYA();
                this.accumulator = this.indexRegisterY;
                this.setZNFlags(this.accumulator);
                break;
            case 11:
            case 43:
                //AAC();
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator & 0xFF;
                this.setFlag(this.SRMasks_CarryMask, (this.accumulator & 128) === 128);
                this.setZNFlags(this.accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator;
                this.setFlag(this.SRMasks_CarryMask, (this.accumulator & 1) === 1);
                this.accumulator = this.accumulator >> 1;
                this.setZNFlags(this.accumulator);
                break;
            case 107:
                //ARR();
                //AND byte with accumulator, then rotate one bit right in accu - mulator and
                //  check bit 5 and 6:
                //If both bits are 1: set C, clear V. 0x30
                //If both bits are 0: clear C and V.
                //If only bit 5 is 1: set V, clear C.
                //If only bit 6 is 1: set C and V.
                //Status flags: N,V,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator;
                if ((this.statusRegister & 1) === 1) {
                    this.accumulator = (this.accumulator >> 1) | 128;
                } else {
                    this.accumulator = (this.accumulator >> 1);
                }
                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 
                this.setFlag(this.SRMasks_CarryMask, (this.accumulator & 1) === 1);
                switch (this.accumulator & 48) {
                    case 48:
                        this.setFlag(this.SRMasks_CarryMask, true);
                        this.setFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 0:
                        this.setFlag(this.SRMasks_CarryMask, false);
                        this.setFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 16:
                        this.setFlag(this.SRMasks_CarryMask, false);
                        this.setFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                    case 32:
                        this.setFlag(this.SRMasks_CarryMask, true);
                        this.setFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                }
                break;
            case 171:
                //ATX();
                //AND byte with accumulator, then transfer accumulator to X register.
                //Status flags: N,Z
                this.indexRegisterX = (this.accumulator = this.decodeOperand() & this.accumulator);
                this.setZNFlags(this.indexRegisterX);
                break;
        }
    }

    setZNFlags(data: number): void {
        //zeroResult = (data & 0xFF) == 0;
        //negativeResult = (data & 0x80) == 0x80;

        if ((data & 255) === 0) {
            this.statusRegister |= 2;
        } else {
            this.statusRegister &= -3;
        } // ((int)CPUStatusMasks.ZeroResultMask);

        if ((data & 128) === 128) {
            this.statusRegister |= 128;
        } else {
            this.statusRegister &= -129;
        } // ((int)CPUStatusMasks.NegativeResultMask);
    }

    compare(data: number): void {
        this.setFlag(this.SRMasks_CarryMask, data > 255);
        this.setZNFlags(data & 255);
    }

    branch(): void {
        const highByte = (this.programCounter >> 8) & 0xff;
        
        this._currentInstruction_ExtraTiming = 1;
        let addr = this._currentInstruction_Parameters0 & 255;
        if ((addr & 128) === 128) {
            addr = addr - 256;

        } 

        this.programCounter += addr;
        this.programCounter &= 0xffff;
        const newHighByte = (this.programCounter >> 8) & 0xff;
        if (highByte != newHighByte) {
            this._currentInstruction_ExtraTiming = 2;
        }
    }

    nmiHandler(): void {
        this._handleNMI = true;
    }

    private pushStack(data: number): void {
        this.memoryMap.Rams[this.stackPointer + 256] = data;
        this.stackPointer--;
        if (this.stackPointer < 0) {
            this.stackPointer = 255;
        }
    }

    private popStack(): number {
        this.stackPointer++;
        if (this.stackPointer > 255) {
            this.stackPointer = 0;
        }
        return this.memoryMap.Rams[this.stackPointer + 256];
    }

    public setupMemoryMap(cart: IBaseCart) {
        
        this.memoryMap = cart.createMemoryMap(this);
    }

    GetByte(address: number): number {
        if (!this.memoryMap) { return 0; }
        let result = this.memoryMap.getByte(this.clock, address);

        if (this.cheating)
        {
            const patch = this.genieCodes.find((v)=>{ return v.address == address; });
            if (patch && patch.active && patch.address == address) {
                if (patch.compare > -1) {
                    return (patch.compare == result ? patch.data : result) & 0xFF;
                } else {
                    return patch.data;
                }
            } 
        }

        return result & 255;
    }

    SetByte(address: number, data: number): void {
        if (!this.memoryMap) { return; }
        this.memoryMap.setByte(this.clock, address, data);
    }

    HandleNextEvent(): void {
        // this.ppu.HandleEvent(this.clock);
        // this.FindNextEvent();
    }
    ResetInstructionHistory(): void {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 0xFF;
    }

    writeInstructionHistory(): void {
        const inst: ChiChiInstruction = new ChiChiInstruction();
        inst.time = this.systemClock;
        inst.A = this.accumulator;
        inst.X = this.indexRegisterX;
        inst.Y = this.indexRegisterY;
        inst.SR = this.statusRegister;
        inst.SP = this.stackPointer;
        inst.frame = this.clock;
        inst.OpCode = this._currentInstruction_OpCode;
        inst.Parameters0 = this._currentInstruction_Parameters0;
        inst.Parameters1 = this._currentInstruction_Parameters1;
        inst.Address = this._currentInstruction_Address;
        inst.AddressingMode = this._currentInstruction_AddressingMode;
        inst.ExtraTiming = this._currentInstruction_ExtraTiming;

        this._instructionHistory[(this.instructionHistoryPointer--) & 255] = inst;
        this.instructionUsage[this._currentInstruction_OpCode]++;
        if ((this.instructionHistoryPointer & 255) === 255) {
            this.FireDebugEvent("instructionHistoryFull");
        }
    }

    FireDebugEvent(s: any): void {
    }

    GetStatus(): CpuStatus {
        return {
            PC: this.programCounter,
            A: this.accumulator,
            X: this.indexRegisterX,
            Y: this.indexRegisterY,
            SP: this.stackPointer,
            SR: this.statusRegister
        }
    }

    // get state(): IChiChiCPPUState {
    //     return {
    //         clock: this.clock,
            
    //         _statusRegister: this._statusRegister,
    //         _programCounter: this._programCounter,
    //         _handleNMI: this._handleNMI,
    //         _handleIRQ: this._handleIRQ,
    //         _addressBus: this._addressBus,
    //         _dataBus: this._dataBus,
    //         _operationCounter: this._operationCounter,
    //         _accumulator: this._accumulator,
    //         _indexRegisterX: this._indexRegisterX,
    //         _indexRegisterY: this._indexRegisterY,
    //         _currentInstruction_AddressingMode: this._currentInstruction_AddressingMode,
    //         _currentInstruction_Address: this._currentInstruction_Address,
    //         _currentInstruction_OpCode: this._currentInstruction_OpCode,
    //         _currentInstruction_Parameters0: this._currentInstruction_Parameters0,
    //         _currentInstruction_Parameters1: this._currentInstruction_Parameters1,
    //         _currentInstruction_ExtraTiming: this._currentInstruction_ExtraTiming,
    //         systemClock: this.systemClock,
    //         nextEvent: this.nextEvent,
        
    //         Debugging: this.Debugging,
    //         cheating: this.cheating,
    //         genieCodes: this.genieCodes

    //     };
    // }

    // set state(value: IChiChiCPPUState) {
    //     this.clock = value.clock,
        
    //     this._statusRegister = value._statusRegister,
    //     this._programCounter = value._programCounter,
    //     this._handleNMI = value._handleNMI,
    //     this._handleIRQ = value._handleIRQ,
    //     this._addressBus = value._addressBus,
    //     this._dataBus = value._dataBus,
    //     this._operationCounter = value._operationCounter,
    //     this._accumulator = value._accumulator,
    //     this._indexRegisterX = value._indexRegisterX,
    //     this._indexRegisterY = value._indexRegisterY,
    //     this._currentInstruction_AddressingMode = value._currentInstruction_AddressingMode,
    //     this._currentInstruction_Address = value._currentInstruction_Address,
    //     this._currentInstruction_OpCode = value._currentInstruction_OpCode,
    //     this._currentInstruction_Parameters0 = value._currentInstruction_Parameters0,
    //     this._currentInstruction_Parameters1 = value._currentInstruction_Parameters1,
    //     this._currentInstruction_ExtraTiming = value._currentInstruction_ExtraTiming,
    //     this.systemClock = value.systemClock,
    //     this.nextEvent = value.nextEvent,

    //     this.Debugging = value.Debugging,
    //     this.cheating = value.cheating,
    //     this.genieCodes = value.genieCodes

                    
        
    // }

    setupStateBuffer(sb: StateBuffer) {
        sb.onRestore.subscribe((buffer: StateBuffer) => {
            this.attachStateBuffer(buffer);
        })

        sb  .pushSegment(2 * Uint16Array.BYTES_PER_ELEMENT, 'cpu_status_16')
            .pushSegment(8, 'cpu_status')
            ;
        return sb;

    }
    
    attachStateBuffer(sb: StateBuffer) {
        this.cpuStatus = sb.getUint8Array('cpu_status');
        this.cpuStatus16 = sb.getUint16Array('cpu_status_16');
        // this.accumulator       = sb.buffer[sb.getSegment('acc').start]; 
        // this.indexRegisterX    = sb.buffer[sb.getSegment('idx').start];
        // this.indexRegisterY    = sb.buffer[sb.getSegment('idy').start];
        // this.stackPointer      = sb.buffer[sb.getSegment('sp').start];
        // this.statusRegister    = sb.buffer[sb.getSegment('sr').start];
        // let seg = sb.getSegment('pc');
        // let pc = new Uint16Array(seg.buffer, seg.start, 1);
        // this.programCounter    = pc[0];
    }
    
    // updateStateBuffer(sb: StateBuffer) {
    //     sb.buffer[sb.getSegment('acc').start] = this.accumulator; 
    //     sb.buffer[sb.getSegment('idx').start] = this.indexRegisterX;
    //     sb.buffer[sb.getSegment('idy').start] = this.indexRegisterY;
    //     sb.buffer[sb.getSegment('sp').start] = this.stackPointer;
    //     sb.buffer[sb.getSegment('sr').start] = this.statusRegister;
    //     let seg = sb.getSegment('pc');
    //     let pc = new Uint16Array(seg.buffer, seg.start, 1);
    //     pc[0] = this.programCounter;
    // }
    
}


        
        