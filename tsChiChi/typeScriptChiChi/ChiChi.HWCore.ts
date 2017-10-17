 enum ChiChiCPPU_AddressingModes {
    Bullshit,
    Implicit,
    Accumulator,
    Immediate,
    ZeroPage,
    ZeroPageX,
    ZeroPageY,
    Relative,
    Absolute,
    AbsoluteX,
    AbsoluteY,
    Indirect,
    IndexedIndirect,
    IndirectIndexed,
    IndirectZeroPage,
    IndirectAbsoluteX
}

class ChiChiInstruction implements ChiChiInstruction{
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

 class ChiChiSprite {

     YPosition: number = 0;
     XPosition: number = 0;
     SpriteNumber: number = 0;
     Foreground: boolean = false;
     IsVisible: boolean = false;
     TileIndex: number = 0;
     AttributeByte: number = 0;
     FlipX: boolean = false;
     FlipY: boolean = false;
     Changed: boolean = false;
 }

class ChiChiNullPad implements ChiChiNES.InputHandler{
    IsZapper: boolean;
    ControlPad: ChiChiNES.IControlPad;
    CurrentByte: number;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    controlPad_NextControlByteSet(sender: any, e: ChiChiNES.ControlByteEventArgs): void {
        // throw new Error("Method not implemented.");
    }
    GetByte(clock: number, address: number): number {
        return this.CurrentByte;
    }
    SetByte(clock: number, address: number, data: number): void {
    }
    SetNextControlByte(data: number): void {
    }
    HandleEvent(Clock: number): void {
    }
    ResetClock(Clock: number): void {
    }
    ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler: () => void;
    ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted: boolean;
    ChiChiNES$IClockedMemoryMappedIOElement$NextEventAt: number;
    ChiChiNES$IClockedMemoryMappedIOElement$GetByte(Clock: number, address: number): number {
        return this.GetByte(Clock,address);
    }
    ChiChiNES$IClockedMemoryMappedIOElement$SetByte(Clock: number, address: number, data: number): void {
        this.SetByte(Clock, address, data);
    }
    ChiChiNES$IClockedMemoryMappedIOElement$HandleEvent(Clock: number): void {
        
    }
    ChiChiNES$IClockedMemoryMappedIOElement$ResetClock(Clock: number): void {
     
    }

    
}

 class ChiChiCPPU implements ChiChiNES.CPU2A03
 {
    PadTwo: ChiChiNES.InputHandler;

    readonly SRMasks_CarryMask = 0x01;
    readonly SRMasks_ZeroResultMask = 0x02;
    readonly SRMasks_InterruptDisableMask = 0x04;
    readonly SRMasks_DecimalModeMask = 0x08;
    readonly SRMasks_BreakCommandMask = 0x10;
    readonly SRMasks_ExpansionMask = 0x20;
    readonly SRMasks_OverflowMask = 0x40;
    readonly SRMasks_NegativeResultMask = 0x80;


    private frameFinished: () => void;
    private  vbufLocation: number= 0;
    private yPosition: number= 0;
    private xPosition: number= 0;
    private currentAttributeByte: number= 0;
    private spriteSize: number = 0;
    private spritesOnThisScanline: number= 0;
    private spriteZeroHit: boolean = false;
    private isForegroundPixel: boolean = false;
    private currentSprites: ChiChiSprite[];
    private _spriteCopyHasHappened: boolean = false;

    public LastcpuClock: number= 0;

    private unpackedSprites: ChiChiSprite[];
    private chrRomHandler: ChiChiNES.INESCart;

    private spriteChanges: boolean = false;
    private ppuReadBuffer: number = 0;
    private _clipSprites: boolean = false;
    private _clipTiles: boolean = false;
    private _tilesAreVisible: boolean = false;
    private _spritesAreVisible: boolean = false;
    private nameTableMemoryStart: number = 0;
   // statics 
    private static cpuTiming: number[] = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
    private static pal: Uint32Array = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    private static addressModes: number[] = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
    private _reset = false;

    //timing
    private clock = 0;
    private _ticks = 0;
    // CPU Status
    private _statusRegister = 0;
    private _programCounter = 0;

    private _handleNMI: boolean = false;
    private _handleIRQ: boolean = false;

    private _addressBus = 0;
    private _dataBus = 0;
    private _operationCounter = 0;
    private _accumulator = 0;
    private _indexRegisterX = 0;
    private _indexRegisterY = 0;

    // Current Instruction
    private _currentInstruction_AddressingMode = ChiChiCPPU_AddressingModes.Bullshit;
    private _currentInstruction_Address = 0;
    private _currentInstruction_OpCode = 0;
    private _currentInstruction_Parameters0 = 0;
    private _currentInstruction_Parameters1 = 0;
    private _currentInstruction_ExtraTiming = 0;
    private systemClock = 0;
    private nextEvent = -1;

    // CPU Op info
    private clockcount = new Uint8Array(256); // System.Array.init(256, 0, System.Int32);
    private instruction = new Uint8Array(256); // System.Array.init(256, 0, System.Int32);
    public addressmode = new Uint8Array(256);// System.Array.init(256, 0, System.Int32);

    private _cheating = false;
    private __frameFinished = true;
    // system ram
    private Rams = new Uint8Array(8192);// System.Array.init(vv, 0, System.Int32);
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

    private instructionHistoryPointer = 255;
    private _instructionHistory = new Array(256);//System.Array.init(256, null, ChiChiInstruction);

    public get InstructionHistory(): Array<any> {
        return this._instructionHistory;
    }

    public get InstructionHistoryPointer(): number {
        return this.instructionHistoryPointer;
    }

    // ppu events
    // ppu variables 
    private _backgroundPatternTableIndex: number;
    private PPU_HandleVBlankIRQ: boolean;
    private _PPUAddress: number;
    private _PPUStatus: number;
    private _PPUControlByte0: number;
    private _PPUControlByte1: number;
    private _spriteAddress: number;
    // 'internal
    private currentXPosition = 0;
    private currentYPosition = 0;
    private _hScroll = 0;
    private _vScroll = 0;
    private lockedHScroll = 0;
    private lockedVScroll = 0;
    private scanlineNum = 0;
    private scanlinePos = 0;
    private NMIHasBeenThrownThisFrame = false;
    private shouldRender = false;
    private _frames = 0;
    private hitSprite = false;
    private PPUAddressLatchIsHigh = true;
    private p32 = new Uint32Array(256);// System.Array.init(256, 0, System.Int32);
    private isRendering = true;
    public frameClock = 0;
    public FrameEnded = false;
    private frameOn = false;
    //private framePalette = System.Array.init(256, 0, System.Int32);
    private nameTableBits = 0;
    private vidRamIsRam = true;
    private _palette = new Uint8Array(32);// System.Array.init(32, 0, System.Int32);
    private _openBus = 0;
    private sprite0scanline = 0;
    private sprite0x = 0;
    private _maxSpritesPerScanline = 64;
    private spriteRAM = new Uint8Array(256);// System.Array.init(256, 0, System.Int32);
    private spritesOnLine = new Array<number>(512);// System.Array.init(512, 0, System.Int32);
    private patternEntry = 0;
    private patternEntryByte2 = 0;
    private currentTileIndex = 0;
    private xNTXor = 0;
    private yNTXor = 0;
    private fetchTile = true;
    private outBuffer = new Uint8Array(65536);
    private drawInfo = new Uint8Array(65536);
    private _padOne: ChiChiNES.InputHandler;
    private _padTwo: ChiChiNES.InputHandler;

    public byteOutBuffer = new Uint8Array(256 * 256 * 4);// System.Array.init(262144, 0, System.Int32);
        

    constructor(bopper: ChiChiNES.BeepsBoops.Bopper) {
            //this.$initialize();
            // BuildOpArray();

            this._padOne = new ChiChiNES.InputHandler();
            this._padTwo = new ChiChiNES.InputHandler();

            this.SoundBopper = bopper;

            bopper.NMIHandler = this.IRQUpdater;

            // init PPU
            this.PPU_InitSprites();
            this._padOne = new ChiChiNullPad();
            this._padTwo = new ChiChiNullPad();

            //this.vBuffer = System.Array.init(61440, 0, System.Byte);

            //ChiChiNES.CPU2A03.GetPalRGBA();

    }

    public get PadOne(): ChiChiNES.InputHandler {
        return this._padOne;
    }

    public set PadOne(value: ChiChiNES.InputHandler) {
        this._padOne = value;
    }


    addDebugEvent(value: (sender: any, e: System.Object) => void): void {
        //throw new Error('Method not implemented.');
    }
    removeDebugEvent(value: (sender: any, e: System.Object) => void): void {
       // throw new Error('Method not implemented.');
    }

    CurrentInstruction: ChiChiInstruction;

    SoundBopper: ChiChiNES.IClockedMemoryMappedIOElement;

    Cart: ChiChiNES.IClockedMemoryMappedIOElement;

    FrameOn: boolean;
    get PPU_NameTableMemoryStart(): number {
        return this.nameTableMemoryStart;
    }

    set PPU_NameTableMemoryStart(value: number) {
        this.nameTableMemoryStart = value;
    }

    CurrentFrame: number[];

    get Clock(): number { return this.clock; }
    set Clock(value: number) {
        this.clock = value;
        if (value === 0) {
            this.systemClock = (this.systemClock + this.clock) & 0xFFFFFFFFFF;
        }
    }

    set ChrRomHandler(value: ChiChiNES.INESCart) {
        this.chrRomHandler = value;
    }
    get ChrRomHandler(): ChiChiNES.INESCart {
        return this.chrRomHandler;
    }

    PPU_IRQAsserted: boolean;

    get PPU_NextEventAt(): number {
        
            if (this.frameClock < 6820) {
                return (6820 - this.frameClock) / 3;
            } else {
                return (((89345 - this.frameClock) / 341) / 3);
            }
            //}
            //else
            //{
            //    return (6823 - frameClock) / 3;
            //}
        
    }

    get PPU_FrameFinishHandler(): () => void {
        return this.frameFinished;
    } 
    set PPU_FrameFinishHandler(value: () => void)  {
        this.frameFinished = value;
    } 

    PPU_SpriteCopyHasHappened: boolean;
    PPU_MaxSpritesPerScanline: number;

    PPU_SpriteRam: number[];
    SpritesOnLine: number[];
    

    SetFlag(Flag: number, value: boolean): void {
        this._statusRegister = (value ? (this._statusRegister | Flag) : (this._statusRegister & ~Flag));

        this._statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    }
    GetFlag(flag: number): boolean {
        return ((this._statusRegister & flag) === flag);
    }
    InterruptRequest(): void {

        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        if (this.GetFlag(this.SRMasks_InterruptDisableMask)) {
            return;
        }
        this.SetFlag(this.SRMasks_InterruptDisableMask, true);

        let newStatusReg = this._statusRegister & -17 | 32;

        // if enabled

        // push pc onto stack (high byte first)
        this.PushStack(this._programCounter >> 8);
        this.PushStack(this._programCounter);
        // push sr onto stack
        this.PushStack(this._statusRegister);

        // point pc to interrupt service routine

        this._programCounter = this.GetByte(65534) + (this.GetByte(65535) << 8);

                // nonOpCodeticks = 7;
    }
    NonMaskableInterrupt(): void {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        let newStatusReg = this._statusRegister & -17 | 32;

        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.PushStack(this._programCounter >> 8);
        this.PushStack(this._programCounter & 255);
        //c7ab
        // push sr onto stack
        this.PushStack(newStatusReg);
        // point pc to interrupt service routine
        const lowByte = this.GetByte(65530);
        const highByte = this.GetByte(65531);
        const jumpTo = lowByte | (highByte << 8);
        this._programCounter = jumpTo;        
    }
    CheckEvent(): void {
        if (this.nextEvent === -1) {
            this.FindNextEvent();
        }
    }
    RunFast(): void {
        while (this.clock < 29780) {
            this.Step();
        }
    }

    Step(): void {
        let tickCount = 0;
        this._currentInstruction_ExtraTiming = 0;

        this.DrawTo(this.clock);
        if (this.nextEvent <= this.clock) {
            this.HandleNextEvent();
        }

        if (this._handleNMI) {
            this._handleNMI = false;
            this.clock += 7;
            this.NonMaskableInterrupt();

            //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
            //  set is pushed on the stack, then the I flag is set. 
            const newStatusReg = this._statusRegister & -17 | 32;

            this.SetFlag(this.SRMasks_InterruptDisableMask, true);
            // push pc onto stack (high byte first)
            this.PushStack(this._programCounter >> 8);
            this.PushStack(this._programCounter & 0xFF);
            //c7ab
            // push sr onto stack
            this.PushStack(newStatusReg);
            // point pc to interrupt service routine
            const lowByte = this.GetByte(65530);
            const highByte = this.GetByte(65531);
            const jumpTo = lowByte | (highByte << 8);
            this._programCounter = jumpTo;
            //nonOpCodeticks = 7;
        } else if (this._handleIRQ) {
            this._handleIRQ = false;
            this.clock += 7;
            //InterruptRequest();
            //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
            //  set is pushed on the stack, then the I flag is set. 
            if (!this.GetFlag(this.SRMasks_InterruptDisableMask)) {
                this.SetFlag(this.SRMasks_InterruptDisableMask, true);

                var newStatusReg1 = this._statusRegister & -17 | 32;

                // if enabled

                // push pc onto stack (high byte first)
                this.PushStack(this._programCounter >> 8);
                this.PushStack(this._programCounter);
                // push sr onto stack
                this.PushStack(this._statusRegister);

                // point pc to interrupt service routine

                this._programCounter = this.GetByte(65534) + (this.GetByte(65535) << 8);

                // nonOpCodeticks = 7;
            }

        }

        //FetchNextInstruction();
        this._currentInstruction_Address = this._programCounter;
        this._currentInstruction_OpCode = this.GetByte(this._programCounter++);
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];

        //FetchInstructionParameters();
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.GetByte(this._programCounter++);
                this._currentInstruction_Parameters1 = this.GetByte(this._programCounter++);
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiCPPU_AddressingModes.Relative:
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.GetByte(this._programCounter++);
                break;
            case ChiChiCPPU_AddressingModes.Accumulator:
            case ChiChiCPPU_AddressingModes.Implicit:
                break;
            default:
                //  throw new NotImplementedException("Invalid address mode!!");
                break;
        }

        this.Execute();

        //("{0:x} {1:x} {2:x}", _currentInstruction_OpCode, _currentInstruction_AddressingMode, _currentInstruction_Address);
        if (this._debugging) {
            this.WriteInstructionHistoryAndUsage();
            this._operationCounter++;
        }

        this.clock += ChiChiCPPU.cpuTiming[this._currentInstruction_OpCode] + this._currentInstruction_ExtraTiming;        
    }

    ResetCPU(): void {
        this._statusRegister = 52;
        this._operationCounter = 0;
        this._stackPointer = 253;
        this._programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
        this._ticks = 4;
    }

    PowerOn(): void {
        // powers up with this state
        this._statusRegister = 52;
        this._stackPointer = 253;
        this._operationCounter = 0;
        this._ticks = 4;

        // wram initialized to 0xFF, with some exceptions
        // probably doesn't affect games, but why not?
        for (var i = 0; i < 2048; ++i) {
            this.Rams[i] = 255;
        }
        this.Rams[8] = 247;
        this.Rams[9] = 239;
        this.Rams[10] = 223;
        this.Rams[15] = 191;

        this._programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
    }

    GetState(outStream: System.Collections.Generic.Queue$1<number>): void {
        //throw new Error('Method not implemented.');
    }

    SetState(inStream: System.Collections.Generic.Queue$1<number>): void {
       // throw new Error('Method not implemented.');
    }

    RunFrame(): void {

        this.FindNextEvent();

        do {
            this.Step();
        } while (!this.__frameFinished);
        this.PadOne.ControlPad.ChiChiNES$IControlPad$refresh();
    }

    DecodeAddress(): number {
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
        throw new Error('Method not implemented.');
    }

    DecodeOperand(): number {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Immediate:
                this._dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiCPPU_AddressingModes.Accumulator:
                return this._accumulator;
            default:
                this._dataBus = this.GetByte(this.DecodeAddress());
                return this._dataBus;
        }
    }

    Execute(): void {
        let data = 0;
        let lowByte = 0;
        let highByte = 0;
        let carryFlag = 0;
        let result = 0;
        let oldbit = 0;

        switch (this._currentInstruction_OpCode) {
            case 128:
            case 130:
            case 194:
            case 226:
            case 4:
            case 20:
            case 52:
            case 68:
            case 84:
            case 100:
            case 116:
            case 212:
            case 244:
            case 12:
            case 28:
            case 60:
            case 92:
            case 124:
            case 220:
            case 252:
                //SKB()
                //SKW();
                this.DecodeAddress();
                break;
            case 105:
            case 101:
            case 117:
            case 109:
            case 125:
            case 121:
            case 97:
            case 113:
                //ADC();
                // start the read process
                data = this.DecodeOperand();
                carryFlag = (this._statusRegister & 1);
                result = (this._accumulator + data + carryFlag) | 0;
                // carry flag
                this.SetFlag(this.SRMasks_CarryMask, result > 255);
                // overflow flag
                this.SetFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ data) & 128) !== 128 && ((this._accumulator ^ result) & 128) === 128);
                // occurs when bit 7 is set
                this._accumulator = result & 0xFF;
                this.SetZNFlags(this._accumulator);
                break;
            case 41:
            case 37:
            case 53:
            case 45:
            case 61:
            case 57:
            case 33:
            case 49:
                //AND();
                this._accumulator = (this._accumulator & this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
                break;
            case 10:
            case 6:
            case 22:
            case 14:
            case 30:
                //ASL();
                data = this.DecodeOperand();
                // set carry flag
                this.SetFlag(this.SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte(this.DecodeAddress(), data);
                }
                this.SetZNFlags(data);
                break;
            case 144:
                //BCC();
                if ((this._statusRegister & 1) !== 1) {
                    this.Branch();
                }
                break;
            case 176:
                //BCS();
                if ((this._statusRegister & 1) === 1) {
                    this.Branch();
                }
                break;
            case 240:
                //BEQ();
                if ((this._statusRegister & 2) === 2) {
                    this.Branch();
                }
                break;
            case 36:
            case 44:
                //BIT();
                data = this.DecodeOperand();
                // overflow is bit 6
                this.SetFlag(this.SRMasks_OverflowMask, (data & 64) === 64);
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
                    this.Branch();
                }
                break;
            case 208:
                //BNE();
                if ((this._statusRegister & 2) !== 2) {
                    this.Branch();
                }
                break;
            case 16:
                //BPL();
                if ((this._statusRegister & 128) !== 128) {
                    this.Branch();
                }
                break;
            case 0:
                //BRK();
                //BRK causes a non-maskable interrupt and increments the program counter by one. 
                //Therefore an RTI will go to the address of the BRK +2 so that BRK may be used to replace a two-byte instruction 
                // for debugging and the subsequent RTI will be correct. 
                // push pc onto stack (high byte first)
                this._programCounter = this._programCounter + 1;
                this.PushStack(this._programCounter >> 8 & 0xFF);
                this.PushStack(this._programCounter & 0xFF);
                // push sr onto stack
                //PHP and BRK push the current status with bits 4 and 5 set on the stack; 
                data = this._statusRegister | 16 | 32;
                this.PushStack(data);
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
                    this.Branch();
                }
                break;
            case 112:
                //BVS();
                if ((this._statusRegister & 64) === 64) {
                    this.Branch();
                }
                break;
            case 24:
                //CLC();
                this.SetFlag(this.SRMasks_CarryMask, false);
                break;
            case 216:
                //CLD();
                this.SetFlag(this.SRMasks_DecimalModeMask, false);
                break;
            case 88:
                //CLI();
                this.SetFlag(this.SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                //CLV();
                this.SetFlag(this.SRMasks_OverflowMask, false);
                break;
            case 201:
            case 197:
            case 213:
            case 205:
            case 221:
            case 217:
            case 193:
            case 209:
                //CMP();
                data = (this._accumulator + 256 - this.DecodeOperand());
                this.Compare(data);
                break;
            case 224:
            case 228:
            case 236:
                //CPX();
                data = (this._indexRegisterX + 256 - this.DecodeOperand());
                this.Compare(data);
                break;
            case 192:
            case 196:
            case 204:
                //CPY();
                data = (this._indexRegisterY + 256 - this.DecodeOperand());
                this.Compare(data);
                break;
            case 198:
            case 214:
            case 206:
            case 222:
                //DEC();
                data = this.DecodeOperand();
                data = (data - 1) & 0xFF;
                this.SetByte(this.DecodeAddress(), data);
                this.SetZNFlags(data);
                break;
            case 202:
                //DEX();
                this._indexRegisterX = this._indexRegisterX - 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 136:
                //DEY();
                this._indexRegisterY = this._indexRegisterY - 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.SetZNFlags(this._indexRegisterY);
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
                this._accumulator = (this._accumulator ^ this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
                break;
            case 230:
            case 246:
            case 238:
            case 254:
                //INC();
                data = this.DecodeOperand();
                data = (data + 1) & 0xFF;
                this.SetByte(this.DecodeAddress(), data);
                this.SetZNFlags(data);
                break;
            case 232:
                //INX();
                this._indexRegisterX = this._indexRegisterX + 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 200:
                this._indexRegisterY = this._indexRegisterY + 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.SetZNFlags(this._indexRegisterY);
                break;
            case 76:
            case 108:
                // JMP();
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this._programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                } else {
                    this._programCounter = this.DecodeAddress();
                }
                break;
            case 32:
                //JSR();
                this.PushStack((this._programCounter >> 8) & 0xFF);
                this.PushStack((this._programCounter - 1) & 0xFF);
                this._programCounter = this.DecodeAddress();
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
                this._accumulator = this.DecodeOperand();
                this.SetZNFlags(this._accumulator);
                break;
            case 162:
            case 166:
            case 182:
            case 174:
            case 190:
                //LDX();
                this._indexRegisterX = this.DecodeOperand();
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 160:
            case 164:
            case 180:
            case 172:
            case 188:
                //LDY();
                this._indexRegisterY = this.DecodeOperand();
                this.SetZNFlags(this._indexRegisterY);
                break;
            case 74:
            case 70:
            case 86:
            case 78:
            case 94:
                //LSR();
                data = this.DecodeOperand();
                //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 
                this.SetFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                data = data >> 1 & 0xFF;
                this.SetZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte(this.DecodeAddress(), data);
                }
                break;
            case 234:
            case 26:
            case 58:
            case 90:
            case 122:
            case 218:
            case 250:
            case 137:
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
                    this.DecodeAddress();
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
                this._accumulator = (this._accumulator | this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
                break;
            case 72:
                //PHA();
                this.PushStack(this._accumulator);
                break;
            case 8:
                //PHP();
                data = this._statusRegister | 16 | 32;
                this.PushStack(data);
                break;
            case 104:
                //PLA();
                this._accumulator = this.PopStack();
                this.SetZNFlags(this._accumulator);
                break;
            case 40:
                //PLP();
                this._statusRegister = this.PopStack(); // | 0x20;
                break;
            case 42:
            case 38:
            case 54:
            case 46:
            case 62:
                //ROL();
                data = this.DecodeOperand();
                // old carry bit shifted into bit 1
                oldbit = (this._statusRegister & 1) === 1 ? 1 : 0;
                this.SetFlag(this.SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.SetZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte(this.DecodeAddress(), data);
                }
                break;
            case 106:
            case 102:
            case 118:
            case 110:
            case 126:
                //ROR();
                data = this.DecodeOperand();
                // old carry bit shifted into bit 7
                oldbit = (this._statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.SetFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.SetZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte(this.DecodeAddress(), data);
                }
                break;
            case 64:
                //RTI();
                this._statusRegister = this.PopStack(); // | 0x20;
                lowByte = this.PopStack();
                highByte = this.PopStack();
                this._programCounter = ((highByte << 8) | lowByte);
                break;
            case 96:
                //RTS();
                lowByte = (this.PopStack() + 1) & 0xFF;
                highByte = this.PopStack();
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
                data = this.DecodeOperand() & 4095;
                carryFlag = ((this._statusRegister ^ 1) & 1);
                result = (((this._accumulator - data) & 4095) - carryFlag) & 4095;
                // set overflow flag if sign bit of accumulator changed
                this.SetFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ result) & 128) === 128 && ((this._accumulator ^ data) & 128) === 128);
                this.SetFlag(this.SRMasks_CarryMask, (result < 256));
                this._accumulator = (result) & 0xFF;
                this.SetZNFlags(this._accumulator);
                break;
            case 56:
                //SEC();
                this.SetFlag(this.SRMasks_CarryMask, true);
                break;
            case 248:
                //SED();
                this.SetFlag(this.SRMasks_DecimalModeMask, true);
                break;
            case 120:
                //SEI();
                this.SetFlag(this.SRMasks_InterruptDisableMask, true);
                break;
            case 133:
            case 149:
            case 141:
            case 157:
            case 153:
            case 129:
            case 145:
                //STA();
                this.SetByte(this.DecodeAddress(), this._accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.SetByte(this.DecodeAddress(), this._indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.SetByte(this.DecodeAddress(), this._indexRegisterY);
                break;
            case 170:
                //TAX();
                this._indexRegisterX = this._accumulator;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 168:
                //TAY();
                this._indexRegisterY = this._accumulator;
                this.SetZNFlags(this._indexRegisterY);
                break;
            case 186:
                //TSX();
                this._indexRegisterX = this._stackPointer;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 138:
                //TXA();
                this._accumulator = this._indexRegisterX;
                this.SetZNFlags(this._accumulator);
                break;
            case 154:
                //TXS();
                this._stackPointer = this._indexRegisterX;
                break;
            case 152:
                //TYA();
                this._accumulator = this._indexRegisterY;
                this.SetZNFlags(this._accumulator);
                break;
            case 11:
            case 43:
                //AAC();
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this._accumulator = this.DecodeOperand() & this._accumulator & 0xFF;
                this.SetFlag(this.SRMasks_CarryMask, (this._accumulator & 128) === 128);
                this.SetZNFlags(this._accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this._accumulator = this.DecodeOperand() & this._accumulator;
                this.SetFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                this._accumulator = this._accumulator >> 1;
                this.SetZNFlags(this._accumulator);
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
                this._accumulator = this.DecodeOperand() & this._accumulator;
                if ((this._statusRegister & 1) === 1) {
                    this._accumulator = (this._accumulator >> 1) | 128;
                } else {
                    this._accumulator = (this._accumulator >> 1);
                }
                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 
                this.SetFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                switch (this._accumulator & 48) {
                    case 48:
                        this.SetFlag(this.SRMasks_CarryMask, true);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 0:
                        this.SetFlag(this.SRMasks_CarryMask, false);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 16:
                        this.SetFlag(this.SRMasks_CarryMask, false);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                    case 32:
                        this.SetFlag(this.SRMasks_CarryMask, true);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                }
                break;
            case 171:
                //ATX();
                //AND byte with accumulator, then transfer accumulator to X register.
                //Status flags: N,Z
                this._indexRegisterX = (this._accumulator = this.DecodeOperand() & this._accumulator);
                this.SetZNFlags(this._indexRegisterX);
                break;
        }        
    }

    SetZNFlags(data: number): void {
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

    Compare(data: number): void {
        this.SetFlag(this.SRMasks_CarryMask, data > 255);
        this.SetZNFlags(data & 255);
    }

    Branch(): void {
        this._currentInstruction_ExtraTiming = 1;
        var addr = this._currentInstruction_Parameters0 & 255;
        if ((addr & 128) === 128) {
            addr = addr - 256;
            this._programCounter += addr;
        } else {
            this._programCounter += addr;
        }

        if ((this._programCounter & 255) < addr) {
            this._currentInstruction_ExtraTiming = 2;
        }
    }

    NMIHandler(): void {
        this._handleNMI = true;
    }

    IRQUpdater(): void {
        this._handleIRQ = this.SoundBopper.ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted || this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted;
    }

    LoadBytes(offset: number, bytes: number[]): void {
        throw new Error('Method not implemented.');
    }

    LoadBytes$1(offset: number, bytes: number[], length: number): void {
        throw new Error('Method not implemented.');
    }

    private PushStack(data: number): void {
        this.Rams[this._stackPointer + 256] = data;
        this._stackPointer--;
        if (this._stackPointer < 0) {
            this._stackPointer = 255;
        }
    }

    private PopStack(): number {
        this._stackPointer++;
        if (this._stackPointer > 255) {
            this._stackPointer = 0;
        }
        return this.Rams[this._stackPointer + 256];
    }

    GetByte(address: number): number {
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
                result = this.PPU_GetByte(this.clock, address);
                break;
            case 16384:
                switch (address) {
                    case 16406:
                        result = this._padOne.GetByte(this.clock, address);
                        break;
                    case 16407:
                        //result = _padTwo.GetByte(clock, address);
                        break;
                    case 16405:
                        result = this.SoundBopper.ChiChiNES$IClockedMemoryMappedIOElement$GetByte(this.clock, address);
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
                result = this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$GetByte(this.clock, address);
                break;
            default:
                throw new System.Exception("Bullshit!");
        }
        //if (_cheating && memoryPatches.ContainsKey(address))
        //{

        //    return memoryPatches[address].Activated ? memoryPatches[address].GetData(result) & 0xFF : result & 0xFF;
        //}

        return result & 255;        
    }

    PeekByte(address: number): number {
        throw new Error('Method not implemented.');
    }
    PeekBytes(start: number, finish: number): number[] {
        throw new Error('Method not implemented.');
    }

    SetByte(address: number, data: number): void {
        // check high byte, find appropriate handler
        if (address < 2048) {
            this.Rams[address & 2047] = data ;
            return;
        }
        switch (address & 61440) {
            case 0:
            case 4096:
                // nes sram
                this.Rams[address & 2047] = data;
                break;
            case 20480:
                this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(this.clock, address, data);
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
                // cart rom banks
                this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(this.clock, address, data);
                break;
            case 8192:
            case 12288:
                this.PPU_SetByte(this.clock, address, data);
                break;
            case 16384:
                switch (address) {
                    case 16384:
                    case 16385:
                    case 16386:
                    case 16387:
                    case 16388:
                    case 16389:
                    case 16390:
                    case 16391:
                    case 16392:
                    case 16393:
                    case 16394:
                    case 16395:
                    case 16396:
                    case 16397:
                    case 16398:
                    case 16399:
                    case 16405:
                    case 16407:
                        this.SoundBopper.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(this.clock, address, data);
                        break;
                    case 16404:
                        this.PPU_CopySprites(data * 256);
                        this._currentInstruction_ExtraTiming = this._currentInstruction_ExtraTiming + 512;
                        break;
                    case 16406:
                        this._padOne.SetByte(this.clock, address, data & 1);
                        //  _padTwo.SetByte(clock, address, data & 1);
                        break;
                }
                break;
        }
    }

    FindNextEvent(): void {
        // it'll either be the ppu's NMI, or an irq from either the apu or the cart
        this.nextEvent = this.clock + this.PPU_NextEventAt;
    }
    HandleNextEvent(): void {
        this.PPU_HandleEvent(this.clock);
        this.FindNextEvent();
    }
    ResetInstructionHistory(): void {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 255;
    }

    WriteInstructionHistoryAndUsage(): void {
        const inst : ChiChiInstruction = new ChiChiInstruction();
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
    FireDebugEvent(s: string): void {
        throw new Error('Method not implemented.');
    }
    PeekInstruction(address: number): ChiChiInstruction {
        throw new Error('Method not implemented.');
    }
    PPU_Initialize(): void {
        this._PPUAddress = 0;
        this._PPUStatus = 0;
        this._PPUControlByte0 = 0;
        this._PPUControlByte1 = 0;
        this._hScroll = 0;
        this._vScroll = 0;
        this.scanlineNum = 0;
        this.scanlinePos = 0;
        this._spriteAddress = 0;
    }
    PPU_WriteState(writer: System.Collections.Generic.Queue$1<number>): void {
        throw new Error('Method not implemented.');
    }
    PPU_ReadState(state: System.Collections.Generic.Queue$1<number>): void {
        throw new Error('Method not implemented.');
    }

    get PPU_NMIIsThrown(): boolean {
        return(this._PPUControlByte0 & 128) === 128;
    }
    
    PPU_SetupVINT(): void {
        this._PPUStatus = this._PPUStatus | 128;
        this.NMIHasBeenThrownThisFrame = false;
        // HandleVBlankIRQ = true;
        this._frames = this._frames + 1;
        //isRendering = false;

        if (this.PPU_NMIIsThrown) {
            this.NMIHandler();
            this.PPU_HandleVBlankIRQ = true;
            this.NMIHasBeenThrownThisFrame = true;
        }        
    }
    PPU_VidRAM_GetNTByte(address: number): number {
        let result = 0;
        if (address >= 8192 && address < 12288) {

            result = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, address);

        } else {
            result = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, address);
        }
        return result;
    }
    UpdatePPUControlByte0(): void {
        if ((this._PPUControlByte0 & 16)) {
            this._backgroundPatternTableIndex = 4096;
        } else {
            this._backgroundPatternTableIndex = 0;
        }
    }
    PPU_SetByte(Clock: number, address: number, data: number): void {
        // DrawTo(Clock);
        //if (_isDebugging)
        //{
        //    Events.Enqueue(new PPUWriteEvent { IsWrite = true, DataWritten = data, FrameClock = frameClock, RegisterAffected = address, ScanlineNum = frameClock / 341, ScanlinePos = frameClock % 341 });
        //}
        //Writable 2C02 registers
        //-----------------------

        //4 	-	returns object attribute memory 
        //      location indexed by port 3, then increments port 3.

        //6	    -	PPU address port to access with port 7.

        //7	    -	PPU memory write port.


        switch (address & 7) {
            case 0:
                this.DrawTo(Clock);
                this._PPUControlByte0 = data;
                this._openBus = data;
                this.nameTableBits = this._PPUControlByte0 & 3;
                this._backgroundPatternTableIndex = ((this._PPUControlByte0 & 16) >> 4) * 4096;
                // if we toggle /vbl we can throw multiple NMIs in a vblank period
                //if ((data & 0x80) == 0x80 && NMIHasBeenThrownThisFrame)
                //{
                //     NMIHasBeenThrownThisFrame = false;
                //}
                //UpdatePixelInfo();
                this.nameTableMemoryStart = this.nameTableBits * 1024;
                break;
            case 1:
                //1	    0	disable composite colorburst (when 1). Effectively causes gfx to go black & white.
                //      1	left side screen column (8 pixels wide) playfield clipping (when 0).
                //      2	left side screen column (8 pixels wide) object clipping (when 0).
                //      3	enable playfield display (on 1).
                //      4	enable objects display (on 1).
                //      5	R (to be documented)
                //      6	G (to be documented)
                //      7	B (to be documented)
                this.DrawTo(Clock);
                this.isRendering = (data & 24) !== 0;
                this._PPUControlByte1 = data;
                this._spritesAreVisible = (this._PPUControlByte1 & 16) === 16;
                this._tilesAreVisible = (this._PPUControlByte1 & 8) === 8;
                this._clipTiles = (this._PPUControlByte1 & 2) !== 2;
                this._clipSprites = (this._PPUControlByte1 & 4) !== 4;
                //UpdatePixelInfo();
                this.nameTableMemoryStart = this.nameTableBits * 1024;
                break;
            case 2:
                this.ppuReadBuffer = data;
                this._openBus = data;
                break;
            case 3:
                //3	    -	internal object attribute memory index pointer 
                //          (64 attributes, 32 bits each, byte granular access). 
                //          stored value post-increments on access to port 4.
                this._spriteAddress = data & 255;
                this._openBus = this._spriteAddress;
                break;
            case 4:
                this.spriteRAM[this._spriteAddress] = data;
                // UnpackSprite(_spriteAddress / 4);
                this._spriteAddress = (this._spriteAddress + 1) & 255;
                this.unpackedSprites[this._spriteAddress >> 2].Changed = true;
                this.spriteChanges = true;
                break;
            case 5:
                //5	    -	scroll offset port.
                // on 1st read (high), bits 0,1,2 go to fine horizonal scroll, rest to select tile
                // on 2nd read, bits 0,1,2 go to fine vertical scroll, rest to select tile
                // during render, writes to FH are applied immediately
                if (this.PPUAddressLatchIsHigh) {
                    //if (isRendering)
                    //{
                    //    fineHorizontalScroll = data & 0x7;
                    //    horizontalTileIndex = data >> 3;
                    //}  
                    this.DrawTo(Clock);
                    this._hScroll = data;

                    this.lockedHScroll = this._hScroll & 7;
                    this.UpdatePixelInfo();

                    this.PPUAddressLatchIsHigh = false;
                } else {
                    // during rendering, a write here will not post to the rendering counter
                    this.DrawTo(Clock);
                    this._vScroll = data;
                    if (data > 240) {
                        this._vScroll = data - 256;
                    }

                    if (!this.frameOn || (this.frameOn && !this.isRendering)) {
                        this.lockedVScroll = this._vScroll;
                    }

                    this.PPUAddressLatchIsHigh = true;
                    this.UpdatePixelInfo();

                }
                break;
            case 6:
                //Since the PPU's external address bus is only 14 bits in width, 
                //the top two bits of the value written are ignored. 
                if (this.PPUAddressLatchIsHigh) {
                    //            //a) Write upper address byte into $2006
                    this._PPUAddress = (this._PPUAddress & 255) | ((data & 63) << 8);
                    this.PPUAddressLatchIsHigh = false;
                } else {
                    //            //b) Write lower address byte into $2006
                    this._PPUAddress = (this._PPUAddress & 32512) | data & 255;
                    this.PPUAddressLatchIsHigh = true;

                    // writes here during rendering directly affect the scroll counter
                    // from Marat Fazulamans doc

                    //Address Written into $2006
                    //xxYYSSYYYYYXXXXX
                    //   | |  |     |
                    //   | |  |     +---- Horizontal scroll in tiles (i.e. 1 = 8 pixels)
                    //   | |  +--------- Vertical scroll in tiles (i.e. 1 = 8 pixels)
                    //   | +------------ Number of Name Table ($2000,$2400,$2800,$2C00)
                    //   +-------------- Additional vertical scroll in pixels (0..3)

                    // on second write during frame, loopy t (_hscroll, _vscroll) is copied to loopy_v (lockedHscroll, lockedVScroll)

                    this.DrawTo(Clock);
                    this._hScroll = ((this._PPUAddress & 31) << 3); // +(currentXPosition & 7);
                    this._vScroll = (((this._PPUAddress >> 5) & 31) << 3);
                    this._vScroll |= ((this._PPUAddress >> 12) & 3);

                    this.nameTableBits = ((this._PPUAddress >> 10) & 3);
                    if (this.frameOn) {

                        this.lockedHScroll = this._hScroll;
                        this.lockedVScroll = this._vScroll;
                        this.lockedVScroll = this.lockedVScroll - this.currentYPosition;
                    }
                    this.UpdatePixelInfo();
                    // relock vscroll during render when this happens
                }
                break;
            case 7:
                //            //Writing to PPU memory:
                //            //c) Write data into $2007. After each write, the
                //            //   address will increment either by 1 (bit 2 of
                //            //   $2000 is 0) or by 32 (bit 2 of $2000 is 1).
                // ppuLatch = data;
                if ((this._PPUAddress & 65280) === 16128) {
                    this.DrawTo(Clock);
                    //WriteToNESPalette(_PPUAddress, (byte)data);
                    var palAddress = (this._PPUAddress) & 31;
                    this._palette[palAddress] = data;
                    // rgb32OutBuffer[255 * 256 + palAddress] = data;
                    if ((this._PPUAddress & 65519) === 16128) {
                        this._palette[(palAddress ^ 16) & 31] = data;
                        // rgb32OutBuffer[255 * 256 + palAddress ^ 0x10] = data;
                    }
                    // these palettes are all mirrored every 0x10 bytes
                    this.UpdatePixelInfo();

                    // _vidRAM[_PPUAddress ^ 0x1000] = (byte)data;
                } else {
                    // if its a nametable byte, mask it according to current mirroring
                    if ((this._PPUAddress & 61440) === 8192) {
                        this.chrRomHandler.ChiChiNES$INESCart$SetPPUByte(Clock, this._PPUAddress, data);
                    } else {
                        if (this.vidRamIsRam) {
                            this.chrRomHandler.ChiChiNES$INESCart$SetPPUByte(Clock, this._PPUAddress, data);
                        }
                    }
                }
                // if controlbyte0.4, set ppuaddress + 32, else inc
                if ((this._PPUControlByte0 & 4) === 4) {
                    this._PPUAddress = (this._PPUAddress + 32);
                } else {
                    this._PPUAddress = (this._PPUAddress + 1);
                }
                // reset the flag which makex xxx6 set the high byte of address
                this.PPUAddressLatchIsHigh = true;
                this._PPUAddress = (this._PPUAddress & 16383);
                break;
        }
    }
    PPU_GetByte(Clock: number, address: number): number {
        //if (_isDebugging)
        //{
        //    Events.Enqueue(new PPUWriteEvent { IsWrite = false, DataWritten = 0, FrameClock = frameClock, RegisterAffected = address, ScanlineNum = frameClock / 341, ScanlinePos = frameClock % 341 });
        //}

        switch (address & 7) {
            case 3:
            case 0:
            case 1:
            case 5:
            case 6:
                return 0;
               // return this._openBus;
            case 2:
                var ret;
                this.PPUAddressLatchIsHigh = true;
                // bit 7 is set to 0 after a read occurs
                // return lower 5 latched bits, and the status
                ret = (this.ppuReadBuffer & 31) | this._PPUStatus;

                this.DrawTo(Clock);
                if ((ret & 0x80) === 0x80) {


                    this._PPUStatus = this._PPUStatus & ~0x80;

                }
                this.UpdatePixelInfo();
                //}
                //this._openBus = ret;
                return ret;
            case 4:
                var tmp = this.spriteRAM[this._spriteAddress];
                //ppuLatch = spriteRAM[SpriteAddress];
                // should not increment on read ?
                //SpriteAddress = (SpriteAddress + 1) & 0xFF;
                //this._openBus = tmp;
                return tmp;
            case 7:

                // palette reads shouldn't be buffered like regular vram reads, they re internal
                if ((this._PPUAddress & 65280) === 16128) {
                    // these palettes are all mirrored every 0x10 bytes
                    tmp = this._palette[this._PPUAddress & 31];
                    // palette read should also read vram into read buffer

                    // info i found on the nesdev forums

                    // When you read PPU $3F00-$3FFF, you get immediate data from Palette RAM 
                    // (without the 1-read delay usually present when reading from VRAM) and the PPU 
                    // will also fetch nametable data from the corresponding address (which is mirrored from PPU $2F00-$2FFF). 

                    // note: writes do not work this way 
                    this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress - 4096);
                } else {
                    tmp = this.ppuReadBuffer;
                    if (this._PPUAddress >= 0x2000 && this._PPUAddress <= 0x2FFF) {
                        this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress);
                    } else {
                        this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress & 16383);
                    }
                }
                if ((this._PPUControlByte0 & 4) === 4) {
                    this._PPUAddress = this._PPUAddress + 32;
                } else {
                    this._PPUAddress = this._PPUAddress + 1;
                }
                this._PPUAddress = (this._PPUAddress & 16383);
                return tmp;
        }
        //throw new NotImplementedException(string.Format("PPU.GetByte() recieved invalid address {0,4:x}", address));
        return 0;
    }
    PPU_HandleEvent(Clock: number): void {
        this.DrawTo(Clock);
    }
    PPU_ResetClock(Clock: number): void {
        this.LastcpuClock = Clock;
    }
    PPU_CopySprites(copyFrom: number): void {

        // should copy 0x100 items from source to spriteRAM, 
        // starting at SpriteAddress, and wrapping around
        // should set spriteDMA flag
        for (var i = 0; i < 256; ++i) {
            var spriteLocation = (this._spriteAddress + i) & 255;
            if (this.spriteRAM[spriteLocation] !== this.Rams[copyFrom + i]) {
                this.spriteRAM[spriteLocation] = this.Rams[copyFrom + i];
                this.unpackedSprites[(spriteLocation >> 2) & 255].Changed = true;
            }
        }
        this._spriteCopyHasHappened = true;
        this.spriteChanges = true;
    }
    PPU_InitSprites(): void {
        this.currentSprites = new Array < ChiChiSprite>(this._maxSpritesPerScanline); //ChiChiSprite;
        for (let i = 0; i < this._maxSpritesPerScanline; ++i) {
            this.currentSprites[i] = new ChiChiSprite();
        }

        this.unpackedSprites = new Array<ChiChiSprite>(64);

        for (let i = 0; i < 64; ++i) {
            this.unpackedSprites[i] = new ChiChiSprite();
        }

    }
    PPU_GetSpritePixel(): number {
        this.isForegroundPixel = false;
        this.spriteZeroHit = false;
        var result = 0;
        var yLine = 0;
        var xPos = 0;
        var tileIndex = 0;

        for (var i = 0; i < this.spritesOnThisScanline; ++i) {
            var currSprite = this.currentSprites[i];
            if (currSprite.XPosition > 0 && this.currentXPosition >= currSprite.XPosition && this.currentXPosition < currSprite.XPosition + 8) {

                var spritePatternTable = 0;
                if ((this._PPUControlByte0 & 8) === 8) {
                    spritePatternTable = 4096;
                }
                xPos = this.currentXPosition - currSprite.XPosition;
                yLine = this.currentYPosition - currSprite.YPosition - 1;

                yLine = yLine & (this.spriteSize - 1);

                tileIndex = currSprite.TileIndex;

                if ((this._PPUControlByte0 & 32) === 32) {
                    if ((tileIndex & 1) === 1) {
                        spritePatternTable = 4096;
                        tileIndex = tileIndex ^ 1;
                    } else {
                        spritePatternTable = 0;
                    }
                }

                //result = WhissaSpritePixel(spritePatternTable, xPos, yLine, ref currSprite, tileIndex);
                // 8x8 tile
                var patternEntry;
                var patternEntryBit2;

                if (currSprite.FlipY) {
                    yLine = this.spriteSize - yLine - 1;
                }

                if (yLine >= 8) {
                    yLine += 8;
                }

                patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine);
                patternEntryBit2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine + 8);

                result = (currSprite.FlipX ? ((patternEntry >> xPos) & 1) | (((patternEntryBit2 >> xPos) << 1) & 2) : ((patternEntry >> 7 - xPos) & 1) | (((patternEntryBit2 >> 7 - xPos) << 1) & 2)) & 255;

                if (result !== 0) {
                    if (currSprite.SpriteNumber === 0) {
                        this.spriteZeroHit = true;
                    }
                    this.isForegroundPixel = currSprite.Foreground;
                    return (result | currSprite.AttributeByte);
                }
            }
        }
        return 0;        
    }
    PPU_WhissaSpritePixel(patternTableIndex: number, x: number, y: number, sprite: { v: ChiChiSprite; }, tileIndex: number): number {
        // 8x8 tile
        let patternEntry = 0;
        let patternEntryBit2 = 0;

        if (sprite.v.FlipY) {
            y = this.spriteSize - y - 1;
        }

        if (y >= 8) {
            y += 8;
        }

        patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternTableIndex + tileIndex * 16 + y);
        patternEntryBit2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternTableIndex + tileIndex * 16 + y + 8);

        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    }
    PPU_PreloadSprites(scanline: number): void {
        this.spritesOnThisScanline = 0;
        this.sprite0scanline = -1;

        var yLine = this.currentYPosition - 1;
        this.outBuffer[(64768) + yLine] = 0;
        this.outBuffer[(65024) + yLine] = 0;
        //spritesOnLine[2 * yLine] = 0;
        //spritesOnLine[2 * yLine + 1] = 0;
        for (var spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            var spriteID = ((spriteNum + this._spriteAddress) & 255) >> 2;

            var y = this.unpackedSprites[spriteID].YPosition + 1;

            if (scanline >= y && scanline < y + this.spriteSize) {
                if (spriteID === 0) {
                    this.sprite0scanline = scanline;
                    this.sprite0x = this.unpackedSprites[spriteID].XPosition;
                }

                var spId = spriteNum >> 2;
                if (spId < 32) {
                    this.outBuffer[(64768) + yLine] |= 1 << spId;
                } else {
                    this.outBuffer[(65024) + yLine] |= 1 << (spId - 32);
                }

                this.currentSprites[this.spritesOnThisScanline] = this.unpackedSprites[spriteID];
                this.currentSprites[this.spritesOnThisScanline].IsVisible = true;

                this.spritesOnThisScanline++;
                if (this.spritesOnThisScanline === this._maxSpritesPerScanline) {
                    break;
                }
            }
        }
        if (this.spritesOnThisScanline > 7) {
            this._PPUStatus = this._PPUStatus | 32;
        }

    }
    PPU_UnpackSprites(): void {
        //Buffer.BlockCopy
        var outBufferloc = 65280;
        for (var i = 0; i < 256; i += 4) {
            this.outBuffer[outBufferloc] = (this.spriteRAM[i] << 24) | (this.spriteRAM[i + 1] << 16) | (this.spriteRAM[i + 2] << 8) | (this.spriteRAM[i + 3] << 0);
            outBufferloc++;
        }
        // Array.Copy(spriteRAM, 0, outBuffer, 255 * 256 * 4, 256);
        for (var currSprite = 0; currSprite < this.unpackedSprites.length; ++currSprite) {
            if (this.unpackedSprites[currSprite].Changed) {
                this.UnpackSprite(currSprite);
            }
        }
    }
    UnpackSprite(currSprite: number): void {
        const attrByte = this.spriteRAM[(currSprite << 2) + 2 | 0];
        this.unpackedSprites[currSprite].IsVisible = true;
        this.unpackedSprites[currSprite].AttributeByte = ((attrByte & 3) << 2) | 16;
        this.unpackedSprites[currSprite].YPosition = this.spriteRAM[currSprite * 4];
        this.unpackedSprites[currSprite].XPosition = this.spriteRAM[currSprite * 4 + 3];
        this.unpackedSprites[currSprite].SpriteNumber = currSprite;
        this.unpackedSprites[currSprite].Foreground = (attrByte & 32) !== 32;
        this.unpackedSprites[currSprite].FlipX = (attrByte & 64) === 64;
        this.unpackedSprites[currSprite].FlipY = (attrByte & 128) === 128;
        this.unpackedSprites[currSprite].TileIndex = this.spriteRAM[currSprite * 4 + 1];
        this.unpackedSprites[currSprite].Changed = false;
    }
    PPU_GetNameTablePixel(): number {
        var result = ((this.patternEntry & 128) >> 7) | ((this.patternEntryByte2 & 128) >> 6);
        this.patternEntry <<= 1;
        this.patternEntryByte2 <<= 1;
        if (result > 0) {
            result |= this.currentAttributeByte;
        }
        return result & 255;
    }
    FetchNextTile(): void {
        let ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;

        let xTilePosition = this.xPosition >> 3;

        let tileRow = (this.yPosition >> 3) % 30 << 5;

        let tileNametablePosition = 8192 + ppuNameTableMemoryStart + xTilePosition + tileRow;

        let TileIndex = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, tileNametablePosition);

        let patternTableYOffset = this.yPosition & 7;

        let patternID = this._backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;

        this.patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID);
        this.patternEntryByte2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID + 8);

        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
    }

    GetNameTablePixelOld(): number {
        throw new Error('Method not implemented.');
    }

    GetAttributeTableEntry(ppuNameTableMemoryStart: number, i: number, j: number): number {
        let LookUp = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, 8192 + ppuNameTableMemoryStart + 960 + (i >> 2) + ((j >> 2) * 8));

        switch ((i & 2) | (j & 2) * 2) {
            case 0:
                return (LookUp << 2) & 12;
            case 2:
                return LookUp & 12;
            case 4:
                return (LookUp >> 2) & 12;
            case 6:
                return (LookUp >> 4) & 12;
        }
        return 0;
    }

    DrawTo(cpuClockNum: number): void {
        let frClock = (cpuClockNum - this.LastcpuClock) * 3;

        if (this.frameClock < 6820) {
            // if the frameclock +frClock is in vblank (< 6820) dont do nothing, just update it
            if (this.frameClock + frClock < 6820) {
                this.frameClock += frClock;
                frClock = 0;
            } else {
                //find number of pixels to draw since frame start
                frClock += this.frameClock - 6820;
                this.frameClock = 6820;
            }
        }
        for (var i = 0; i < frClock; ++i) {
            switch (this.frameClock++) {
                case 0:
                    //frameFinished();
                    break;
                case 6820:
                    //PPU_ClearVINT();
                    this._PPUStatus = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this._PPUControlByte0 & 32) === 32) ? 16 : 8;
                    if ((this._PPUControlByte1 & 24) !== 0) {
                        this.isRendering = true;
                    }
                    this.frameOn = true;
                    this.chrRomHandler.ChiChiNES$INESCart$ResetBankStartCache();
                    // setFrameOn();
                    if (this.spriteChanges) {
                        this.PPU_UnpackSprites();
                        this.spriteChanges = false;
                    }
                    break;
                case 7161:
                    //lockedVScroll = _vScroll;
                    this.vbufLocation = 0;
                    //curBufPos = bufStart;
                    this.xNTXor = 0;
                    this.yNTXor = 0;
                    this.currentXPosition = 0;
                    this.currentYPosition = 0;
                    break;
                case ChiChiNES.CPU2A03.frameClockEnd:
                    this.shouldRender = true;
                    //__frameFinished = true;
                    this.frameFinished();
                    this.PPU_SetupVINT();
                    this.frameOn = false;
                    this.frameClock = 0;
                    //if (_isDebugging)
                    //    events.Clear();
                    break;
            }

            if (this.frameClock >= 7161 && this.frameClock <= 89342) {


                if (this.currentXPosition < 256 && this.vbufLocation < 61440) {
                    /* update x position */
                    this.xPosition = this.currentXPosition + this.lockedHScroll;


                    if ((this.xPosition & 7) === 0) {
                        this.xNTXor = ((this.xPosition & 256) === 256) ? 1024 : 0;
                        this.xPosition &= 255;

                        /* fetch next tile */
                        let ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;

                        let  xTilePosition = this.xPosition >> 3;

                        //int tileRow = (yPosition >> 3) % 30 << 5;

                        //int tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;

                        let  TileIndex = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, 8192 + ppuNameTableMemoryStart + xTilePosition + ((this.yPosition >> 3) % 30 << 5));

                        let  patternTableYOffset = this.yPosition & 7;

                        let  patternID = this._backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;

                        this.patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID);
                        this.patternEntryByte2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID + 8);

                        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                        /* end fetch next tile */

                    }

                    /* draw pixel */
                    const tilePixel = this._tilesAreVisible ? this.PPU_GetNameTablePixel() : 0;
                    // bool foregroundPixel = isForegroundPixel;
                    const spritePixel = this._spritesAreVisible ? this.PPU_GetSpritePixel() : 0;

                    if (!this.hitSprite && this.spriteZeroHit && tilePixel !== 0) {
                        this.hitSprite = true;
                        this._PPUStatus = this._PPUStatus | 64;
                    }

                    //var x = pal[_palette[(foregroundPixel || (tilePixel == 0 && spritePixel != 0)) ? spritePixel : tilePixel]];
                    //var x = 

                    this.byteOutBuffer[this.vbufLocation * 4] = this._palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
                    //byteOutBuffer[(vbufLocation * 4) + 1] = x;// (byte)(x >> 8);
                    //byteOutBuffer[(vbufLocation * 4) + 2] = x;//  (byte)(x >> 16);
                    //byteOutBuffer[(vbufLocation * 4) + 3] = 0xFF;// (byte)(x);// (byte)rgb32OutBuffer[vbufLocation];

                    this.vbufLocation++;
                }
                if (this.currentXPosition === 256) {
                    this.chrRomHandler.ChiChiNES$INESCart$UpdateScanlineCounter();
                }
                this.currentXPosition++;

                if (this.currentXPosition > 340) {

                    this.currentXPosition = 0;
                    this.currentYPosition++;

                    this.PPU_PreloadSprites(this.currentYPosition);
                    if (this.spritesOnThisScanline >= 7) {
                        this._PPUStatus = this._PPUStatus | 32;
                    }

                    this.lockedHScroll = this._hScroll;

                    this.UpdatePixelInfo();

                    //PPU_RunNewScanlineEvents 
                    this.yPosition = this.currentYPosition + this.lockedVScroll;

                    if (this.yPosition < 0) {
                        this.yPosition += 240;
                    }
                    if (this.yPosition >= 240) {
                        this.yPosition -= 240;
                        this.yNTXor = 2048;
                    } else {
                        this.yNTXor = 0;
                    }


                }

            }

        }
        this.LastcpuClock = cpuClockNum;        
    }

    UpdatePixelInfo(): void {
        this.nameTableMemoryStart = this.nameTableBits * 1024;
    }

    GetStatus() : any {
        return {
            PC: this._programCounter,
            A: this._accumulator,
            X: this._indexRegisterX,
            Y: this._indexRegisterY,
            SP: this._stackPointer,
            SR: this._statusRegister
        }
    }
}