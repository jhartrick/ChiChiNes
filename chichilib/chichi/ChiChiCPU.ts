import { ChiChiCPPU_AddressingModes, ChiChiInstruction, CpuStatus } from "./ChiChiTypes";
import { ChiChiInputHandler } from "./ChiChiControl";
import { IChiChiPPU } from "./ChiChiPPU";
import { IChiChiAPU, IChiChiAPUState } from "./ChiChiAudio";
import { IBaseCart } from '../chichicarts/BaseCart'
import { GeniePatch } from "./ChiChiCheats";
import { MemoryMap } from "./ChiChiMemoryMap";

export interface IChiChiCPPUState {
    clock: number;
    
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
    Rams: Uint8Array;

    Debugging: boolean;
    cheating: boolean;
    genieCodes: GeniePatch[];
}

export interface IChiChiCPPU extends IChiChiCPPUState {

    cheat(address: number, result: number): number;
    instructionHistoryPointer: number;
    _instructionHistory: ChiChiInstruction[];

    ppu: IChiChiPPU;
    PadOne: ChiChiInputHandler;
    PadTwo: ChiChiInputHandler;

    CurrentInstruction: ChiChiInstruction;
    SoundBopper: IChiChiAPU;
    Cart: IBaseCart;
    FrameOn: boolean;

    Step(): void;

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
    irqUpdater(): void;

    GetByte(address: number): number;
    SetByte(address: number, data: number): void;

    memoryMap: MemoryMap;

    PeekByte(address: number): number;
    PeekBytes(start: number, finish: number): number[];

    HandleNextEvent(): void;
    ResetInstructionHistory(): void;
    WriteInstructionHistoryAndUsage(): void;
    FireDebugEvent(s: string): void;
    
    GetStatus(): CpuStatus;

    state: IChiChiCPPUState;
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
            this.ppu.advanceClock(value);
            this.SoundBopper.advanceClock(value);
            this.Cart.advanceClock(value);
            this._clock += value;
        }
    }

    private _ticks = 0;

    // CPU Status
    _statusRegister = 0;
    _programCounter = 0;

    _handleNMI: boolean = false;
    _handleIRQ: boolean = false;
    // CPU Op info

    _addressBus = 0;
    _dataBus = 0;
    _operationCounter = 0;

    _accumulator = 0;
    _indexRegisterX = 0;
    _indexRegisterY = 0;

    // Current Instruction
    _currentInstruction_AddressingMode = ChiChiCPPU_AddressingModes.Bullshit;
    _currentInstruction_Address = 0;
    _currentInstruction_OpCode = 0;
    _currentInstruction_Parameters0 = 0;
    _currentInstruction_Parameters1 = 0;
    _currentInstruction_ExtraTiming = 0;
    systemClock = 0;
    nextEvent = -1;

    //tbi
    private _cheating = false;
    private __frameFinished = true;

    // system ram
    private _ramsBuffer = new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT);
    Rams = new Uint8Array(<any>this._ramsBuffer);// System.Array.init(vv, 0, System.Int32);
    private _stackPointer = 255;

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
    
    genieCodes: GeniePatch[] = new Array<GeniePatch>();

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

    memoryMap: MemoryMap;

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
        this._statusRegister = (value ? (this._statusRegister | Flag) : (this._statusRegister & ~Flag));

        this._statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    }

    GetFlag(flag: number): boolean {
        return ((this._statusRegister & flag) === flag);
    }

    interruptRequest(): void {
        this._handleIRQ = false;
        if (!this.GetFlag(this.SRMasks_InterruptDisableMask)) {
            this.advanceClock(7);
            this.setFlag(this.SRMasks_InterruptDisableMask, true);
            
            const newStatusReg1 = this._statusRegister & ~0x10 | 0x20;

            this.pushStack(this._programCounter >> 8);
            this.pushStack(this._programCounter);
            this.pushStack(this._statusRegister);

            this._programCounter = this.GetByte(0xFFFE) + (this.GetByte(0xFFFF) << 8);
        }

    }

    nonMaskableInterrupt(): void {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        const newStatusReg = this._statusRegister & ~0x10 | 0x20;

        this.setFlag(this.SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.pushStack(this._programCounter >> 8);
        this.pushStack(this._programCounter & 0xFF);
        //c7ab
        // push sr onto stack
        this.pushStack(newStatusReg);
        // point pc to interrupt service routine
        const lowByte = this.GetByte(0xFFFA);
        const highByte = this.GetByte(0xFFFB);
        const jumpTo = lowByte | (highByte << 8);
        this._programCounter = jumpTo;
            //nonOpCodeticks = 7;
    }


    Step(): void {
        //let tickCount = 0;
        this._currentInstruction_ExtraTiming = 0;
        //this.FindNextEvent();
        

        if (this._handleNMI) {
            this.advanceClock(7);
            this._handleNMI = false;
            this.nonMaskableInterrupt();
        } else if (this.Cart.irqRaised || this.SoundBopper.interruptRaised ) {
            this.interruptRequest();
        }

        //FetchNextInstruction();
        this._currentInstruction_Address = this._programCounter;
        this._currentInstruction_OpCode = this.GetByte(this._programCounter );
        this._programCounter = (this._programCounter + 1) & 0xffff;
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];
        this.fetchInstructionParameters();

        this.advanceClock(ChiChiCPPU.cpuTiming[this._currentInstruction_OpCode]);
        
        this.execute();

        this.advanceClock(this._currentInstruction_ExtraTiming);

        //("{0:x} {1:x} {2:x}", _currentInstruction_OpCode, _currentInstruction_AddressingMode, _currentInstruction_Address);
        if (this._debugging) {
            this.WriteInstructionHistoryAndUsage();
            this._operationCounter++;
        }
        //this.clock += ;
    }

    fetchInstructionParameters(): any {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.GetByte((this._programCounter++) & 0xFFFF);
                this._currentInstruction_Parameters1 = this.GetByte((this._programCounter++) & 0xFFFF);
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiCPPU_AddressingModes.Relative:
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.GetByte((this._programCounter++) & 0xFFFF);
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
        this._statusRegister = 52;
        this._operationCounter = 0;
        this._stackPointer = 253;
        this._programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
        this.advanceClock(4);
        this.genieCodes = [];
    }

    PowerOn(): void {
        // powers up with this state
        this._statusRegister = 52;
        this._stackPointer = 253;
        this._operationCounter = 0;
        this.advanceClock(4);
        // wram initialized to 0xFF, with some exceptions
        // probably doesn't affect games, but why not?
        for (var i = 0; i < 2048; ++i) {
            this.Rams[i] = 255;
        }
        this.Rams[8] = 247;
        this.Rams[9] = 239;
        this.Rams[10] = 223;
        this.Rams[15] = 191;

        this._programCounter =  this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
    }

    GetState(outStream: any): void {
        //throw new Error('Method not implemented.');
    }

    SetState(inStream: any): void {
        // throw new Error('Method not implemented.');
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
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterX) | 0));
                if ((result & 0xFF) < this._indexRegisterX) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.AbsoluteY:
                // absolute, y indexed - two paramaters + Index register y
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterY) | 0));
                if ((result & 0xFF) < this._indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
                // first parameter represents offset in zero page
                result = this._currentInstruction_Parameters0;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageX:
                result = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 0xFF;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageY:
                result = ((((this._currentInstruction_Parameters0 & 0xFF) + (this._indexRegisterY & 0xFF)) | 0)) & 0xFF;
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
                var addr = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 0xFF;
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
                result = (addr + this._indexRegisterY) | 0;
                if ((result & 0xFF) > this._indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.Relative:
                result = (((this._programCounter + this._currentInstruction_Parameters0) | 0));
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
                this._dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiCPPU_AddressingModes.Accumulator:
                return this._accumulator;
            default:
                this._dataBus = this.GetByte(this.decodeAddress());
                return this._dataBus;
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
                //SKB, SKW, DOP, - undocumented noops
                this.decodeAddress();
                break;
            case 105: case 101: case 117: case 109: case 125: case 121: case 97: case 113:
                //ADC
                data = this.decodeOperand();
                carryFlag = (this._statusRegister & 1);
                result = (this._accumulator + data + carryFlag) | 0;
                // carry flag
                this.setFlag(this.SRMasks_CarryMask, result > 255);
                // overflow flag
                this.setFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ data) & 128) !== 128 && ((this._accumulator ^ result) & 128) === 128);
                // occurs when bit 7 is set
                this._accumulator = result & 0xFF;
                this.setZNFlags(this._accumulator);
                break;
            case 41: case 37: case 53: case 45: case 61: case 57: case 33: case 49:
                //AND
                this._accumulator = (this._accumulator & this.decodeOperand());
                this.setZNFlags(this._accumulator);
                break;
            case 10: case 6: case 22: case 14: case 30:
                //ASL
                data = this.decodeOperand();
                // set carry flag
                this.setFlag(this.SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte(this.decodeAddress(), data);
                }
                this.setZNFlags(data);
                break;
            case 144:
                //BCC
                if ((this._statusRegister & 1) !== 1) {
                    this.branch();
                }
                break;
            case 176:
                //BCS();
                if ((this._statusRegister & 1) === 1) {
                    this.branch();
                }
                break;
            case 240:
                //BEQ();
                if ((this._statusRegister & 2) === 2) {
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
                    this._statusRegister = this._statusRegister | 128;
                } else {
                    this._statusRegister = this._statusRegister & 127;
                }
                if ((data & this._accumulator) === 0) {
                    this._statusRegister = this._statusRegister | 2;
                } else {
                    this._statusRegister = this._statusRegister & 253;
                }
                break;
            case 48:
                //BMI();
                if ((this._statusRegister & 128) === 128) {
                    this.branch();
                }
                break;
            case 208:
                //BNE();
                if ((this._statusRegister & 2) !== 2) {
                    this.branch();
                }
                break;
            case 16:
                //BPL();
                if ((this._statusRegister & 128) !== 128) {
                    this.branch();
                }
                break;
            case 0:
                //BRK();
                //BRK causes a non-maskable interrupt and increments the program counter by one. 
                //Therefore an RTI will go to the address of the BRK +2 so that BRK may be used to replace a two-byte instruction 
                // for debugging and the subsequent RTI will be correct. 
                // push pc onto stack (high byte first)
                this._programCounter = this._programCounter + 1;
                this.pushStack(this._programCounter >> 8 & 0xFF);
                this.pushStack(this._programCounter & 0xFF);
                // push sr onto stack
                //PHP and BRK push the current status with bits 4 and 5 set on the stack; 
                data = this._statusRegister | 16 | 32;
                this.pushStack(data);
                // set interrupt disable, and break flags
                // BRK then sets the I flag.
                this._statusRegister = this._statusRegister | 20;
                // point pc to interrupt service routine
                this._addressBus = 65534;
                lowByte = this.GetByte(this._addressBus);
                this._addressBus = 65535;
                highByte = this.GetByte(this._addressBus);
                this._programCounter = lowByte + highByte * 256;
                break;
            case 80:
                //BVC();
                if ((this._statusRegister & 64) !== 64) {
                    this.branch();
                }
                break;
            case 112:
                //BVS();
                if ((this._statusRegister & 64) === 64) {
                    this.branch();
                }
                break;
            case 24:
                //CLC();
                this.setFlag(this.SRMasks_CarryMask, false);
                break;
            case 216:
                //CLD();
                this.setFlag(this.SRMasks_DecimalModeMask, false);
                break;
            case 88:
                //CLI();
                this.setFlag(this.SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                //CLV();
                this.setFlag(this.SRMasks_OverflowMask, false);
                break;
            case 201: case 197: case 213: case 205: case 221: case 217: case 193: case 209:
                //CMP();
                data = (this._accumulator + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 224: case 228: case 236:
                //CPX();
                data = (this._indexRegisterX + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 192: case 196: case 204:
                //CPY();
                data = (this._indexRegisterY + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 198: case 214: case 206: case 222:
                //DEC();
                data = this.decodeOperand();
                data = (data - 1) & 0xFF;
                this.SetByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 202:
                //DEX();
                this._indexRegisterX = this._indexRegisterX - 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 136:
                //DEY();
                this._indexRegisterY = this._indexRegisterY - 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.setZNFlags(this._indexRegisterY);
                break;
            case 73:
            case 69:
            case 85:
            case 77:
            case 93:
            case 89:
            case 65:
            case 81:
                //EOR();
                this._accumulator = (this._accumulator ^ this.decodeOperand());
                this.setZNFlags(this._accumulator);
                break;
            case 230:
            case 246:
            case 238:
            case 254:
                //INC();
                data = this.decodeOperand();
                data = (data + 1) & 0xFF;
                this.SetByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 232:
                //INX();
                this._indexRegisterX = this._indexRegisterX + 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 200:
                this._indexRegisterY = this._indexRegisterY + 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.setZNFlags(this._indexRegisterY);
                break;
            case 76:
            case 108:
                // JMP();
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this._programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                } else {
                    this._programCounter = this.decodeAddress();
                }
                break;
            case 32:
                //JSR();
                this.pushStack((this._programCounter >> 8) & 0xFF);
                this.pushStack((this._programCounter - 1) & 0xFF);
                this._programCounter = this.decodeAddress();
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
                this._accumulator = this.decodeOperand();
                this.setZNFlags(this._accumulator);
                break;
            case 162:
            case 166:
            case 182:
            case 174:
            case 190:
                //LDX();
                this._indexRegisterX = this.decodeOperand();
                this.setZNFlags(this._indexRegisterX);
                break;
            case 160:
            case 164:
            case 180:
            case 172:
            case 188:
                //LDY();
                this._indexRegisterY = this.decodeOperand();
                this.setZNFlags(this._indexRegisterY);
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
                    this._accumulator = data;
                } else {
                    this.SetByte(this.decodeAddress(), data);
                }
                break;
            case 234: case 26: case 58: case 90: case 122: case 218: case 250: case 137:
                //case 0x04:
                //case 0x14:
                //case 0x34:
                //case 0x44:
                //case 0x64:
                //case 0x80:
                //case 0x82:
                //case 0xc2:
                //case 0xd4:
                //case 0xe2:
                //case 0xf4:
                //case 0x0c:
                //case 0x1c:
                //case 0x3c:
                //case 0x5c:
                //case 0x7c:
                //case 0xdc:
                //case 0xfc:
                //NOP();
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.AbsoluteX) {
                    this.decodeAddress();
                }
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
                this._accumulator = (this._accumulator | this.decodeOperand());
                this.setZNFlags(this._accumulator);
                break;
            case 72:
                //PHA();
                this.pushStack(this._accumulator);
                break;
            case 8:
                //PHP();
                data = this._statusRegister | 16 | 32;
                this.pushStack(data);
                break;
            case 104:
                //PLA();
                this._accumulator = this.popStack();
                this.setZNFlags(this._accumulator);
                break;
            case 40:
                //PLP();
                this._statusRegister = this.popStack(); // | 0x20;
                break;
            case 42:
            case 38:
            case 54:
            case 46:
            case 62:
                //ROL();
                data = this.decodeOperand();
                // old carry bit shifted into bit 1
                oldbit = (this._statusRegister & 1) === 1 ? 1 : 0;
                this.setFlag(this.SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
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
                oldbit = (this._statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.setFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte(this.decodeAddress(), data);
                }
                break;
            case 64:
                //RTI();
                this._statusRegister = this.popStack(); // | 0x20;
                lowByte = this.popStack();
                highByte = this.popStack();
                this._programCounter = ((highByte << 8) | lowByte);
                break;
            case 96:
                //RTS();
                lowByte = (this.popStack() + 1) & 0xFF;
                highByte = this.popStack();
                this._programCounter = ((highByte << 8) | lowByte);
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
                carryFlag = ((this._statusRegister ^ 1) & 1);
                result = (((this._accumulator - data) & 4095) - carryFlag) & 4095;
                // set overflow flag if sign bit of accumulator changed
                this.setFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ result) & 128) === 128 && ((this._accumulator ^ data) & 128) === 128);
                this.setFlag(this.SRMasks_CarryMask, (result < 256));
                this._accumulator = (result) & 0xFF;
                this.setZNFlags(this._accumulator);
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
                this.SetByte(this.decodeAddress(), this._accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.SetByte(this.decodeAddress(), this._indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.SetByte(this.decodeAddress(), this._indexRegisterY);
                break;
            case 170:
                //TAX();
                this._indexRegisterX = this._accumulator;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 168:
                //TAY();
                this._indexRegisterY = this._accumulator;
                this.setZNFlags(this._indexRegisterY);
                break;
            case 186:
                //TSX();
                this._indexRegisterX = this._stackPointer;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 138:
                //TXA();
                this._accumulator = this._indexRegisterX;
                this.setZNFlags(this._accumulator);
                break;
            case 154:
                //TXS();
                this._stackPointer = this._indexRegisterX;
                break;
            case 152:
                //TYA();
                this._accumulator = this._indexRegisterY;
                this.setZNFlags(this._accumulator);
                break;
            case 11:
            case 43:
                //AAC();
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this._accumulator = this.decodeOperand() & this._accumulator & 0xFF;
                this.setFlag(this.SRMasks_CarryMask, (this._accumulator & 128) === 128);
                this.setZNFlags(this._accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this._accumulator = this.decodeOperand() & this._accumulator;
                this.setFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                this._accumulator = this._accumulator >> 1;
                this.setZNFlags(this._accumulator);
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
                this._accumulator = this.decodeOperand() & this._accumulator;
                if ((this._statusRegister & 1) === 1) {
                    this._accumulator = (this._accumulator >> 1) | 128;
                } else {
                    this._accumulator = (this._accumulator >> 1);
                }
                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 
                this.setFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                switch (this._accumulator & 48) {
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
                this._indexRegisterX = (this._accumulator = this.decodeOperand() & this._accumulator);
                this.setZNFlags(this._indexRegisterX);
                break;
        }
    }

    setZNFlags(data: number): void {
        //zeroResult = (data & 0xFF) == 0;
        //negativeResult = (data & 0x80) == 0x80;

        if ((data & 255) === 0) {
            this._statusRegister |= 2;
        } else {
            this._statusRegister &= -3;
        } // ((int)CPUStatusMasks.ZeroResultMask);

        if ((data & 128) === 128) {
            this._statusRegister |= 128;
        } else {
            this._statusRegister &= -129;
        } // ((int)CPUStatusMasks.NegativeResultMask);
    }

    compare(data: number): void {
        this.setFlag(this.SRMasks_CarryMask, data > 255);
        this.setZNFlags(data & 255);
    }

    branch(): void {
        const highByte = (this._programCounter >> 8) & 0xff;
        
        this._currentInstruction_ExtraTiming = 1;
        let addr = this._currentInstruction_Parameters0 & 255;
        if ((addr & 128) === 128) {
            addr = addr - 256;

        } 

        this._programCounter += addr;
        this._programCounter &= 0xffff;
        const newHighByte = (this._programCounter >> 8) & 0xff;
        if (highByte != newHighByte) {
            this._currentInstruction_ExtraTiming = 2;
        }
    }

    nmiHandler(): void {
        this._handleNMI = true;
    }

    irqUpdater(): void {
        this._handleIRQ = this.SoundBopper.interruptRaised || this.Cart.irqRaised;
    }

    private pushStack(data: number): void {
        this.Rams[this._stackPointer + 256] = data;
        this._stackPointer--;
        if (this._stackPointer < 0) {
            this._stackPointer = 255;
        }
    }

    private popStack(): number {
        this._stackPointer++;
        if (this._stackPointer > 255) {
            this._stackPointer = 0;
        }
        return this.Rams[this._stackPointer + 256];
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

    PeekByte(address: number): number {
        var result = 0;
        // check high byte, find appropriate handler
        switch (address & 61440) {
            case 0:
            case 4096:
                if (address < 2048) {
                    result = this.Rams[address];
                } else {
                    result = address >> 8;
                }
                break;
            case 8192:
            case 12288:
                result = 0;
                //result = this.PPU_GetByte(this.clock, address);
                break;
            case 16384:
                switch (address) {
                    case 16406:
                        result = this._padOne.GetByte(this.clock, address);
                        break;
                    case 16407:
                        result = this._padTwo.GetByte(this.clock, address);
                        break;
                    case 16405:
                        result = this.SoundBopper.GetByte(this.clock, address);
                        break;
                    default:
                        // return open bus?
                        result = address >> 8;
                        break;
                }
                break;
            case 20480:
                // ??
                result = address >> 8;
                break;
            case 24576:
            case 28672:
            case 32768:
            case 36864:
            case 40960:
            case 45056:
            case 49152:
            case 53248:
            case 57344:
            case 61440:
                // cart 
                result = 0;
                //result = this.Cart.GetByte(this.clock, address);
                break;
            default:
                throw new Error("Bullshit!");
        }
        //if (_cheating && memoryPatches.ContainsKey(address))
        //{

        //    return memoryPatches[address].Activated ? memoryPatches[address].GetData(result) & 0xFF : result & 0xFF;
        //}

        return result & 255;
    }

    PeekBytes(start: number, finish: number): number[] {
        var array = new Array<number>();
        for (let i = 0; i < finish; ++i) {
            if (i< this.Rams.length) array.push(this.Rams[i]);
        }
        return array;
    }


    HandleNextEvent(): void {
        // this.ppu.HandleEvent(this.clock);
        // this.FindNextEvent();
    }
    ResetInstructionHistory(): void {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 0xFF;
    }

    WriteInstructionHistoryAndUsage(): void {
        const inst: ChiChiInstruction = new ChiChiInstruction();
        inst.time = this.systemClock;
        inst.A = this._accumulator;
        inst.X = this._indexRegisterX;
        inst.Y = this._indexRegisterY;
        inst.SR = this._statusRegister;
        inst.SP = this._stackPointer;
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
            PC: this._programCounter,
            A: this._accumulator,
            X: this._indexRegisterX,
            Y: this._indexRegisterY,
            SP: this._stackPointer,
            SR: this._statusRegister
        }
    }

    get state(): IChiChiCPPUState {
        return {
            clock: this.clock,
            
            _statusRegister: this._statusRegister,
            _programCounter: this._programCounter,
            _handleNMI: this._handleNMI,
            _handleIRQ: this._handleIRQ,
            _addressBus: this._addressBus,
            _dataBus: this._dataBus,
            _operationCounter: this._operationCounter,
            _accumulator: this._accumulator,
            _indexRegisterX: this._indexRegisterX,
            _indexRegisterY: this._indexRegisterY,
            _currentInstruction_AddressingMode: this._currentInstruction_AddressingMode,
            _currentInstruction_Address: this._currentInstruction_Address,
            _currentInstruction_OpCode: this._currentInstruction_OpCode,
            _currentInstruction_Parameters0: this._currentInstruction_Parameters0,
            _currentInstruction_Parameters1: this._currentInstruction_Parameters1,
            _currentInstruction_ExtraTiming: this._currentInstruction_ExtraTiming,
            systemClock: this.systemClock,
            nextEvent: this.nextEvent,
            Rams: this.Rams.slice(),
        
            Debugging: this.Debugging,
            cheating: this.cheating,
            genieCodes: this.genieCodes

        };
    }

    set state(value: IChiChiCPPUState) {
        this.clock = value.clock,
        
        this._statusRegister = value._statusRegister,
        this._programCounter = value._programCounter,
        this._handleNMI = value._handleNMI,
        this._handleIRQ = value._handleIRQ,
        this._addressBus = value._addressBus,
        this._dataBus = value._dataBus,
        this._operationCounter = value._operationCounter,
        this._accumulator = value._accumulator,
        this._indexRegisterX = value._indexRegisterX,
        this._indexRegisterY = value._indexRegisterY,
        this._currentInstruction_AddressingMode = value._currentInstruction_AddressingMode,
        this._currentInstruction_Address = value._currentInstruction_Address,
        this._currentInstruction_OpCode = value._currentInstruction_OpCode,
        this._currentInstruction_Parameters0 = value._currentInstruction_Parameters0,
        this._currentInstruction_Parameters1 = value._currentInstruction_Parameters1,
        this._currentInstruction_ExtraTiming = value._currentInstruction_ExtraTiming,
        this.systemClock = value.systemClock,
        this.nextEvent = value.nextEvent,

        this.Debugging = value.Debugging,
        this.cheating = value.cheating,
        this.genieCodes = value.genieCodes

        for (let i = 0; i < this.Rams.length; ++i) {
            this.Rams[i] = value.Rams[i];
        }
                    
        
    }

}


        
        