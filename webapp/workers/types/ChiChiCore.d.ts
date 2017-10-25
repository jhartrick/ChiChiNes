﻿
declare module ChiChiNES {
    export interface AddressingModes {
    }
    export interface AddressingModesFunc extends Function {
        prototype: AddressingModes;
        new (): AddressingModes;
        Bullshit: number;
        Implicit: number;
        Accumulator: number;
        Immediate: number;
        ZeroPage: number;
        ZeroPageX: number;
        ZeroPageY: number;
        Relative: number;
        Absolute: number;
        AbsoluteX: number;
        AbsoluteY: number;
        Indirect: number;
        IndexedIndirect: number;
        IndirectIndexed: number;
        IndirectZeroPage: number;
        IndirectAbsoluteX: number;
    }
    var AddressingModes: AddressingModesFunc;

    export interface BaseCart  {
        irqRaised: boolean;
        Debugging: boolean;
        DebugEvents: any;
        //ChrRom: any;
        //ChrRomCount: number;
        //PrgRomCount: number;
        ROMHashFunction: {(prg: any, chr: any): string};
        Whizzler: ChiChiNES.CPU2A03;
        IrqRaised: boolean;
        CheckSum: string;
        CPU: ChiChiNES.CPU2A03;
        SRAM: any;
        CartName: string;
        NumberOfPrgRoms: number;
        NumberOfChrRoms: number;
        MapperID: number;
        Mirroring: ChiChiNES.NameTableMirroring;
        NMIHandler: {(): void};
        //IRQAsserted: boolean;
        //NextEventAt: number;
        //PpuBankStarts: any;
        //BankStartCache: any;
        CurrentBank: number;
        //BankSwitchesChanged: boolean;
       // OneScreenOffset: number;
        UsesSRAM: boolean;
        //ChrRamStart: number;
        //PPUBankStarts: any;
        ClearDebugEvents(): void;
        LoadiNESCart(header: any, prgRoms: number, chrRoms: number, prgRomData: any, chrRomData: any, chrRomOffset: number): void;
        UpdateScanlineCounter(): void;
        GetByte(clock: number, address: number): number;
        SetupBankStarts(reg8: number, regA: number, regC: number, regE: number): void;
        MaskBankAddress(bank: number): number;
        WriteState(state: any): void;
        ReadState(state: any): void;
        HandleEvent(Clock: number): void;
        ResetClock(Clock: number): void;
        ResetBankStartCache(): void;
        UpdateBankStartCache(): number;
        GetPPUByte(clock: number, address: number): number;
        ActualChrRomOffset(address: number): number;
        SetPPUByte(clock: number, address: number, data: number): void;
        Mirror(clockNum: number, mirroring: number): void;
        InitializeCart(): void;
        SetByte(clock: number, address: number, data: number): void;
    }
    export interface BaseCartFunc extends Function {
        prototype: BaseCart;
        new (): BaseCart;
    }
    var BaseCart: BaseCartFunc;

    /** @namespace ChiChiNES */

    /**
     * plugs up a nes control port, when nothing else is using it
     *
     * @public
     * @class ChiChiNES.NullControlPad
     * @implements  ChiChiNES.IControlPad
     */
    export interface NullControlPad extends ChiChiNES.IControlPad {
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

    export interface InputHandler  {
        ControlPad: ChiChiNES.IControlPad
        CurrentByte: number;
        GetByte(clock: number, address: number): number;
        SetByte(clock: number, address: number, data: number): void;
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
            new (padOne: ChiChiNES.IControlPad): InputHandler
        };
    }
    var InputHandler: InputHandlerFunc;

    export interface INESCart  {
        Whizzler: ChiChiNES.CPU2A03;
        CPU: ChiChiNES.CPU2A03;
        ChrRom: any;
        ChrRamStart: number;
        PPUBankStarts: any;
        ROMHashFunction: {(prg: any, chr: any): string};
        CheckSum: string;
        SRAM: any;
        Mirroring: ChiChiNES.NameTableMirroring;
        CartName: string;
        NumberOfPrgRoms: number;
        NumberOfChrRoms: number;
        MapperID: number;
        BankSwitchesChanged: boolean;
        BankStartCache: any;
        CurrentBank: number;
        UsesSRAM: boolean;
        LoadiNESCart(header: any, prgRoms: number, chrRoms: number, prgRomData: any, chrRomData: any, chrRomOffset: number): void;
        InitializeCart(): void;
        UpdateScanlineCounter(): void;
        WriteState(state: any): void;
        ReadState(state: any): void;
        GetByte(clock: number, address: number): number;
        SetByte(clock: number, address: number, data: number): void;
        GetPPUByte(clock: number, address: number): number;
        SetPPUByte(clock: number, address: number, data: number): void;
        ActualChrRomOffset(address: number): number;
        UpdateBankStartCache(): number;
        ResetBankStartCache(): void;
    }

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
    }
    export interface NESSpriteFunc extends Function {
        prototype: NESSprite;
        new (): NESSprite;
    }
    var NESSprite: NESSpriteFunc;

    export interface NESMachine  {
        Drawscreen(): void;
        RunState: ChiChiNES.Machine.ControlPanel.RunningStatuses;
        Cpu: ChiChiNES.CPU2A03;
        Cart: ChiChiNES.INESCart;
        SoundBopper: ChiChiNES.BeepsBoops.Bopper;
        WaveForms: any;
        EnableSound: boolean;
        FrameCount: number;
        IsRunning: boolean;
        PadOne: ChiChiNES.IControlPad;
        PadTwo: ChiChiNES.IControlPad;
        SRAMReader: {(RomID: string): any};
        SRAMWriter: {(RomID: string, SRAM: any): void};
        Reset(): void;
        PowerOn(): void;
        PowerOff(): void;
        Step(): void;
        RunFrame(): void;

        EjectCart(): void;
        LoadCart(rom: any): void;
        HasState(index: number): boolean;
        GetState(index: number): void;
        SetState(index: number): void;
        SetupSound(): void;
        FrameFinished(): void;
    }

    export interface NESMachineFunc extends Function {
        prototype: NESMachine;
        new (cpu: ChiChiNES.CPU2A03, wavSharer: ChiChiNES.BeepsBoops.WavSharer, soundBopper: ChiChiNES.BeepsBoops.Bopper): NESMachine;
    }
    var NESMachine: NESMachineFunc;

    export enum NameTableMirroring {
        OneScreen = 0,
        Vertical = 1,
        Horizontal = 2,
        FourScreen = 3
    }


    export interface NesCartMMC1 extends ChiChiNES.BaseCart {
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

    export interface IMemoryMappedIOElement {
        ChiChiNES$IMemoryMappedIOElement$GetByte(address: number): number;
        GetByte(address: number): number;
        ChiChiNES$IMemoryMappedIOElement$SetByte(address: number, data: number): void;
        SetByte(address: number, data: number): void;
    }

    export interface IControlPad {
        CurrentByte: number;
        refresh(): void;
        padOneState: number;
        getByte(clock: number): number;
        setByte(clock: number, data: number): void;
    }

    export interface CPUStatusMasks {
    }
    export interface CPUStatusMasksFunc extends Function {
        prototype: CPUStatusMasks;
        new (): CPUStatusMasks;
        CarryMask: number;
        ZeroResultMask: number;
        InterruptDisableMask: number;
        DecimalModeMask: number;
        BreakCommandMask: number;
        ExpansionMask: number;
        OverflowMask: number;
        NegativeResultMask: number;
    }
    var CPUStatusMasks: CPUStatusMasksFunc;

    export interface CPUStatusBits {
    }
    export interface CPUStatusBitsFunc extends Function {
        prototype: CPUStatusBits;
        new (): CPUStatusBits;
        Carry: number;
        ZeroResult: number;
        InterruptDisable: number;
        DecimalMode: number;
        BreakCommand: number;
        Expansion: number;
        Overflow: number;
        NegativeResult: number;
    }
    var CPUStatusBits: CPUStatusBitsFunc;

    export interface NesCartMMC3 extends ChiChiNES.BaseCart {
        //IRQAsserted: boolean;
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

    export interface IClockedMemoryMappedIOElement {
        ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler: {(): void};
        NMIHandler: {(): void};
        ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted: boolean;
        IRQAsserted: boolean;
        ChiChiNES$IClockedMemoryMappedIOElement$NextEventAt: number;
        NextEventAt: number;
        ChiChiNES$IClockedMemoryMappedIOElement$GetByte(Clock: number, address: number): number;
        GetByte(Clock: number, address: number): number;
        ChiChiNES$IClockedMemoryMappedIOElement$SetByte(Clock: number, address: number, data: number): void;
        SetByte(Clock: number, address: number, data: number): void;
        ChiChiNES$IClockedMemoryMappedIOElement$HandleEvent(Clock: number): void;
        HandleEvent(Clock: number): void;
        ChiChiNES$IClockedMemoryMappedIOElement$ResetClock(Clock: number): void;
        ResetClock(Clock: number): void;
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

    export interface CPU2A03 {
        //addressmode: any;
        //frameClock: number;
        //FrameEnded: boolean;
        Clock: number;
        frameFinished: () => void;
        byteOutBuffer: Uint8Array;

        //Accumulator: number;
        //IndexRegisterY: number;
        //IndexRegisterX: number;
        //ProgramCounter: number;
        //StatusRegister: number;
        //AddressCodePage: number;
        //AddressLowByte: number;
        //AddressBus: number;
        //DataBus: number;
        //MemoryLock: boolean;
        //ReadWrite: boolean;
        //Ready: boolean;
        //Reset: boolean;
        /**
         * read only access to the current instruction pointed to by the program counter
         *
         * @instance
         * @public
         * @readonly
         * @memberof ChiChiNES.CPU2A03
         * @function CurrentInstruction
         * @type ChiChiNES.CPU2A03.Instruction
         */
        CurrentInstruction: ChiChiNES.CPU2A03.Instruction;
        /**
         * number of full clock ticks elapsed since emulation started
         *
         * @instance
         * @public
         * @memberof ChiChiNES.CPU2A03
         * @function Ticks
         * @type number
         */
        //Cheating: boolean;
        SoundBopper: ChiChiNES.BeepsBoops.Bopper;
        PadOne: ChiChiNES.InputHandler;
        PadTwo: ChiChiNES.InputHandler;
        Cart: ChiChiNES.IClockedMemoryMappedIOElement;
       // StackPointer: number;
        Debugging: boolean;
        //InstructionUsage: any;
        InstructionHistoryPointer: number;
        InstructionHistory: ChiChiNES.CPU2A03.Instruction[];
        //PPU_HScroll: number;
        //PPU_VScroll: number;
        //PPU_CurrentYPosition: number;
        //PPU_CurrentXPosition: number;
        //PPU_ScanlinePos: number;
        //PPU_ScanlineNum: number;
        //PPU_IsDebugging: boolean;
        //NMIOccurred: boolean;
        //PPU_ShouldRender: boolean;
        //PPU_HandleVBlankIRQ: boolean;
        //VROM: any;
        //PPU_PPUControlByte0: number;
        //PPU_NMIIsThrown: boolean;
        //PPU_PPUControlByte1: number;
        //PPU_BackgroundVisible: boolean;
        //PPU_SpritesAreVisible: boolean;
        //PPU_PPUStatus: number;
        //PPU_PPUAddress: number;
        //PPU_PatternTableIndex: number;
        //PPU_IsRendering: boolean;
        //FrameOn: boolean;
        //PPU_NameTableMemoryStart: number;
        CurrentFrame: any;
        ChrRomHandler: any;

        //PPU_IRQAsserted: boolean;
        //PPU_NextEventAt: number;
        //PPU_FrameFinishHandler: {(): void};
        //PPU_SpriteCopyHasHappened: boolean;
        //PPU_MaxSpritesPerScanline: number;
        //PPU_SpriteRam: any;
        SpritesOnLine: any;
        LastcpuClock: number;
        //ByteOutBuffer: any;
        SetFlag(Flag: number, value: boolean): void;
        GetFlag(flag: number): boolean;
        InterruptRequest(): void;
        NonMaskableInterrupt(): void;
        CheckEvent(): void;
        RunFast(): void;
        Step(): void;

        ResetCPU(): void;
        PowerOn(): void;
        //GetState(outStream: any<number>): void;
        //SetState(inStream: any<number>): void;
        RunFrame(): void;
        DecodeAddress(): number;
        HandleBadOperation(): void;
        DecodeOperand(): number;
        Execute(): void;
        SetZNFlags(data: number): void;
        Compare(data: number): void;
        Branch(): void;
        NMIHandler(): void;
        IRQUpdater(): void;
        LoadBytes(offset: number, bytes: any): void;
        LoadBytes$1(offset: number, bytes: any, length: number): void;
        //PushStack(data: number): void;
        //PopStack(): number;
        //GetByte(): number;
        //GetByte$1(address: number): number;
        PeekByte(address: number): number;
        /**
         * gets an array of cpu memory, without affecting emulation
         *
         * @instance
         * @public
         * @this ChiChiNES.CPU2A03
         * @memberof ChiChiNES.CPU2A03
         * @param   {number}            start     
         * @param   {number}            finish
         * @return  {Array.<number>}
         */
        PeekBytes(start: number, finish: number): any;
        //SetByte(): void;
        //SetByte$1(address: number, data: number): void;
        FindNextEvent(): void;
        HandleNextEvent(): void;
        ResetInstructionHistory(): void;
        WriteInstructionHistoryAndUsage(): void;
        FireDebugEvent(s: string): void;
        PeekInstruction(address: number): ChiChiNES.CPU2A03.Instruction;
        PPU_Initialize(): void;
        //PPU_WriteState(writer: any<number>): void;
        //PPU_ReadState(state: any<number>): void;
        PPU_SetupVINT(): void;
        PPU_VidRAM_GetNTByte(address: number): number;
        UpdatePPUControlByte0(): void;
        PPU_SetByte(Clock: number, address: number, data: number): void;
        PPU_GetByte(Clock: number, address: number): number;
        PPU_HandleEvent(Clock: number): void;
        PPU_ResetClock(Clock: number): void;
        PPU_CopySprites(copyFrom: number): void;
        PPU_InitSprites(): void;
        PPU_GetSpritePixel(): number;
        PPU_WhissaSpritePixel(patternTableIndex: number, x: number, y: number, sprite: {v: ChiChiNES.NESSprite}, tileIndex: number): number;
        /**
         * populates the currentSpritesXXX arrays with the first 8 visible sprites on the 
         denoted scanline.
         *
         * @instance
         * @public
         * @this ChiChiNES.CPU2A03
         * @memberof ChiChiNES.CPU2A03
         * @param   {number}    scanline    the scanline to preload sprites for
         * @return  {void}
         */
        PPU_PreloadSprites(scanline: number): void;
        PPU_UnpackSprites(): void;
        UnpackSprite(currSprite: number): void;
        /**
         * Returns a pixel
         *
         * @instance
         * @public
         * @this ChiChiNES.CPU2A03
         * @memberof ChiChiNES.CPU2A03
         * @return  {number}
         */
        PPU_GetNameTablePixel(): number;
        FetchNextTile(): void;
        GetAttributeTableEntry(ppuNameTableMemoryStart: number, i: number, j: number): number;
        /**
         * draws from the lastcpuClock to the current one
         *
         * @instance
         * @public
         * @this ChiChiNES.CPU2A03
         * @memberof ChiChiNES.CPU2A03
         * @param   {number}    cpuClockNum
         * @return  {void}
         */
        DrawTo(cpuClockNum: number): void;
        UpdatePixelInfo(): void;
    }
    export interface CPU2A03Func extends Function {
        prototype: CPU2A03;
        Instruction: ChiChiNES.CPU2A03.InstructionFunc;
        new (bopper: ChiChiNES.BeepsBoops.Bopper): CPU2A03;
        pal: any;
        frameClockEnd: number;
        PPU_PowersOfTwo: any;
        PPU_PixelWhizzler(): void;
        
        GetPalRGBA(): any;
    }
    var CPU2A03: CPU2A03Func;
    module CPU2A03 {
        export interface Instruction {
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
        export interface InstructionFunc extends Function {
            prototype: Instruction;
            new (): Instruction;
            ctor: {
                new (): Instruction
            };
            $ctor1: {
                new (inst: ChiChiNES.CPU2A03.Instruction): Instruction
            };
        }
    }

}

declare module ChiChiNES.BeepsBoops {
    export interface Blip {
        BlipBuffer: ChiChiNES.BeepsBoops.Blip.blip_buffer_t;
        blip_samples_avail: number;
        blip_new(size: number): void;
        blip_set_rates(clock_rate: number, sample_rate: number): void;
        blip_clear(): void;
        blip_clocks_needed(samples: number): number;
        blip_end_frame(t: number): void;
        remove_samples(count: number): void;
        ReadBytes(outbuf: any, count: number, stereo: number): number;
        blip_add_delta(time: number, delta: number): void;
        blip_add_delta_fast(time: number, delta: number): void;
    }
    export interface BlipFunc extends Function {
        prototype: Blip;
        blip_buffer_t: ChiChiNES.BeepsBoops.Blip.blip_buffer_tFunc;
        new (size: number): Blip;
    }
    var Blip: BlipFunc;
    module Blip {
        export interface blip_buffer_t {
            samples: any;
        }
        export interface blip_buffer_tFunc extends Function {
            prototype: blip_buffer_t;
            new (size: number): blip_buffer_t;
        }
    }

    export interface WavSharer {
        Locker: any;
        NESTooFast: boolean;
        Frequency: number;
        SharedBuffer: any;
        SharedBufferLength: number;
        BufferAvailable: boolean;
        WavesWritten(remain: number): void;
        ReadWaves(): void;
        SetSharedBuffer(values: any): void;
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

    export interface Bopper  {
        audioSettings: any;

        SampleRate: number;
        Muted: boolean;
        InterruptRaised: boolean;
        EnableSquare0: boolean;
        EnableSquare1: boolean;
        enableTriangle: boolean;
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
        new (output: ChiChiNES.BeepsBoops.WavSharer): Bopper;
    }
    var Bopper: BopperFunc;

    export interface IAPU {
        ChiChiNES$BeepsBoops$IAPU$InterruptRaised: boolean;
        InterruptRaised: boolean;
        ChiChiNES$BeepsBoops$IAPU$Muted: boolean;
        Muted: boolean;
        ChiChiNES$BeepsBoops$IAPU$EnableSquare0: boolean;
        EnableSquare0: boolean;
        ChiChiNES$BeepsBoops$IAPU$EnableSquare1: boolean;
        EnableSquare1: boolean;
        ChiChiNES$BeepsBoops$IAPU$EnableTriangle: boolean;
        EnableTriangle: boolean;
        ChiChiNES$BeepsBoops$IAPU$EnableNoise: boolean;
        EnableNoise: boolean;
        ChiChiNES$BeepsBoops$IAPU$UpdateFrame(time: number): void;
        UpdateFrame(time: number): void;
        ChiChiNES$BeepsBoops$IAPU$EndFrame(time: number): void;
        EndFrame(time: number): void;
    }

    export interface IWavReader {
        ChiChiNES$BeepsBoops$IWavReader$SharedBuffer: any;
        SharedBuffer: any;
        ChiChiNES$BeepsBoops$IWavReader$SharedBufferLength: number;
        SharedBufferLength: number;
        ChiChiNES$BeepsBoops$IWavReader$Frequency: number;
        Frequency: number;
        ChiChiNES$BeepsBoops$IWavReader$BufferAvailable: boolean;
        BufferAvailable: boolean;
        ChiChiNES$BeepsBoops$IWavReader$BytesWritten: {(sender: any, e: any): void};
        BytesWritten: {(sender: any, e: any): void};
        ChiChiNES$BeepsBoops$IWavReader$StartReadWaves(): void;
        StartReadWaves(): void;
        ChiChiNES$BeepsBoops$IWavReader$ReadWaves(): void;
        ReadWaves(): void;
        ChiChiNES$BeepsBoops$IWavReader$SetSharedBuffer(values: any): void;
        SetSharedBuffer(values: any): void;
    }

    export interface NoiseChannel {
        Length: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.NoiseChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * Volume envelope for current waveform
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.NoiseChannel
         * @function Volume
         * @type number
         */
        Volume: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.NoiseChannel
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
        new (bleeper: ChiChiNES.BeepsBoops.Blip, chan: number): NoiseChannel;
    }
    var NoiseChannel: NoiseChannelFunc;

    export interface DMCChannel {
        Length: number;
        /**
         * Duty cycle of current square wave
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.DMCChannel
         * @function DutyCycle
         * @type number
         */
        DutyCycle: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.DMCChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * Volume envelope for current waveform
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.DMCChannel
         * @function Volume
         * @type number
         */
        Volume: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.DMCChannel
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
         * @memberof ChiChiNES.BeepsBoops.DMCChannel
         * @function Gain
         * @type number
         */
        Gain: number;
        /**
         * True for ones complement, false for twos complement
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.DMCChannel
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
        new (bleeper: ChiChiNES.BeepsBoops.Blip, chan: number): DMCChannel;
    }
    var DMCChannel: DMCChannelFunc;

    export interface SoundStatusChangeEventArgs {
        Muted: boolean;
    }
    export interface SoundStatusChangeEventArgsFunc extends Function {
        prototype: SoundStatusChangeEventArgs;
        new (): SoundStatusChangeEventArgs;
    }
    var SoundStatusChangeEventArgs: SoundStatusChangeEventArgsFunc;

    export interface TriangleChannel {
        Length: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.TriangleChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.TriangleChannel
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
        new (bleeper: ChiChiNES.BeepsBoops.Blip, chan: number): TriangleChannel;
    }
    var TriangleChannel: TriangleChannelFunc;

    export interface SquareChannel {
        Length: number;
        /**
         * Duty cycle of current square wave
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.SquareChannel
         * @function DutyCycle
         * @type number
         */
        DutyCycle: number;
        /**
         * Period of current waveform
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.SquareChannel
         * @function Period
         * @type number
         */
        Period: number;
        /**
         * Volume envelope for current waveform
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.SquareChannel
         * @function Volume
         * @type number
         */
        Volume: number;
        /**
         * current time in channel
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.SquareChannel
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
         * @memberof ChiChiNES.BeepsBoops.SquareChannel
         * @function Gain
         * @type number
         */
        Gain: number;
        /**
         * True for ones complement, false for twos complement
         *
         * @instance
         * @public
         * @memberof ChiChiNES.BeepsBoops.SquareChannel
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
        new (bleeper: ChiChiNES.BeepsBoops.Blip, chan: number): SquareChannel;
    }
    var SquareChannel: SquareChannelFunc;

}

declare module ChiChiNES.CPU {
    export interface NESCart extends ChiChiNES.BaseCart {
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

declare module ChiChiNES.Hacking {
    export interface IMemoryPatch {
        ChiChiNES$Hacking$IMemoryPatch$Activated: boolean;
        Activated: boolean;
        ChiChiNES$Hacking$IMemoryPatch$Address: number;
        Address: number;
        ChiChiNES$Hacking$IMemoryPatch$GetData(data: number): number;
        GetData(data: number): number;
    }

    export interface MemoryPatch extends ChiChiNES.Hacking.IMemoryPatch {
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

    export interface ComparedMemoryPatch extends ChiChiNES.Hacking.IMemoryPatch {
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

}

declare module ChiChiNES.Machine.ControlPanel {
    export enum RunningStatuses {
        Unloaded = 0,
        Off = 1,
        Running = 2,
        Frozen = 3,
        Paused = 4
    }

}

declare module ChiChiNES.PortQueueing {
    export interface QueuedPort {
    }

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

}

declare module ChiChiNES.ROMLoader {
    export interface iNESFileHandler {
    }
    export interface iNESFileHandlerFunc extends Function {
        prototype: iNESFileHandler;
        new (): iNESFileHandler;
        LoadROM(ppu: ChiChiNES.CPU2A03, thefile: any): ChiChiNES.INESCart;
    }
    var iNESFileHandler: iNESFileHandlerFunc;

    export interface CartLoadException  {
    }
    export interface CartLoadExceptionFunc extends Function {
        prototype: CartLoadException;
        $ctor1: {
            new (message: string, innerException: any): CartLoadException
        };
        ctor: {
            new (message: string): CartLoadException
        };
    }
    var CartLoadException: CartLoadExceptionFunc;
}
