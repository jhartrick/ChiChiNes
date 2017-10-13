/// <reference path="./bridge.d.ts" />

declare module ChiChiNES {
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

    export interface IControlPad extends System.IDisposable {
        CurrentByte: number;
        refresh(): void;
        getByte(clock: number): number;
        setByte(clock: number, data: number): void;
    }

    export interface IMemoryMappedIOElement {
        ChiChiNES$IMemoryMappedIOElement$GetByte(address: number): number;
        GetByte(address: number): number;
        ChiChiNES$IMemoryMappedIOElement$SetByte(address: number, data: number): void;
        SetByte(address: number, data: number): void;
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

    export interface IPixelAwareDevice {
        ChiChiNES$IPixelAwareDevice$addNeedPixelNow(value: {(sender: any, e: ChiChiNES.ClockedRequestEventArgs): void}): void;
        ChiChiNES$IPixelAwareDevice$removeNeedPixelNow(value: {(sender: any, e: ChiChiNES.ClockedRequestEventArgs): void}): void;
        addNeedPixelNow(value: {(sender: any, e: ChiChiNES.ClockedRequestEventArgs): void}): void;
        removeNeedPixelNow(value: {(sender: any, e: ChiChiNES.ClockedRequestEventArgs): void}): void;
        ChiChiNES$IPixelAwareDevice$PixelICareAbout: number;
        PixelICareAbout: number;
    }

    export interface IPPU {
        frameFinished(): void;

        ChiChiNES$IPPU$ChrRomHandler: ChiChiNES.INESCart;
        ChrRomHandler: ChiChiNES.INESCart;
        ChiChiNES$IPPU$CurrentFrame: number[];
        CurrentFrame: number[];
        ChiChiNES$IPPU$FrameFinishHandler: {(): void};
        FrameFinishHandler: {(): void};
        ChiChiNES$IPPU$HScroll: number;
        HScroll: number;
        ChiChiNES$IPPU$LastcpuClock: number;
        LastcpuClock: number;
        /**
         * @instance
         * @abstract
         * @public
         * @memberof ChiChiNES.IPPU
         * @function ChiChiNES$IPPU$NameTableMemoryStart
         * @type number
         */
        ChiChiNES$IPPU$NameTableMemoryStart: number;
        NameTableMemoryStart: number;
        ChiChiNES$IPPU$NextEventAt: number;
        NextEventAt: number;
        ChiChiNES$IPPU$NMIHandler: {(): void};
        NMIHandler: {(): void};
        ChiChiNES$IPPU$Palette: number[];
        Palette: number[];
        ChiChiNES$IPPU$PatternTableIndex: number;
        PatternTableIndex: number;
        ChiChiNES$IPPU$PPUControlByte0: number;
        PPUControlByte0: number;
        ChiChiNES$IPPU$PPUControlByte1: number;
        PPUControlByte1: number;
        ChiChiNES$IPPU$ScanlineNum: number;
        ScanlineNum: number;
        ChiChiNES$IPPU$ScanlinePos: number;
        ScanlinePos: number;
        ChiChiNES$IPPU$SpriteRam: number[];
        SpriteRam: number[];
        ChiChiNES$IPPU$SpritesAreVisible: boolean;
        SpritesAreVisible: boolean;
        ChiChiNES$IPPU$SpritesOnLine: number[];
        SpritesOnLine: number[];
        ChiChiNES$IPPU$VideoBuffer: number[];
        VideoBuffer: number[];
        ChiChiNES$IPPU$ByteOutBuffer: Uint8Array;
        ByteOutBuffer: Uint8Array;
        ChiChiNES$IPPU$VScroll: number;
        VScroll: number;
        ChiChiNES$IPPU$PixelAwareDevice: ChiChiNES.IPixelAwareDevice;
        PixelAwareDevice: ChiChiNES.IPixelAwareDevice;
        ChiChiNES$IPPU$UpdatePixelInfo(): void;
        UpdatePixelInfo(): void;
        ChiChiNES$IPPU$CopySprites(source: {v: number[]}, copyFrom: number): void;
        CopySprites(source: {v: number[]}, copyFrom: number): void;
        ChiChiNES$IPPU$DrawTo(cpuClockNum: number): void;
        DrawTo(cpuClockNum: number): void;
        ChiChiNES$IPPU$GetByte(Clock: number, address: number): number;
        GetByte(Clock: number, address: number): number;
        ChiChiNES$IPPU$HandleEvent(Clock: number): void;
        HandleEvent(Clock: number): void;
        ChiChiNES$IPPU$Initialize(): void;
        Initialize(): void;
        ChiChiNES$IPPU$PreloadSprites(scanline: number): void;
        PreloadSprites(scanline: number): void;
        ChiChiNES$IPPU$ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        ChiChiNES$IPPU$RenderScanline(scanlineNum: number): void;
        RenderScanline(scanlineNum: number): void;
        ChiChiNES$IPPU$ResetClock(Clock: number): void;
        ResetClock(Clock: number): void;
        ChiChiNES$IPPU$SetByte(Clock: number, address: number, data: number): void;
        SetByte(Clock: number, address: number, data: number): void;
        ChiChiNES$IPPU$SetupBufferForDisplay(buffer: {v: number[]}): void;
        SetupBufferForDisplay(buffer: {v: number[]}): void;
        ChiChiNES$IPPU$SetupVINT(): void;
        SetupVINT(): void;
        ChiChiNES$IPPU$SetVideoBuffer(inBuffer: number[]): void;
        SetVideoBuffer(inBuffer: number[]): void;
        ChiChiNES$IPPU$VidRAM_GetNTByte(address: number): number;
        VidRAM_GetNTByte(address: number): number;
        ChiChiNES$IPPU$WriteState(writer: System.Collections.Generic.Queue$1<number>): void;
        WriteState(writer: System.Collections.Generic.Queue$1<number>): void;
    }

    export enum NameTableMirroring {
        OneScreen = 0,
        Vertical = 1,
        Horizontal = 2,
        FourScreen = 3
    }

    export interface NESMachine extends System.IDisposable {
        addSoundStatusChanged(value: {(sender: any, e: ChiChiNES.BeepsBoops.SoundStatusChangeEventArgs): void}): void;
        removeSoundStatusChanged(value: {(sender: any, e: ChiChiNES.BeepsBoops.SoundStatusChangeEventArgs): void}): void;
        Drawscreen(): void;
        addDrawscreen(value: { (sender: any, e: System.Object): void }): void;
        removeDrawscreen(value: {(sender: any, e: System.Object): void}): void;
        CurrentCartName: string;
        RunState: ChiChiNES.Machine.ControlPanel.RunningStatuses;
        CurrentSaveSlot: number;
        Cpu: ChiChiNES.CPU2A03;
        Cart: ChiChiNES.INESCart;
        SoundBopper: ChiChiNES.BeepsBoops.Bopper;
        WaveForms: ChiChiNES.BeepsBoops.IWavReader;
        EnableSound: boolean;
        Tiler: ChiChiNES.TileDoodler;
        FrameCount: number;
        IsRunning: boolean;
        PPU: ChiChiNES.IPPU;
        PadOne: ChiChiNES.IControlPad;
        PadTwo: ChiChiNES.IControlPad;
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
        AddGameGenieCode(code: string, patch: {v: ChiChiNES.Hacking.IMemoryPatch}): boolean;
        WriteWAVToFile(writer: ChiChiNES.BeepsBoops.IWavWriter): void;
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
         * @this ChiChiNES.NESMachine
         * @memberof ChiChiNES.NESMachine
         * @return  {void}
         */
        Step(): void;
        RunFrame(): void;
        FrameFinished(): void;
    }
    export interface NESMachineFunc extends Function {
        prototype: NESMachine;
        new (cpu: ChiChiNES.CPU2A03, ppu: ChiChiNES.IPPU, tiler: ChiChiNES.TileDoodler, wavSharer: ChiChiNES.BeepsBoops.WavSharer, soundBopper: ChiChiNES.BeepsBoops.Bopper, soundThread: ChiChiNES.Sound.SoundThreader): NESMachine;
    }
    var NESMachine: NESMachineFunc;

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
        getHashCode(): ChiChiNES.NESSprite;
        equals(o: ChiChiNES.NESSprite): Boolean;
        $clone(to: ChiChiNES.NESSprite): ChiChiNES.NESSprite;
    }
    export interface NESSpriteFunc extends Function {
        prototype: NESSprite;
        new (): NESSprite;
    }
    var NESSprite: NESSpriteFunc;

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
         * @this ChiChiNES.TileDoodler
         * @memberof ChiChiNES.TileDoodler
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
         * @this ChiChiNES.TileDoodler
         * @memberof ChiChiNES.TileDoodler
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
         * @this ChiChiNES.TileDoodler
         * @memberof ChiChiNES.TileDoodler
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
         * @this ChiChiNES.TileDoodler
         * @memberof ChiChiNES.TileDoodler
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
        new (ppu: ChiChiNES.IPPU): TileDoodler;
    }
    var TileDoodler: TileDoodlerFunc;

    export interface INESCart extends ChiChiNES.IClockedMemoryMappedIOElement {
        ChiChiNES$INESCart$Whizzler: ChiChiNES.IPPU;
        Whizzler: ChiChiNES.IPPU;
        ChiChiNES$INESCart$CPU: ChiChiNES.CPU2A03;
        CPU: ChiChiNES.CPU2A03;
        ChiChiNES$INESCart$ChrRom: number[];
        ChrRom: number[];
        ChiChiNES$INESCart$ChrRamStart: number;
        ChrRamStart: number;
        ChiChiNES$INESCart$PPUBankStarts: number[];
        PPUBankStarts: number[];
        ChiChiNES$INESCart$ROMHashFunction: {(prg: number[], chr: number[]): string};
        ROMHashFunction: {(prg: number[], chr: number[]): string};
        ChiChiNES$INESCart$CheckSum: string;
        CheckSum: string;
        ChiChiNES$INESCart$SRAM: number[];
        SRAM: number[];
        ChiChiNES$INESCart$Mirroring: ChiChiNES.NameTableMirroring;
        Mirroring: ChiChiNES.NameTableMirroring;
        ChiChiNES$INESCart$CartName: string;
        CartName: string;
        ChiChiNES$INESCart$NumberOfPrgRoms: number;
        NumberOfPrgRoms: number;
        ChiChiNES$INESCart$NumberOfChrRoms: number;
        NumberOfChrRoms: number;
        ChiChiNES$INESCart$MapperID: number;
        MapperID: number;
        /**
         * Used for bankswitching
         *
         * @instance
         * @abstract
         * @public
         * @memberof ChiChiNES.INESCart
         * @function ChiChiNES$INESCart$BankSwitchesChanged
         * @type boolean
         */
        ChiChiNES$INESCart$BankSwitchesChanged: boolean;
        BankSwitchesChanged: boolean;
        ChiChiNES$INESCart$BankStartCache: number[];
        BankStartCache: number[];
        ChiChiNES$INESCart$CurrentBank: number;
        CurrentBank: number;
        ChiChiNES$INESCart$UsesSRAM: boolean;
        UsesSRAM: boolean;
        ChiChiNES$INESCart$LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;
        LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;
        ChiChiNES$INESCart$InitializeCart(): void;
        InitializeCart(): void;
        ChiChiNES$INESCart$UpdateScanlineCounter(): void;
        UpdateScanlineCounter(): void;
        ChiChiNES$INESCart$WriteState(state: System.Collections.Generic.Queue$1<number>): void;
        WriteState(state: System.Collections.Generic.Queue$1<number>): void;
        ChiChiNES$INESCart$ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        ReadState(state: System.Collections.Generic.Queue$1<number>): void;
        ChiChiNES$INESCart$GetPPUByte(clock: number, address: number): number;
        GetPPUByte(clock: number, address: number): number;
        ChiChiNES$INESCart$SetPPUByte(clock: number, address: number, data: number): void;
        SetPPUByte(clock: number, address: number, data: number): void;
        ChiChiNES$INESCart$FetchPixelEffect(vramAddress: number): number[];
        FetchPixelEffect(vramAddress: number): number[];
        ChiChiNES$INESCart$ActualChrRomOffset(address: number): number;
        ActualChrRomOffset(address: number): number;
        ChiChiNES$INESCart$UpdateBankStartCache(): number;
        UpdateBankStartCache(): number;
        ChiChiNES$INESCart$ResetBankStartCache(): void;
        ResetBankStartCache(): void;
    }

    export interface InputHandler extends ChiChiNES.IClockedMemoryMappedIOElement {
        IsZapper: boolean;
        ControlPad: ChiChiNES.IControlPad;
        CurrentByte: number;
        NMIHandler: {(): void};
        IRQAsserted: boolean;
        NextEventAt: number;
        controlPad_NextControlByteSet(sender: any, e: ChiChiNES.ControlByteEventArgs): void;
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
            new (padOne: ChiChiNES.IControlPad): InputHandler
        };
    }
    var InputHandler: InputHandlerFunc;

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

    export interface PixelWhizzler extends ChiChiNES.IPPU, ChiChiNES.IClockedMemoryMappedIOElement {


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
        PixelAwareDevice: ChiChiNES.IPixelAwareDevice;
        ByteOutBuffer: Uint8Array;
        Palette: number[];
        CurrentPalette: number;
        NMIHandler: {(): void};
        /**
         * ppu doesnt throw irq's
         *
         * @instance
         * @public
         * @memberof ChiChiNES.PixelWhizzler
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
        ChrRomHandler: ChiChiNES.INESCart;
        Events: System.Collections.Generic.Queue$1<ChiChiNES.PPUWriteEvent>;
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
         * @this ChiChiNES.PixelWhizzler
         * @memberof ChiChiNES.PixelWhizzler
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
         * @this ChiChiNES.PixelWhizzler
         * @memberof ChiChiNES.PixelWhizzler
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
         * @this ChiChiNES.PixelWhizzler
         * @memberof ChiChiNES.PixelWhizzler
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
        WhissaSpritePixel(patternTableIndex: number, x: number, y: number, sprite: {v: ChiChiNES.NESSprite}, tileIndex: number): number;
        /**
         * populates the currentSpritesXXX arrays with the first 8 visible sprites on the 
         denoted scanline.
         *
         * @instance
         * @public
         * @this ChiChiNES.PixelWhizzler
         * @memberof ChiChiNES.PixelWhizzler
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
         * @this ChiChiNES.PixelWhizzler
         * @memberof ChiChiNES.PixelWhizzler
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
        GetPalBytes(): number[];
        GetPalRGBA(): number[];
    }
    var PixelWhizzler: PixelWhizzlerFunc;

    export interface BaseCart extends ChiChiNES.INESCart {
        irqRaised: boolean;
        Debugging: boolean;
        DebugEvents: System.Collections.Generic.List$1<ChiChiNES.CartDebugEvent>;
        ChrRom: number[];
        ChrRomCount: number;
        PrgRomCount: number;
        ROMHashFunction: {(prg: number[], chr: number[]): string};
        Whizzler: ChiChiNES.IPPU;
        IrqRaised: boolean;
        CheckSum: string;
        CPU: ChiChiNES.CPU2A03;
        SRAM: number[];
        CartName: string;
        NumberOfPrgRoms: number;
        NumberOfChrRoms: number;
        MapperID: number;
        Mirroring: ChiChiNES.NameTableMirroring;
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

    export interface NesCartMMC3 extends ChiChiNES.BaseCart {
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

    export interface CPU2A03 {
        addressmode: ChiChiNES.AddressingModes[];
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
         * @memberof ChiChiNES.CPU2A03
         * @function CurrentInstruction
         * @type ChiChiNES.CPU2A03.Instruction
         */
        CurrentInstruction: ChiChiNES.CPU2A03.Instruction;
        OperationCounter: number;
        Clock: number;
        RunningHard: boolean;
        /**
         * number of full clock ticks elapsed since emulation started
         *
         * @instance
         * @public
         * @memberof ChiChiNES.CPU2A03
         * @function Ticks
         * @type number
         */
        Ticks: number;
        MemoryPatches: System.Collections.Generic.Dictionary$2<number,ChiChiNES.Hacking.IMemoryPatch>;
        GenieCodes: System.Collections.Generic.Dictionary$2<number,number>;
        Cheating: boolean;
        SoundBopper: ChiChiNES.IClockedMemoryMappedIOElement;
        PadOne: ChiChiNES.InputHandler;
        PadTwo: ChiChiNES.InputHandler;
        Cart: ChiChiNES.IClockedMemoryMappedIOElement;
        PixelWhizzler: ChiChiNES.IPPU;
        StackPointer: number;
        Debugging: boolean;
        InstructionUsage: number[];
        InstructionHistoryPointer: number;
        InstructionHistory: ChiChiNES.CPU2A03.Instruction[];
        FireDebugEvent: any;
        HandleBadOperation : any;
        getSRMask(flag: ChiChiNES.CPUStatusBits): number;
        SetFlag(Flag: ChiChiNES.CPUStatusMasks, value: boolean): void;
        GetFlag(Flag: ChiChiNES.CPUStatusMasks): boolean;
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
         * @this ChiChiNES.CPU2A03
         * @memberof ChiChiNES.CPU2A03
         * @param   {number}    count
         * @return  {void}
         */
        RunCycles(count: number): void;
        FetchNextInstruction(): boolean;
        FetchInstructionParameters(): void;
        FetchInstructionParameters$1(inst: {v: ChiChiNES.CPU2A03.Instruction}, address: number): void;
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
        SKB(): void;
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
        AAC(): void;
        ASR(): void;
        ARR(): void;
        ATX(): void;
        NMIHandler(): void;
        IRQUpdater(): void;
        LoadBytes(offset: number, bytes: number[]): void;
        LoadBytes$1(offset: number, bytes: number[], length: number): void;
        PushStack(data: number): void;
        PopStack(): number;
        GetByte(): number;
        GetByte$1(address: number): number;
        PeekBytes(start: number, finish: number): number[];
        SetByte(): void;
        SetByte$1(address: number, data: number): void;
        FindNextEvent(): void;
        HandleNextEvent(): void;
        WriteInstructionHistoryAndUsage(): void;
        ResetInstructionHistory(): void;
        PeekInstruction(address: number): ChiChiNES.CPU2A03.Instruction;
    }
    export interface CPU2A03Func extends Function {
        prototype: CPU2A03;
        Instruction: ChiChiNES.CPU2A03.InstructionFunc;
        CPUStatus: ChiChiNES.CPU2A03.CPUStatusFunc;
        smallInstruction: ChiChiNES.CPU2A03.smallInstructionFunc;
        new (whizzler: ChiChiNES.IPPU, bopper: ChiChiNES.BeepsBoops.Bopper): CPU2A03;
    }
    var CPU2A03: CPU2A03Func;
    module CPU2A03 {
        
        export interface Instruction {
            AddressingMode: ChiChiNES.AddressingModes;
            Address: number;
            OpCode: number;
            Parameters0: number;
            Parameters1: number;
            ExtraTiming: number;
            Length: number;
            frame: number;
            time: number;
            A: number;
            X: number;
            Y: number;
            SR: number;
            SP: number;
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

        export interface smallInstruction {
            $clone(to: ChiChiNES.CPU2A03.smallInstruction): ChiChiNES.CPU2A03.smallInstruction;
        }
        export interface smallInstructionFunc extends Function {
            prototype: smallInstruction;
            new (): smallInstruction;
            UnpackInstruction(instruction: number): ChiChiNES.CPU2A03.Instruction;
        }
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
        ReadBytes(outbuf: number[], count: number, stereo: number): number;
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
            samples: number[];
        }
        export interface blip_buffer_tFunc extends Function {
            prototype: blip_buffer_t;
            new (size: number): blip_buffer_t;
        }
    }

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

    export interface WavSharer extends ChiChiNES.BeepsBoops.IWavReader {
        Locker: any;
        NESTooFast: boolean;
        Frequency: number;
        SharedBuffer: number[];
        SharedBufferLength: number;
        BufferAvailable: boolean;
        BytesWritten: {(sender: any, e: System.Object): void};
        WavesWritten(remain: number): void;
        AppendFile(writer: ChiChiNES.BeepsBoops.IWavWriter): void;
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

    export interface Bopper extends ChiChiNES.IClockedMemoryMappedIOElement,ChiChiNES.BeepsBoops.IAPU {
        SampleRate: number;
        Muted: boolean;
        Enabled: boolean;
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
        new (output: ChiChiNES.BeepsBoops.WavSharer): Bopper;
    }
    var Bopper: BopperFunc;

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

    export interface IWavReader {
        ChiChiNES$BeepsBoops$IWavReader$SharedBuffer: number[];
        SharedBuffer: number[];
        ChiChiNES$BeepsBoops$IWavReader$SharedBufferLength: number;
        SharedBufferLength: number;
        ChiChiNES$BeepsBoops$IWavReader$Frequency: number;
        Frequency: number;
        ChiChiNES$BeepsBoops$IWavReader$BufferAvailable: boolean;
        BufferAvailable: boolean;
        ChiChiNES$BeepsBoops$IWavReader$BytesWritten: {(sender: any, e: System.Object): void};
        BytesWritten: {(sender: any, e: System.Object): void};
        ChiChiNES$BeepsBoops$IWavReader$StartReadWaves(): void;
        StartReadWaves(): void;
        ChiChiNES$BeepsBoops$IWavReader$ReadWaves(): void;
        ReadWaves(): void;
        ChiChiNES$BeepsBoops$IWavReader$SetSharedBuffer(values: number[]): void;
        SetSharedBuffer(values: number[]): void;
    }

    export interface IWavWriter extends System.IDisposable {
        ChiChiNES$BeepsBoops$IWavWriter$writeWaves(inBuff: number[], remain: number): void;
        writeWaves(inBuff: number[], remain: number): void;
    }

    export interface SoundStatusChangeEventArgs {
        Muted: boolean;
    }
    export interface SoundStatusChangeEventArgsFunc extends Function {
        prototype: SoundStatusChangeEventArgs;
        new (): SoundStatusChangeEventArgs;
    }
    var SoundStatusChangeEventArgs: SoundStatusChangeEventArgsFunc;

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

}

declare module ChiChiNES.Interaction {
    export enum NESPixelFormats {
        RGB = 0,
        BGR = 1,
        Indexed = 2
    }

    export enum CallbackType {
        None = 0,
        NoArgs = 1,
        Array = 2,
        IntPtr = 3
    }

    /** @namespace ChiChiNES.Interaction */

    /**
     * Defines what the main windows interaction with the current renderer
     *
     * @abstract
     * @public
     * @class ChiChiNES.Interaction.IDisplayContext
     */
    export interface IDisplayContext {
        ChiChiNES$Interaction$IDisplayContext$AttachedMachine: ChiChiNES.NESMachine;
        AttachedMachine: ChiChiNES.NESMachine;
        ChiChiNES$Interaction$IDisplayContext$DesiredCallback: ChiChiNES.Interaction.CallbackType;
        DesiredCallback: ChiChiNES.Interaction.CallbackType;
        ChiChiNES$Interaction$IDisplayContext$PixelWidth: number;
        PixelWidth: number;
        ChiChiNES$Interaction$IDisplayContext$PixelFormat: ChiChiNES.Interaction.NESPixelFormats;
        PixelFormat: ChiChiNES.Interaction.NESPixelFormats;
        ChiChiNES$Interaction$IDisplayContext$UIControl: any;
        UIControl: any;
        ChiChiNES$Interaction$IDisplayContext$PropertiesPanel: any;
        PropertiesPanel: any;
        ChiChiNES$Interaction$IDisplayContext$DisplayName: string;
        DisplayName: string;
        ChiChiNES$Interaction$IDisplayContext$CreateDisplay(): void;
        CreateDisplay(): void;
        ChiChiNES$Interaction$IDisplayContext$TearDownDisplay(): void;
        TearDownDisplay(): void;
        ChiChiNES$Interaction$IDisplayContext$DrawDefaultDisplay(): void;
        DrawDefaultDisplay(): void;
        ChiChiNES$Interaction$IDisplayContext$ToggleFullScreen(): void;
        ToggleFullScreen(): void;
        ChiChiNES$Interaction$IDisplayContext$SetPausedState(state: boolean): void;
        SetPausedState(state: boolean): void;
    }

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

    export interface NESDisplayPluginAttribute extends System.Attribute {
    }
    export interface NESDisplayPluginAttributeFunc extends Function {
        prototype: NESDisplayPluginAttribute;
        new (): NESDisplayPluginAttribute;
    }
    var NESDisplayPluginAttribute: NESDisplayPluginAttributeFunc;

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
    export interface QueuedPort extends System.Collections.Generic.Queue$1<ChiChiNES.PortQueueing.PortWriteEntry> {
    }
    export interface QueuedPortFunc extends Function {
        prototype: QueuedPort;
        new (): QueuedPort;
    }
    var QueuedPort: QueuedPortFunc;

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
        LoadROM(ppu: ChiChiNES.IPPU, thefile: number[]): ChiChiNES.INESCart;
    }
    var iNESFileHandler: iNESFileHandlerFunc;

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

}

declare module ChiChiNES.Sound {
    export interface SoundThreader extends System.IDisposable {
        WavePlayer: ChiChiNES.Sound.IWavStreamer;
        OnSoundStatusChanged(sender: any, e: ChiChiNES.BeepsBoops.SoundStatusChangeEventArgs): void;
        PlaySound(o: any): void;
        dispose(): void;
    }
    export interface SoundThreaderFunc extends Function {
        prototype: SoundThreader;
        new (streamer: ChiChiNES.Sound.IWavStreamer): SoundThreader;
    }
    var SoundThreader: SoundThreaderFunc;

    export interface IWavStreamer extends System.IDisposable {
        ChiChiNES$Sound$IWavStreamer$Muted: boolean;
        Muted: boolean;
        ChiChiNES$Sound$IWavStreamer$Volume: number;
        Volume: number;
        ChiChiNES$Sound$IWavStreamer$playPCM(): void;
        playPCM(): void;
        ChiChiNES$Sound$IWavStreamer$checkSamples(): void;
        checkSamples(): void;
    }
}
