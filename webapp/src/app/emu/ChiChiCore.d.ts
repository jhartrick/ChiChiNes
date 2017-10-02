/// <reference path="./bridge.d.ts" />

declare module NES.CPU {
    export interface NESCart extends NES.CPU.Machine.Carts.BaseCart {
        InitializeCart(): void;
        CopyBanks(clock: number, dest: number, src: number, numberOf8kBanks: number): void;
        SetByte(clock: number, address: number, val: number): void;
    }
    export interface NESCartFunc extends Function {
        prototype: NESCart;
        new (): NESCart;
    }
    var NESCart: NESCartFunc;

}

declare module NES.CPU.Fastendo {
    export interface IMemoryMappedIOElement {
        NES$CPU$Fastendo$IMemoryMappedIOElement$GetByte(address: number): number;
        GetByte(address: number): number;
        NES$CPU$Fastendo$IMemoryMappedIOElement$SetByte(address: number, data: number): void;
        SetByte(address: number, data: number): void;
    }

    export interface IClockedMemoryMappedIOElement {
        NES$CPU$Fastendo$IClockedMemoryMappedIOElement$NMIHandler: {(): void};
        NMIHandler: {(): void};
        NES$CPU$Fastendo$IClockedMemoryMappedIOElement$IRQAsserted: boolean;
        IRQAsserted: boolean;
        NES$CPU$Fastendo$IClockedMemoryMappedIOElement$NextEventAt: number;
        NextEventAt: number;
        NES$CPU$Fastendo$IClockedMemoryMappedIOElement$GetByte(Clock: number, address: number): number;
        GetByte(Clock: number, address: number): number;
        NES$CPU$Fastendo$IClockedMemoryMappedIOElement$SetByte(Clock: number, address: number, data: number): void;
        SetByte(Clock: number, address: number, data: number): void;
        NES$CPU$Fastendo$IClockedMemoryMappedIOElement$HandleEvent(Clock: number): void;
        HandleEvent(Clock: number): void;
        NES$CPU$Fastendo$IClockedMemoryMappedIOElement$ResetClock(Clock: number): void;
        ResetClock(Clock: number): void;
    }

    export enum CPUStatusMasks {
        CarryMask = 1,
        ZeroResultMask = 2,
        InterruptDisableMask = 4,
        DecimalModeMask = 8,
        BreakCommandMask = 16,
        ExpansionMask = 32,
        OverflowMask = 64,
        NegativeResultMask = 128
    }

    export enum CPUStatusBits {
        Carry = 0,
        ZeroResult = 1,
        InterruptDisable = 2,
        DecimalMode = 3,
        BreakCommand = 4,
        Expansion = 5,
        Overflow = 6,
        NegativeResult = 7
    }

    export enum AddressingModes {
        Bullshit = 0,
        Implicit = 1,
        Accumulator = 2,
        Immediate = 3,
        ZeroPage = 4,
        ZeroPageX = 5,
        ZeroPageY = 6,
        Relative = 7,
        Absolute = 8,
        AbsoluteX = 9,
        AbsoluteY = 10,
        Indirect = 11,
        IndexedIndirect = 12,
        IndirectIndexed = 13,
        IndirectZeroPage = 14,
        IndirectAbsoluteX = 15
    }

    export interface CPU2A03 {
        addressmode: NES.CPU.Fastendo.AddressingModes[];
        Accumulator: number;
        IndexRegisterY: number;
        IndexRegisterX: number;
        ProgramCounter: number;
        StatusRegister: number;
        AddressCodePage: number;
        AddressLowByte: number;
        AddressBus: number;
        DataBus: number;
        MemoryLock: boolean;
        ReadWrite: boolean;
        Ready: boolean;
        Reset: boolean;
        /**
         * read only access to the current instruction pointed to by the program counter
         *
         * @instance
         * @public
         * @readonly
         * @memberof NES.CPU.Fastendo.CPU2A03
         * @function CurrentInstruction
         * @type NES.CPU.Fastendo.CPU2A03.Instruction
         */
        CurrentInstruction: NES.CPU.Fastendo.CPU2A03.Instruction;
        OperationCounter: number;
        Clock: number;
        RunningHard: boolean;
        /**
         * number of full clock ticks elapsed since emulation started
         *
         * @instance
         * @public
         * @memberof NES.CPU.Fastendo.CPU2A03
         * @function Ticks
         * @type number
         */
        Ticks: number;
        MemoryPatches: System.Collections.Generic.Dictionary$2<number,NES.CPU.Fastendo.Hacking.IMemoryPatch>;
        GenieCodes: System.Collections.Generic.Dictionary$2<number,number>;
        Cheating: boolean;
        SoundBopper: NES.CPU.Fastendo.IClockedMemoryMappedIOElement;
        PadOne: NES.CPU.nitenedo.InputHandler;
        PadTwo: NES.CPU.nitenedo.InputHandler;
        Cart: NES.CPU.Fastendo.IClockedMemoryMappedIOElement;
        PixelWhizzler: NES.CPU.PixelWhizzlerClasses.IPPU;
        StackPointer: number;
        Debugging: boolean;
        InstructionUsage: number[];
        InstructionHistoryPointer: number;
        InstructionHistory: NES.CPU.Fastendo.CPU2A03.Instruction[];
        getSRMask(flag: NES.CPU.Fastendo.CPUStatusBits): number;
        SetFlag(Flag: NES.CPU.Fastendo.CPUStatusMasks, value: boolean): void;
        GetFlag(Flag: NES.CPU.Fastendo.CPUStatusMasks): boolean;
        InterruptRequest(): void;
        NonMaskableInterrupt(): void;
        CheckEvent(): void;
        RunFast(): void;
        Step(): void;
        /**
         * runs up to x clock cycles, then returns
         *
         * @instance
         * @public
         * @this NES.CPU.Fastendo.CPU2A03
         * @memberof NES.CPU.Fastendo.CPU2A03
         * @param   {number}    count
         * @return  {void}
         */
        RunCycles(count: number): void;
        FetchNextInstruction(): boolean;
        FetchInstructionParameters(): void;
        FetchInstructionParameters$1(inst: {v: NES.CPU.Fastendo.CPU2A03.Instruction}, address: number): void;
        setupticks(): void;
        ResetCPU(): void;
        PowerOn(): void;
        GetState(outStream: System.Collections.Generic.Queue$1<number>): void;
        SetState(inStream: System.Collections.Generic.Queue$1<number>): void;
        DecodeAddress(): number;
        DecodeOperand(): number;
        StoreOperand(address: number): void;
        Execute(): void;
        SetZNFlags(data: number): void;
        LDA(): void;
        LDX(): void;
        LDY(): void;
        STA(): void;
        STX(): void;
        STY(): void;
        SED(): void;
        CLD(): void;
        JMP(): void;
        DEC(): void;
        INC(): void;
        ADC(): void;
        LSR(): void;
        SBC(): void;
        AND(): void;
        ORA(): void;
        EOR(): void;
        ASL(): void;
        BIT(): void;
        SEC(): void;
        CLC(): void;
        SEI(): void;
        CLI(): void;
        CLV(): void;
        Compare(data: number): void;
        CMP(): void;
        CPX(): void;
        CPY(): void;
        NOP(): void;
        Branch(): void;
        BCC(): void;
        BCS(): void;
        BPL(): void;
        BMI(): void;
        BVC(): void;
        BVS(): void;
        BNE(): void;
        BEQ(): void;
        DEX(): void;
        DEY(): void;
        INX(): void;
        INY(): void;
        TAX(): void;
        TXA(): void;
        TAY(): void;
        TYA(): void;
        TXS(): void;
        TSX(): void;
        PHA(): void;
        PLA(): void;
        PHP(): void;
        PLP(): void;
        JSR(): void;
        ROR(): void;
        ROL(): void;
        RTS(): void;
        RTI(): void;
        BRK(): void;
        NMIHandler(): void;
        IRQUpdater(): void;
        LoadBytes(offset: number, bytes: number[]): void;
        LoadBytes$1(offset: number, bytes: number[], length: number): void;
        PushStack(data: number): void;
        PopStack(): number;
        GetByte(): number;
        GetByte$1(address: number): number;
        SetByte(): void;
        SetByte$1(address: number, data: number): void;
        FindNextEvent(): void;
        HandleNextEvent(): void;
        WriteInstructionHistoryAndUsage(): void;
        PeekInstruction(address: number): NES.CPU.Fastendo.CPU2A03.Instruction;
    }
    export interface CPU2A03Func extends Function {
        prototype: CPU2A03;
        Instruction: NES.CPU.Fastendo.CPU2A03.InstructionFunc;
        smallInstruction: NES.CPU.Fastendo.CPU2A03.smallInstructionFunc;
        CPUStatus: NES.CPU.Fastendo.CPU2A03.CPUStatusFunc;
        new (whizzler: NES.CPU.PixelWhizzlerClasses.IPPU, bopper: NES.CPU.Machine.BeepsBoops.Bopper): CPU2A03;
    }
    var CPU2A03: CPU2A03Func;
    module CPU2A03 {
        export interface Instruction {
            AddressingMode: NES.CPU.Fastendo.AddressingModes;
            Address: number;
            OpCode: number;
            Parameters0: number;
            Parameters1: number;
            ExtraTiming: number;
            Length: number;
        }
        export interface InstructionFunc extends Function {
            prototype: Instruction;
            new (): Instruction;
            ctor: {
                new (): Instruction
            };
            $ctor1: {
                new (inst: NES.CPU.Fastendo.CPU2A03.Instruction): Instruction
            };
        }

        export interface smallInstruction {
            $clone(to: NES.CPU.Fastendo.CPU2A03.smallInstruction): NES.CPU.Fastendo.CPU2A03.smallInstruction;
        }
        export interface smallInstructionFunc extends Function {
            prototype: smallInstruction;
            new (): smallInstruction;
            UnpackInstruction(instruction: number): NES.CPU.Fastendo.CPU2A03.Instruction;
        }

        export interface CPUStatus {
            StatusRegister: number;
            ProgramCounter: number;
            Accumulator: number;
            IndexRegisterX: number;
            IndexRegisterY: number;
        }
        export interface CPUStatusFunc extends Function {
            prototype: CPUStatus;
            new (): CPUStatus;
        }
    }

}

declare module NES.CPU.Fastendo.Hacking {
    export interface MemoryPatch extends NES.CPU.Fastendo.Hacking.IMemoryPatch {
        Activated: boolean;
        Address: number;
        GetData(data: number): number;
        toString(): string;
    }
    export interface MemoryPatchFunc extends Function {
        prototype: MemoryPatch;
        new (Address: number, Data: number): MemoryPatch;
    }
    var MemoryPatch: MemoryPatchFunc;

    export interface ComparedMemoryPatch extends NES.CPU.Fastendo.Hacking.IMemoryPatch {
        Activated: boolean;
        Address: number;
        GetData(data: number): number;
        toString(): string;
    }
    export interface ComparedMemoryPatchFunc extends Function {
        prototype: ComparedMemoryPatch;
        new (Address: number, CompareToData: number, ReplaceWithData: number): ComparedMemoryPatch;
    }
    var ComparedMemoryPatch: ComparedMemoryPatchFunc;

    export interface IMemoryPatch {
        NES$CPU$Fastendo$Hacking$IMemoryPatch$Activated: boolean;
        Activated: boolean;
        NES$CPU$Fastendo$Hacking$IMemoryPatch$Address: number;
        Address: number;
        NES$CPU$Fastendo$Hacking$IMemoryPatch$GetData(data: number): number;
        GetData(data: number): number;
    }

}

declare module NES.CPU.Machine {
    export interface IPixelAwareDevice {
        NES$CPU$Machine$IPixelAwareDevice$addNeedPixelNow(value: {(sender: any, e: NES.CPU.Machine.ClockedRequestEventArgs): void}): void;
        NES$CPU$Machine$IPixelAwareDevice$removeNeedPixelNow(value: {(sender: any, e: NES.CPU.Machine.ClockedRequestEventArgs): void}): void;
        addNeedPixelNow(value: {(sender: any, e: NES.CPU.Machine.ClockedRequestEventArgs): void}): void;
        removeNeedPixelNow(value: {(sender: any, e: NES.CPU.Machine.ClockedRequestEventArgs): void}): void;
        NES$CPU$Machine$IPixelAwareDevice$PixelICareAbout: number;
        PixelICareAbout: number;
    }

    /** @namespace NES.CPU.Machine */

    /**
     * plugs up a nes control port, when nothing else is using it
     *
     * @public
     * @class NES.CPU.Machine.NullControlPad
     * @implements  NES.CPU.Machine.IControlPad
     */
    export interface NullControlPad extends NES.CPU.Machine.IControlPad {
        CurrentByte: number;
        refresh(): void;
        getByte(clock: number): number;
        setByte(clock: number, data: number): void;
        dispose(): void;
    }
    export interface NullControlPadFunc extends Function {
        prototype: NullControlPad;
        new (): NullControlPad;
    }
    var NullControlPad: NullControlPadFunc;

    export interface IControlPad extends System.IDisposable {
        NES$CPU$Machine$IControlPad$CurrentByte: number;
        CurrentByte: number;
        NES$CPU$Machine$IControlPad$refresh(): void;
        refresh(): void;
        NES$CPU$Machine$IControlPad$getByte(clock: number): number;
        getByte(clock: number): number;
        NES$CPU$Machine$IControlPad$setByte(clock: number, data: number): void;
        setByte(clock: number, data: number): void;
    }

    export interface ControlByteEventArgs {
        NextValue: number;
    }
    export interface ControlByteEventArgsFunc extends Function {
        prototype: ControlByteEventArgs;
        new (value: number): ControlByteEventArgs;
    }
    var ControlByteEventArgs: ControlByteEventArgsFunc;

    export interface ClockedRequestEventArgs {
        Clock: number;
    }
    export interface ClockedRequestEventArgsFunc extends Function {
        prototype: ClockedRequestEventArgs;
        new (): ClockedRequestEventArgs;
    }
    var ClockedRequestEventArgs: ClockedRequestEventArgsFunc;

}

declare module NES.CPU.Machine.BeepsBoops {
    export interface SquareChannel {
        Length: number;
        /**
         * Duty cycle of current square wave
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.SquareChannel
         * @function DutyCycle
         * @type number
         */
        DutyCycle: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.SquareChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * Volume envelope for current waveform
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.SquareChannel
         * @function Volume
         * @type number
         */
        Volume: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.SquareChannel
         * @function Time
         * @type number
         */
        Time: number;
        Envelope: number;
        Looping: boolean;
        Enabled: boolean;
        /**
         * Master gain
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.SquareChannel
         * @function Gain
         * @type number
         */
        Gain: number;
        /**
         * True for ones complement, false for twos complement
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.SquareChannel
         * @function SweepComplement
         * @type boolean
         */
        SweepComplement: boolean;
        WriteRegister(register: number, data: number, time: number): void;
        Run(end_time: number): void;
        UpdateAmplitude(new_amp: number): void;
        EndFrame(time: number): void;
        FrameClock(time: number, step: number): void;
    }
    export interface SquareChannelFunc extends Function {
        prototype: SquareChannel;
        new (bleeper: NES.CPU.Machine.BeepsBoops.Blip, chan: number): SquareChannel;
    }
    var SquareChannel: SquareChannelFunc;

    export interface Bopper extends NES.CPU.Fastendo.IClockedMemoryMappedIOElement,NES.CPU.Machine.BeepsBoops.IAPU {
        SampleRate: number;
        Muted: boolean;
        WriteBuffer: number[];
        InterruptRaised: boolean;
        EnableSquare0: boolean;
        EnableSquare1: boolean;
        EnableTriangle: boolean;
        EnableNoise: boolean;
        NMIHandler: {(): void};
        IRQAsserted: boolean;
        NextEventAt: number;
        RebuildSound(): void;
        GetByte(Clock: number, address: number): number;
        ReadStatus(): number;
        SetByte(Clock: number, address: number, data: number): void;
        DoSetByte(Clock: number, address: number, data: number): void;
        UpdateFrame(time: number): void;
        RunFrameEvents(time: number, step: number): void;
        EndFrame(time: number): void;
        FlushFrame(time: number): void;
        HandleEvent(Clock: number): void;
        ResetClock(Clock: number): void;
    }
    export interface BopperFunc extends Function {
        prototype: Bopper;
        new (output: NES.CPU.Machine.BeepsBoops.WavSharer): Bopper;
    }
    var Bopper: BopperFunc;

    export interface WavSharer extends NES.CPU.Machine.BeepsBoops.IWavReader {
        Locker: any;
        NESTooFast: boolean;
        Frequency: number;
        SharedBuffer: number[];
        SharedBufferLength: number;
        BufferAvailable: boolean;
        BytesWritten: {(sender: any, e: System.Object): void};
        WavesWritten(remain: number): void;
        AppendFile(writer: NES.CPU.Machine.BeepsBoops.IWavWriter): void;
        Dispose(): void;
        StartReadWaves(): void;
        ReadWaves(): void;
        WroteBytes(): void;
        SetSharedBuffer(values: number[]): void;
    }
    export interface WavSharerFunc extends Function {
        prototype: WavSharer;
        $ctor1: {
            new (frequency: number): WavSharer
        };
        new (): WavSharer;
        ctor: {
            new (): WavSharer
        };
    }
    var WavSharer: WavSharerFunc;

    export interface DMCChannel {
        Length: number;
        /**
         * Duty cycle of current square wave
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.DMCChannel
         * @function DutyCycle
         * @type number
         */
        DutyCycle: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.DMCChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * Volume envelope for current waveform
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.DMCChannel
         * @function Volume
         * @type number
         */
        Volume: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.DMCChannel
         * @function Time
         * @type number
         */
        Time: number;
        Envelope: number;
        Looping: boolean;
        Enabled: boolean;
        /**
         * Master gain
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.DMCChannel
         * @function Gain
         * @type number
         */
        Gain: number;
        /**
         * True for ones complement, false for twos complement
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.DMCChannel
         * @function SweepComplement
         * @type boolean
         */
        SweepComplement: boolean;
        WriteRegister(register: number, data: number, time: number): void;
        Run(end_time: number): void;
        UpdateAmplitude(new_amp: number): void;
        EndFrame(time: number): void;
        FrameClock(time: number, step: number): void;
    }
    export interface DMCChannelFunc extends Function {
        prototype: DMCChannel;
        new (bleeper: NES.CPU.Machine.BeepsBoops.Blip, chan: number): DMCChannel;
    }
    var DMCChannel: DMCChannelFunc;

    export interface IWavReader {
        NES$CPU$Machine$BeepsBoops$IWavReader$SharedBuffer: number[];
        SharedBuffer: number[];
        NES$CPU$Machine$BeepsBoops$IWavReader$SharedBufferLength: number;
        SharedBufferLength: number;
        NES$CPU$Machine$BeepsBoops$IWavReader$Frequency: number;
        Frequency: number;
        NES$CPU$Machine$BeepsBoops$IWavReader$BufferAvailable: boolean;
        BufferAvailable: boolean;
        NES$CPU$Machine$BeepsBoops$IWavReader$BytesWritten: {(sender: any, e: System.Object): void};
        BytesWritten: {(sender: any, e: System.Object): void};
        NES$CPU$Machine$BeepsBoops$IWavReader$StartReadWaves(): void;
        StartReadWaves(): void;
        NES$CPU$Machine$BeepsBoops$IWavReader$ReadWaves(): void;
        ReadWaves(): void;
        NES$CPU$Machine$BeepsBoops$IWavReader$SetSharedBuffer(values: number[]): void;
        SetSharedBuffer(values: number[]): void;
    }

    export interface SoundStatusChangeEventArgs {
        Muted: boolean;
    }
    export interface SoundStatusChangeEventArgsFunc extends Function {
        prototype: SoundStatusChangeEventArgs;
        new (): SoundStatusChangeEventArgs;
    }
    var SoundStatusChangeEventArgs: SoundStatusChangeEventArgsFunc;

    export interface IAPU {
        NES$CPU$Machine$BeepsBoops$IAPU$InterruptRaised: boolean;
        InterruptRaised: boolean;
        NES$CPU$Machine$BeepsBoops$IAPU$Muted: boolean;
        Muted: boolean;
        NES$CPU$Machine$BeepsBoops$IAPU$EnableSquare0: boolean;
        EnableSquare0: boolean;
        NES$CPU$Machine$BeepsBoops$IAPU$EnableSquare1: boolean;
        EnableSquare1: boolean;
        NES$CPU$Machine$BeepsBoops$IAPU$EnableTriangle: boolean;
        EnableTriangle: boolean;
        NES$CPU$Machine$BeepsBoops$IAPU$EnableNoise: boolean;
        EnableNoise: boolean;
        NES$CPU$Machine$BeepsBoops$IAPU$UpdateFrame(time: number): void;
        UpdateFrame(time: number): void;
        NES$CPU$Machine$BeepsBoops$IAPU$EndFrame(time: number): void;
        EndFrame(time: number): void;
    }

    export interface NoiseChannel {
        Length: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.NoiseChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * Volume envelope for current waveform
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.NoiseChannel
         * @function Volume
         * @type number
         */
        Volume: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.NoiseChannel
         * @function Time
         * @type number
         */
        Time: number;
        Looping: boolean;
        Enabled: boolean;
        Gain: number;
        WriteRegister(register: number, data: number, time: number): void;
        Run(end_time: number): void;
        UpdateAmplitude(amp: number): void;
        EndFrame(time: number): void;
        FrameClock(time: number, step: number): void;
    }
    export interface NoiseChannelFunc extends Function {
        prototype: NoiseChannel;
        new (bleeper: NES.CPU.Machine.BeepsBoops.Blip, chan: number): NoiseChannel;
    }
    var NoiseChannel: NoiseChannelFunc;

    export interface Blip {
        BlipBuffer: NES.CPU.Machine.BeepsBoops.Blip.blip_buffer_t;
        blip_samples_avail: number;
        blip_new(size: number): void;
        blip_set_rates(clock_rate: number, sample_rate: number): void;
        blip_clear(): void;
        blip_clocks_needed(samples: number): number;
        blip_end_frame(t: number): void;
        remove_samples(count: number): void;
        ReadBytes(outbuf: number[], count: number, stereo: number): number;
        blip_add_delta(time: number, delta: number): void;
        blip_add_delta_fast(time: number, delta: number): void;
    }
    export interface BlipFunc extends Function {
        prototype: Blip;
        blip_buffer_t: NES.CPU.Machine.BeepsBoops.Blip.blip_buffer_tFunc;
        new (size: number): Blip;
    }
    var Blip: BlipFunc;
    module Blip {
        export interface blip_buffer_t {
            samples: number[];
        }
        export interface blip_buffer_tFunc extends Function {
            prototype: blip_buffer_t;
            new (size: number): blip_buffer_t;
        }
    }

    export interface TriangleChannel {
        Length: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.TriangleChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof NES.CPU.Machine.BeepsBoops.TriangleChannel
         * @function Time
         * @type number
         */
        Time: number;
        Envelope: number;
        Looping: boolean;
        Enabled: boolean;
        Amplitude: number;
        Gain: number;
        WriteRegister(register: number, data: number, time: number): void;
        Run(end_time: number): void;
        UpdateAmplitude(new_amp: number): void;
        EndFrame(time: number): void;
        FrameClock(time: number, step: number): void;
    }
    export interface TriangleChannelFunc extends Function {
        prototype: TriangleChannel;
        new (bleeper: NES.CPU.Machine.BeepsBoops.Blip, chan: number): TriangleChannel;
    }
    var TriangleChannel: TriangleChannelFunc;

    export interface IWavWriter extends System.IDisposable {
        NES$CPU$Machine$BeepsBoops$IWavWriter$writeWaves(inBuff: number[], remain: number): void;
        writeWaves(inBuff: number[], remain: number): void;
    }

}

declare module NES.CPU.Machine.Carts {
    export interface NesCartMMC3 extends NES.CPU.Machine.Carts.BaseCart {
        IRQAsserted: boolean;
        InitializeCart(): void;
        MaskBankAddress(bank: number): number;
        CopyBanks(dest: number, src: number, numberOf1kBanks: number): void;
        SetByte(clock: number, address: number, val: number): void;
        SwapChrBanks(): void;
        SwapPrgRomBanks(): void;
        UpdateScanlineCounter(): void;
    }
    export interface NesCartMMC3Func extends Function {
        prototype: NesCartMMC3;
        new (): NesCartMMC3;
    }
    var NesCartMMC3: NesCartMMC3Func;

    export interface NSFCart extends NES.CPU.Machine.Carts.INESCart {
        Whizzler: NES.CPU.PPUClasses.PixelWhizzler;
        NES$CPU$Machine$Carts$INESCart$Whizzler: NES.CPU.PixelWhizzlerClasses.IPPU;
        CPU: NES.CPU.Fastendo.CPU2A03;
        IrqRaised: boolean;
        ROMHashFunction: {(prg: number[], chr: number[]): string};
        CheckSum: string;
        SRAM: number[];
        Mirroring: NES.CPU.Machine.Carts.NameTableMirroring;
        CartName: string;
        NumberOfPrgRoms: number;
        NumberOfChrRoms: number;
        MapperID: number;
        NMIHandler: {(): void};
        IRQAsserted: boolean;
        NextEventAt: number;
        ChrRamStart: number;
        PPUBankStarts: number[];
        BankSwitchesChanged: boolean;
        BankStartCache: number[];
        CurrentBank: number;
        ChrRom: number[];
        UsesSRAM: boolean;
        LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;
        InitializeCart(): void;
        UpdateScanlineCounter(): void;
        WriteState(state: System.Collections.Generic.Queue$1<number>): void;
        ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        GetByte(Clock: number, address: number): number;
        SetByte(Clock: number, address: number, data: number): void;
        UpdateBankSwitch(): void;
        HandleEvent(Clock: number): void;
        ResetClock(Clock: number): void;
        UpdateBankStartCache(): number;
        ResetBankStartCache(): void;
        GetPPUByte(clock: number, address: number): number;
        SetPPUByte(clock: number, address: number, data: number): void;
        FetchPixelEffect(vramAddress: number): number[];
        ActualChrRomOffset(address: number): number;
    }
    export interface NSFCartFunc extends Function {
        prototype: NSFCart;
        new (): NSFCart;
    }
    var NSFCart: NSFCartFunc;

    export interface BaseCart extends NES.CPU.Machine.Carts.INESCart {
        irqRaised: boolean;
        Debugging: boolean;
        DebugEvents: System.Collections.Generic.List$1<NES.CPU.Machine.Carts.CartDebugEvent>;
        ChrRom: number[];
        ChrRomCount: number;
        PrgRomCount: number;
        ROMHashFunction: {(prg: number[], chr: number[]): string};
        Whizzler: NES.CPU.PixelWhizzlerClasses.IPPU;
        IrqRaised: boolean;
        CheckSum: string;
        CPU: NES.CPU.Fastendo.CPU2A03;
        SRAM: number[];
        CartName: string;
        NumberOfPrgRoms: number;
        NumberOfChrRoms: number;
        MapperID: number;
        Mirroring: NES.CPU.Machine.Carts.NameTableMirroring;
        NMIHandler: {(): void};
        IRQAsserted: boolean;
        NextEventAt: number;
        PpuBankStarts: number[];
        BankStartCache: number[];
        CurrentBank: number;
        BankSwitchesChanged: boolean;
        OneScreenOffset: number;
        UsesSRAM: boolean;
        ChrRamStart: number;
        PPUBankStarts: number[];
        ClearDebugEvents(): void;
        LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;
        UpdateScanlineCounter(): void;
        GetByte(clock: number, address: number): number;
        SetupBankStarts(reg8: number, regA: number, regC: number, regE: number): void;
        MaskBankAddress(bank: number): number;
        WriteState(state: System.Collections.Generic.Queue$1<number>): void;
        ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        HandleEvent(Clock: number): void;
        ResetClock(Clock: number): void;
        ResetBankStartCache(): void;
        UpdateBankStartCache(): number;
        GetPPUByte(clock: number, address: number): number;
        ActualChrRomOffset(address: number): number;
        SetPPUByte(clock: number, address: number, data: number): void;
        FetchPixelEffect(vramAddress: number): number[];
        Mirror(clockNum: number, mirroring: number): void;
        InitializeCart(): void;
        SetByte(clock: number, address: number, data: number): void;
    }
    export interface BaseCartFunc extends Function {
        prototype: BaseCart;
        new (): BaseCart;
    }
    var BaseCart: BaseCartFunc;

    export enum NameTableMirroring {
        OneScreen = 0,
        Vertical = 1,
        Horizontal = 2,
        FourScreen = 3
    }

    export interface INESCart extends NES.CPU.Fastendo.IClockedMemoryMappedIOElement {
        NES$CPU$Machine$Carts$INESCart$Whizzler: NES.CPU.PixelWhizzlerClasses.IPPU;
        Whizzler: NES.CPU.PixelWhizzlerClasses.IPPU;
        NES$CPU$Machine$Carts$INESCart$CPU: NES.CPU.Fastendo.CPU2A03;
        CPU: NES.CPU.Fastendo.CPU2A03;
        NES$CPU$Machine$Carts$INESCart$ChrRom: number[];
        ChrRom: number[];
        NES$CPU$Machine$Carts$INESCart$ChrRamStart: number;
        ChrRamStart: number;
        NES$CPU$Machine$Carts$INESCart$PPUBankStarts: number[];
        PPUBankStarts: number[];
        NES$CPU$Machine$Carts$INESCart$ROMHashFunction: {(prg: number[], chr: number[]): string};
        ROMHashFunction: {(prg: number[], chr: number[]): string};
        NES$CPU$Machine$Carts$INESCart$CheckSum: string;
        CheckSum: string;
        NES$CPU$Machine$Carts$INESCart$SRAM: number[];
        SRAM: number[];
        NES$CPU$Machine$Carts$INESCart$Mirroring: NES.CPU.Machine.Carts.NameTableMirroring;
        Mirroring: NES.CPU.Machine.Carts.NameTableMirroring;
        NES$CPU$Machine$Carts$INESCart$CartName: string;
        CartName: string;
        NES$CPU$Machine$Carts$INESCart$NumberOfPrgRoms: number;
        NumberOfPrgRoms: number;
        NES$CPU$Machine$Carts$INESCart$NumberOfChrRoms: number;
        NumberOfChrRoms: number;
        NES$CPU$Machine$Carts$INESCart$MapperID: number;
        MapperID: number;
        /**
         * Used for bankswitching
         *
         * @instance
         * @abstract
         * @public
         * @memberof NES.CPU.Machine.Carts.INESCart
         * @function NES$CPU$Machine$Carts$INESCart$BankSwitchesChanged
         * @type boolean
         */
        NES$CPU$Machine$Carts$INESCart$BankSwitchesChanged: boolean;
        BankSwitchesChanged: boolean;
        NES$CPU$Machine$Carts$INESCart$BankStartCache: number[];
        BankStartCache: number[];
        NES$CPU$Machine$Carts$INESCart$CurrentBank: number;
        CurrentBank: number;
        NES$CPU$Machine$Carts$INESCart$UsesSRAM: boolean;
        UsesSRAM: boolean;
        NES$CPU$Machine$Carts$INESCart$LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;
        LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;
        NES$CPU$Machine$Carts$INESCart$InitializeCart(): void;
        InitializeCart(): void;
        NES$CPU$Machine$Carts$INESCart$UpdateScanlineCounter(): void;
        UpdateScanlineCounter(): void;
        NES$CPU$Machine$Carts$INESCart$WriteState(state: System.Collections.Generic.Queue$1<number>): void;
        WriteState(state: System.Collections.Generic.Queue$1<number>): void;
        NES$CPU$Machine$Carts$INESCart$ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        NES$CPU$Machine$Carts$INESCart$GetPPUByte(clock: number, address: number): number;
        GetPPUByte(clock: number, address: number): number;
        NES$CPU$Machine$Carts$INESCart$SetPPUByte(clock: number, address: number, data: number): void;
        SetPPUByte(clock: number, address: number, data: number): void;
        NES$CPU$Machine$Carts$INESCart$FetchPixelEffect(vramAddress: number): number[];
        FetchPixelEffect(vramAddress: number): number[];
        NES$CPU$Machine$Carts$INESCart$ActualChrRomOffset(address: number): number;
        ActualChrRomOffset(address: number): number;
        NES$CPU$Machine$Carts$INESCart$UpdateBankStartCache(): number;
        UpdateBankStartCache(): number;
        NES$CPU$Machine$Carts$INESCart$ResetBankStartCache(): void;
        ResetBankStartCache(): void;
    }

    export interface CartDebugEvent {
        Clock: number;
        EventType: string;
        toString(): string;
    }
    export interface CartDebugEventFunc extends Function {
        prototype: CartDebugEvent;
        new (): CartDebugEvent;
    }
    var CartDebugEvent: CartDebugEventFunc;

    export interface NesCartMMC1 extends NES.CPU.Machine.Carts.BaseCart {
        InitializeCart(): void;
        MaskBankAddress$1(bank: number): number;
        CopyBanks(dest: number, src: number, numberOf4kBanks: number): void;
        SetByte(clock: number, address: number, val: number): void;
        SetMMC1ChrBanking(clock: number): void;
        SetMMC1PrgBanking(): void;
        SetMMC1Mirroring(clock: number): void;
    }
    export interface NesCartMMC1Func extends Function {
        prototype: NesCartMMC1;
        new (): NesCartMMC1;
    }
    var NesCartMMC1: NesCartMMC1Func;

}

declare module NES.CPU.Machine.PortQueueing {
    export interface PortWriteEntry {
        time: number;
        address: number;
        data: number;
    }
    export interface PortWriteEntryFunc extends Function {
        prototype: PortWriteEntry;
        new (time: number, address: number, data: number): PortWriteEntry;
    }
    var PortWriteEntry: PortWriteEntryFunc;

    export interface QueuedPort extends System.Collections.Generic.Queue$1<NES.CPU.Machine.PortQueueing.PortWriteEntry> {
    }
    export interface QueuedPortFunc extends Function {
        prototype: QueuedPort;
        new (): QueuedPort;
    }
    var QueuedPort: QueuedPortFunc;

}

declare module NES.CPU.Machine.ROMLoader {
    export interface CartLoadException extends System.Exception {
    }
    export interface CartLoadExceptionFunc extends Function {
        prototype: CartLoadException;
        $ctor1: {
            new (message: string, innerException: System.Exception): CartLoadException
        };
        ctor: {
            new (message: string): CartLoadException
        };
    }
    var CartLoadException: CartLoadExceptionFunc;

    export interface iNESFileHandler {
    }
    export interface iNESFileHandlerFunc extends Function {
        prototype: iNESFileHandler;
        new (): iNESFileHandler;
        LoadROM(ppu: NES.CPU.PixelWhizzlerClasses.IPPU, thefile: number[]): NES.CPU.Machine.Carts.INESCart;
    }
    var iNESFileHandler: iNESFileHandlerFunc;

}

declare module NES.CPU.nitenedo {
    export interface NESMachine extends System.IDisposable {
        addSoundStatusChanged(value: {(sender: any, e: NES.CPU.Machine.BeepsBoops.SoundStatusChangeEventArgs): void}): void;
        removeSoundStatusChanged(value: {(sender: any, e: NES.CPU.Machine.BeepsBoops.SoundStatusChangeEventArgs): void}): void;
        addDrawscreen(value: {(sender: any, e: System.Object): void}): void;
        removeDrawscreen(value: {(sender: any, e: System.Object): void}): void;
        CurrentCartName: string;
        RunState: NES.Machine.ControlPanel.RunningStatuses;
        CurrentSaveSlot: number;
        Cpu: NES.CPU.Fastendo.CPU2A03;
        Cart: NES.CPU.Machine.Carts.INESCart;
        SoundBopper: NES.CPU.Machine.BeepsBoops.Bopper;
        WaveForms: NES.CPU.Machine.BeepsBoops.IWavReader;
        EnableSound: boolean;
        Tiler: NES.CPU.PPUClasses.TileDoodler;
        FrameCount: number;
        IsRunning: boolean;
        PPU: NES.CPU.PixelWhizzlerClasses.IPPU;
        PadOne: NES.CPU.Machine.IControlPad;
        PadTwo: NES.CPU.Machine.IControlPad;
        SRAMReader: {(RomID: string): number[]};
        SRAMWriter: {(RomID: string, SRAM: number[]): void};
        Initialize(): void;
        Reset(): void;
        PowerOn(): void;
        PowerOff(): void;
        EjectCart(): void;
        LoadCart(rom: number[]): void;
        GoTendo_NoThread(fileName: string): void;
        GoTendo(fileName: string): void;
        HasState(index: number): boolean;
        GetState(index: number): void;
        SetState(index: number): void;
        ClearGenieCodes(): void;
        AddGameGenieCode(code: string, patch: {v: NES.CPU.Fastendo.Hacking.IMemoryPatch}): boolean;
        WriteWAVToFile(writer: NES.CPU.Machine.BeepsBoops.IWavWriter): void;
        StopWritingWAV(): void;
        SetupSound(): void;
        Runtendo(): void;
        dispose(): void;
        /**
         * runs a "step", either a pending non-maskable interrupt, maskable interupt, or a sprite DMA transfer,
          or a regular machine cycle, then runs the appropriate number of PPU clocks based on CPU action
          ppuclocks = cpuclocks * 3
         note: this approach relies on very precise cpu timing
         *
         * @instance
         * @public
         * @this NES.CPU.nitenedo.NESMachine
         * @memberof NES.CPU.nitenedo.NESMachine
         * @return  {void}
         */
        Step(): void;
        RunFrame(): void;
        FrameFinished(): void;
    }
    export interface NESMachineFunc extends Function {
        prototype: NESMachine;
        new (cpu: NES.CPU.Fastendo.CPU2A03, ppu: NES.CPU.PixelWhizzlerClasses.IPPU, tiler: NES.CPU.PPUClasses.TileDoodler, wavSharer: NES.CPU.Machine.BeepsBoops.WavSharer, soundBopper: NES.CPU.Machine.BeepsBoops.Bopper, soundThread: NES.Sound.SoundThreader): NESMachine;
    }
    var NESMachine: NESMachineFunc;

    export interface InputHandler extends NES.CPU.Fastendo.IClockedMemoryMappedIOElement {
        IsZapper: boolean;
        ControlPad: NES.CPU.Machine.IControlPad;
        CurrentByte: number;
        NMIHandler: {(): void};
        IRQAsserted: boolean;
        NextEventAt: number;
        controlPad_NextControlByteSet(sender: any, e: NES.CPU.Machine.ControlByteEventArgs): void;
        GetByte(clock: number, address: number): number;
        SetByte(clock: number, address: number, data: number): void;
        SetNextControlByte(data: number): void;
        HandleEvent(Clock: number): void;
        ResetClock(Clock: number): void;
    }
    export interface InputHandlerFunc extends Function {
        prototype: InputHandler;
        new (): InputHandler;
        ctor: {
            new (): InputHandler
        };
        $ctor1: {
            new (padOne: NES.CPU.Machine.IControlPad): InputHandler
        };
    }
    var InputHandler: InputHandlerFunc;

}

declare module NES.CPU.nitenedo.Interaction {
    export enum NESPixelFormats {
        RGB = 0,
        BGR = 1,
        Indexed = 2
    }

    export interface NESDisplayPluginAttribute extends System.Attribute {
    }
    export interface NESDisplayPluginAttributeFunc extends Function {
        prototype: NESDisplayPluginAttribute;
        new (): NESDisplayPluginAttribute;
    }
    var NESDisplayPluginAttribute: NESDisplayPluginAttributeFunc;

    export interface InvalidDisplayContextException extends System.Exception {
    }
    export interface InvalidDisplayContextExceptionFunc extends Function {
        prototype: InvalidDisplayContextException;
        ctor: {
            new (s: string): InvalidDisplayContextException
        };
        $ctor1: {
            new (s: string, innerException: System.Exception): InvalidDisplayContextException
        };
    }
    var InvalidDisplayContextException: InvalidDisplayContextExceptionFunc;

    export enum CallbackType {
        None = 0,
        NoArgs = 1,
        Array = 2,
        IntPtr = 3
    }

    /** @namespace NES.CPU.nitenedo.Interaction */

    /**
     * Defines what the main windows interaction with the current renderer
     *
     * @abstract
     * @public
     * @class NES.CPU.nitenedo.Interaction.IDisplayContext
     */
    export interface IDisplayContext {
        NES$CPU$nitenedo$Interaction$IDisplayContext$AttachedMachine: NES.CPU.nitenedo.NESMachine;
        AttachedMachine: NES.CPU.nitenedo.NESMachine;
        NES$CPU$nitenedo$Interaction$IDisplayContext$DesiredCallback: NES.CPU.nitenedo.Interaction.CallbackType;
        DesiredCallback: NES.CPU.nitenedo.Interaction.CallbackType;
        NES$CPU$nitenedo$Interaction$IDisplayContext$PixelWidth: number;
        PixelWidth: number;
        NES$CPU$nitenedo$Interaction$IDisplayContext$PixelFormat: NES.CPU.nitenedo.Interaction.NESPixelFormats;
        PixelFormat: NES.CPU.nitenedo.Interaction.NESPixelFormats;
        NES$CPU$nitenedo$Interaction$IDisplayContext$UIControl: any;
        UIControl: any;
        NES$CPU$nitenedo$Interaction$IDisplayContext$PropertiesPanel: any;
        PropertiesPanel: any;
        NES$CPU$nitenedo$Interaction$IDisplayContext$DisplayName: string;
        DisplayName: string;
        NES$CPU$nitenedo$Interaction$IDisplayContext$CreateDisplay(): void;
        CreateDisplay(): void;
        NES$CPU$nitenedo$Interaction$IDisplayContext$TearDownDisplay(): void;
        TearDownDisplay(): void;
        NES$CPU$nitenedo$Interaction$IDisplayContext$DrawDefaultDisplay(): void;
        DrawDefaultDisplay(): void;
        NES$CPU$nitenedo$Interaction$IDisplayContext$ToggleFullScreen(): void;
        ToggleFullScreen(): void;
        NES$CPU$nitenedo$Interaction$IDisplayContext$SetPausedState(state: boolean): void;
        SetPausedState(state: boolean): void;
    }

}

declare module NES.CPU.PixelWhizzlerClasses {
    export interface IPPU {
        NES$CPU$PixelWhizzlerClasses$IPPU$ChrRomHandler: NES.CPU.Machine.Carts.INESCart;
        ChrRomHandler: NES.CPU.Machine.Carts.INESCart;
        NES$CPU$PixelWhizzlerClasses$IPPU$CurrentFrame: number[];
        CurrentFrame: number[];
        NES$CPU$PixelWhizzlerClasses$IPPU$FrameFinishHandler: {(): void};
        FrameFinishHandler: {(): void};
        NES$CPU$PixelWhizzlerClasses$IPPU$HScroll: number;
        HScroll: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$LastcpuClock: number;
        LastcpuClock: number;
        /**
         * @instance
         * @abstract
         * @public
         * @memberof NES.CPU.PixelWhizzlerClasses.IPPU
         * @function NES$CPU$PixelWhizzlerClasses$IPPU$NameTableMemoryStart
         * @type number
         */
        NES$CPU$PixelWhizzlerClasses$IPPU$NameTableMemoryStart: number;
        NameTableMemoryStart: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$NextEventAt: number;
        NextEventAt: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$NMIHandler: {(): void};
        NMIHandler: {(): void};
        NES$CPU$PixelWhizzlerClasses$IPPU$Palette: number[];
        Palette: number[];
        NES$CPU$PixelWhizzlerClasses$IPPU$PatternTableIndex: number;
        PatternTableIndex: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$PPUControlByte0: number;
        PPUControlByte0: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$PPUControlByte1: number;
        PPUControlByte1: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$ScanlineNum: number;
        ScanlineNum: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$ScanlinePos: number;
        ScanlinePos: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$SpriteRam: number[];
        SpriteRam: number[];
        NES$CPU$PixelWhizzlerClasses$IPPU$SpritesAreVisible: boolean;
        SpritesAreVisible: boolean;
        NES$CPU$PixelWhizzlerClasses$IPPU$SpritesOnLine: number[];
        SpritesOnLine: number[];
        NES$CPU$PixelWhizzlerClasses$IPPU$VideoBuffer: number[];
        VideoBuffer: any;
        NES$CPU$PixelWhizzlerClasses$IPPU$ByteOutBuffer: number[];
        ByteOutBuffer: any;
        NES$CPU$PixelWhizzlerClasses$IPPU$VScroll: number;
        VScroll: number;
        NES$CPU$PixelWhizzlerClasses$IPPU$PixelAwareDevice: NES.CPU.Machine.IPixelAwareDevice;
        PixelAwareDevice: NES.CPU.Machine.IPixelAwareDevice;
        NES$CPU$PixelWhizzlerClasses$IPPU$UpdatePixelInfo(): void;
        UpdatePixelInfo(): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$CopySprites(source: {v: number[]}, copyFrom: number): void;
        CopySprites(source: {v: number[]}, copyFrom: number): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$DrawTo(cpuClockNum: number): void;
        DrawTo(cpuClockNum: number): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$GetByte(Clock: number, address: number): number;
        GetByte(Clock: number, address: number): number;
        NES$CPU$PixelWhizzlerClasses$IPPU$HandleEvent(Clock: number): void;
        HandleEvent(Clock: number): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$Initialize(): void;
        Initialize(): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$PreloadSprites(scanline: number): void;
        PreloadSprites(scanline: number): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$RenderScanline(scanlineNum: number): void;
        RenderScanline(scanlineNum: number): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$ResetClock(Clock: number): void;
        ResetClock(Clock: number): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$SetByte(Clock: number, address: number, data: number): void;
        SetByte(Clock: number, address: number, data: number): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$SetupBufferForDisplay(buffer: {v: number[]}): void;
        SetupBufferForDisplay(buffer: {v: number[]}): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$SetupVINT(): void;
        SetupVINT(): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$SetVideoBuffer(inBuffer: number[]): void;
        SetVideoBuffer(inBuffer: any): void;
        NES$CPU$PixelWhizzlerClasses$IPPU$VidRAM_GetNTByte(address: number): number;
        VidRAM_GetNTByte(address: number): number;
        NES$CPU$PixelWhizzlerClasses$IPPU$WriteState(writer: System.Collections.Generic.Queue$1<number>): void;
        WriteState(writer: System.Collections.Generic.Queue$1<number>): void;
    }

}

declare module NES.CPU.PPUClasses {
    export interface TileDoodler {
        XOffset: number;
        YOffset: number;
        GetPatternTableEntry(PatternTable: number, TileIndex: number, attributeByte: number, actualAddress: {v: number[]}): number[];
        GetSprite(PatternTable: number, TileIndex: number, attributeByte: number, flipX: boolean, flipY: boolean): number[];
        TryGetSprite(result: number[], PatternTable: number, TileIndex: number, attributeByte: number, flipX: boolean, flipY: boolean): boolean;
        /**
         * Gets a 1x8 line from a particular pattern table
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.TileDoodler
         * @memberof NES.CPU.PPUClasses.TileDoodler
         * @param   {System.Int32}    result           
         * @param   {number}          startPosition    
         * @param   {number}          LineNumber       
         * @param   {number}          PatternTable     
         * @param   {number}          TileIndex        
         * @param   {number}          attributeByte
         * @return  {void}
         */
        GetPatternTableLine(result: {v: number[]}, startPosition: number, LineNumber: number, PatternTable: number, TileIndex: number, attributeByte: number): void;
        DrawRect(newData: number[], width: number, height: number, xPos: number, yPos: number): void;
        MergeRect(newData: number[], width: number, height: number, xPos: number, yPos: number, inFront: boolean): void;
        MergeRectBehind(newData: number[], width: number, height: number, xPos: number, yPos: number): void;
        DrawAllTiles(): void;
        GetAttributeTableEntry(ppuNameTableMemoryStart: number, i: number, j: number): number;
        /**
         * Returns a pixel
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.TileDoodler
         * @memberof NES.CPU.PPUClasses.TileDoodler
         * @param   {number}    xPosition    X position of pixel (0 to 255)
         * @param   {number}    yPosition    Y position of pixel (0 to 239)
         * @return  {number}
         */
        GetNameTablePixel(xPosition: number, yPosition: number): number;
        SpriteZeroHit(xPosition: number, yPosition: number): boolean;
        DrawSprite(spriteNum: number): void;
        DrawAllSprites(): void;
        /**
         * returns a 128x128 buffer for the tiles
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.TileDoodler
         * @memberof NES.CPU.PPUClasses.TileDoodler
         * @param   {number}            PatternTable
         * @return  {Array.<number>}
         */
        DoodlePatternTable(PatternTable: number): number[];
        /**
         * returns a pixel array representing a current nametable in memory
         nametable will be 0,0x400, 0x800, 0xC00, mapped to 0x200 + Nametable
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.TileDoodler
         * @memberof NES.CPU.PPUClasses.TileDoodler
         * @param   {number}            NameTable
         * @return  {Array.<number>}
         */
        DoodleNameTable(NameTable: number): number[];
        DrawTile(destBuffer: {v: number[]}, width: number, height: number, tile: number[], xPos: number, yPos: number): void;
        GetNameTableEntryLocation(x: number, y: number): number;
        GetPatternEntryLocation(table: number, x: number, y: number): number;
    }
    export interface TileDoodlerFunc extends Function {
        prototype: TileDoodler;
        new (ppu: NES.CPU.PixelWhizzlerClasses.IPPU): TileDoodler;
    }
    var TileDoodler: TileDoodlerFunc;

    export interface PPUWriteEvent extends System.ComponentModel.INotifyPropertyChanged {
        addPropertyChanged(value: {(sender: any, e: System.ComponentModel.PropertyChangedEventArgs): void}): void;
        removePropertyChanged(value: {(sender: any, e: System.ComponentModel.PropertyChangedEventArgs): void}): void;
        IsWrite: boolean;
        ScanlineNum: number;
        ScanlinePos: number;
        FrameClock: number;
        RegisterAffected: number;
        DataWritten: number;
        Text: string;
        toString(): string;
    }
    export interface PPUWriteEventFunc extends Function {
        prototype: PPUWriteEvent;
        new (): PPUWriteEvent;
    }
    var PPUWriteEvent: PPUWriteEventFunc;

    export interface NESSprite {
        YPosition: number;
        XPosition: number;
        SpriteNumber: number;
        Foreground: boolean;
        IsVisible: boolean;
        TileIndex: number;
        AttributeByte: number;
        FlipX: boolean;
        FlipY: boolean;
        Changed: boolean;
        getHashCode(): NES.CPU.PPUClasses.NESSprite;
        equals(o: NES.CPU.PPUClasses.NESSprite): Boolean;
        $clone(to: NES.CPU.PPUClasses.NESSprite): NES.CPU.PPUClasses.NESSprite;
    }
    export interface NESSpriteFunc extends Function {
        prototype: NESSprite;
        new (): NESSprite;
    }
    var NESSprite: NESSpriteFunc;

    export interface PixelWhizzler extends NES.CPU.PixelWhizzlerClasses.IPPU,NES.CPU.Fastendo.IClockedMemoryMappedIOElement {
        frameClock: number;
        FrameEnded: boolean;
        CurrentYPosition: number;
        CurrentXPosition: number;
        ScanlinePos: number;
        ScanlineNum: number;
        IsDebugging: boolean;
        ShouldRender: boolean;
        Frames: number;
        HandleVBlankIRQ: boolean;
        VROM: number[];
        PPUControlByte0: number;
        NMIIsThrown: boolean;
        PPUControlByte1: number;
        BackgroundVisible: boolean;
        SpritesAreVisible: boolean;
        PPUStatus: number;
        PPUAddress: number;
        PatternTableIndex: number;
        NeedToDraw: boolean;
        IsRendering: boolean;
        FrameOn: boolean;
        NameTableMemoryStart: number;
        CurrentFrame: number[];
        LastcpuClock: number;
        OutBuffer: number[];
        VideoBuffer: number[];
        PixelWidth: number;
        FillRGB: boolean;
        PixelAwareDevice: NES.CPU.Machine.IPixelAwareDevice;
        ByteOutBuffer: number[];
        Palette: number[];
        PalCache: number[][];
        CurrentPalette: number;
        NMIHandler: {(): void};
        /**
         * ppu doesnt throw irq's
         *
         * @instance
         * @public
         * @memberof NES.CPU.PPUClasses.PixelWhizzler
         * @function IRQAsserted
         * @type boolean
         */
        IRQAsserted: boolean;
        NextEventAt: number;
        FrameFinishHandler: {(): void};
        NMIOccurred: boolean;
        HScroll: number;
        VScroll: number;
        SpriteCopyHasHappened: boolean;
        MaxSpritesPerScanline: number;
        SpriteRam: number[];
        SpritesOnLine: number[];
        ChrRomHandler: NES.CPU.Machine.Carts.INESCart;
        Events: System.Collections.Generic.Queue$1<NES.CPU.PPUClasses.PPUWriteEvent>;
        Initialize(): void;
        WriteState(writer: System.Collections.Generic.Queue$1<number>): void;
        ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        VidRAM_GetNTByte(address: number): number;
        UpdatePPUControlByte0(): void;
        /**
         * Fills an external buffer with rgb color values, relative to current state of PPU's pallete ram
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.PixelWhizzler
         * @memberof NES.CPU.PPUClasses.PixelWhizzler
         * @param   {System.Int32}    buffer
         * @return  {void}
         */
        SetupBufferForDisplay(buffer: {v: number[]}): void;
        RenderScanline(scanlineNum: number): void;
        /**
         * draws from the lastcpuClock to the current one
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.PixelWhizzler
         * @memberof NES.CPU.PPUClasses.PixelWhizzler
         * @param   {number}    cpuClockNum
         * @return  {void}
         */
        DrawTo(cpuClockNum: number): void;
        BumpScanline(): void;
        UpdateXPosition(): void;
        FillBuffer(): void;
        SetVideoBuffer(inBuffer: number[]): void;
        /**
         * Checks if NMI needs to be reasserted during vblank
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.PixelWhizzler
         * @memberof NES.CPU.PPUClasses.PixelWhizzler
         * @return  {void}
         */
        CheckVBlank(): void;
        DrawPixel(): void;
        UpdatePixelInfo(): void;
        ClippingTilePixels(): boolean;
        ClippingSpritePixels(): boolean;
        SetByte(Clock: number, address: number, data: number): void;
        GetByte(Clock: number, address: number): number;
        ClearNESPalette(): void;
        WriteToNESPalette(address: number, data: number): void;
        HandleEvent(Clock: number): void;
        ResetClock(Clock: number): void;
        SetupVINT(): void;
        ClearVINT(): void;
        RunEndOfScanlineRenderEvents(): void;
        RunNewScanlineEvents(): void;
        UpdateSprites(): void;
        UpdateTiles(): void;
        CopySprites(source: {v: number[]}, copyFrom: number): void;
        InitSprites(): void;
        GetSpritePixel(isForegroundPixel: {v: boolean}): number;
        WhissaSpritePixel(patternTableIndex: number, x: number, y: number, sprite: NES.CPU.PPUClasses.NESSprite, tileIndex: number): number;
        /**
         * populates the currentSpritesXXX arrays with the first 8 visible sprites on the 
         denoted scanline.
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.PixelWhizzler
         * @memberof NES.CPU.PPUClasses.PixelWhizzler
         * @param   {number}    scanline    the scanline to preload sprites for
         * @return  {void}
         */
        PreloadSprites(scanline: number): void;
        UnpackSprites(): void;
        UnpackSprite(currSprite: number): void;
        /**
         * Returns a pixel
         *
         * @instance
         * @public
         * @this NES.CPU.PPUClasses.PixelWhizzler
         * @memberof NES.CPU.PPUClasses.PixelWhizzler
         * @return  {number}
         */
        GetNameTablePixel(): number;
        FetchNextTile(): void;
        GetNameTablePixelOld(): number;
        GetAttributeTableEntry(ppuNameTableMemoryStart: number, i: number, j: number): number;
    }
    export interface PixelWhizzlerFunc extends Function {
        prototype: PixelWhizzler;
        new (): PixelWhizzler;
        pal: number[];
        frameClockEnd: number;
        PowersOfTwo: number[];
        
        GetPalRGBA(): number[];
    }
    var PixelWhizzler: PixelWhizzlerFunc;

}

declare module NES.Machine.ControlPanel {
    export enum RunningStatuses {
        Unloaded = 0,
        Off = 1,
        Running = 2,
        Frozen = 3,
        Paused = 4
    }

}

declare module NES.Sound {
    export interface IWavStreamer extends System.IDisposable {
        NES$Sound$IWavStreamer$Muted: boolean;
        Muted: boolean;
        NES$Sound$IWavStreamer$Volume: number;
        Volume: number;
        NES$Sound$IWavStreamer$playPCM(): void;
        playPCM(): void;
        NES$Sound$IWavStreamer$checkSamples(): void;
        checkSamples(): void;
    }

    export interface SoundThreader extends System.IDisposable {
        WavePlayer: NES.Sound.IWavStreamer;
        OnSoundStatusChanged(sender: any, e: NES.CPU.Machine.BeepsBoops.SoundStatusChangeEventArgs): void;
        PlaySound(o: any): void;
        dispose(): void;
    }
    export interface SoundThreaderFunc extends Function {
        prototype: SoundThreader;
        new (streamer: NES.Sound.IWavStreamer): SoundThreader;
    }
    var SoundThreader: SoundThreaderFunc;
}
