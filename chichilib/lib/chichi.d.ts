export class iNESFileHandler {
    static LoadROM(ppu: ChiChiCPPU, thefile: number[]): BaseCart;
}


export class BaseCart {
    // compatible with .net array.copy method
    // shared components
    static arrayCopy(src: number[], spos: number, dest: number[], dpos: number, len: number): void;
    prgRomBank6: Uint8Array;
    ppuBankStarts: Uint32Array;
    bankStartCache: Uint32Array;

    nesCart: Uint8Array;
    chrRom: Uint8Array;

    current8: number;
    currentA: number;
    currentC: number;
    currentE: number;

    SRAMCanWrite: boolean;
    SRAMEnabled: boolean;
    prgRomCount: number;
    chrRomOffset: number;
    chrRamStart: number;
    chrRomCount: number;
    mapperId: number;

    bank8start: number;
    bankAstart: number;
    bankCstart: number;
    bankEstart: number;

    checkSum: any;
    updateIRQ: () => void;

    bankSwitchesChanged: boolean;
    oneScreenOffset: number;

    MapperID: number;
    NumberOfChrRoms: number;
    NumberOfPrgRoms: number;
    irqRaised: boolean;
    Debugging: boolean;
    DebugEvents: any;
    ROMHashFunction: (prg: any, chr: any) => string;
    Whizzler: ChiChiCPPU;
    IrqRaised: boolean;
    CheckSum: string;
    CPU: ChiChiCPPU;
    SRAM: any;
    CartName: string;
    NMIHandler: () => {};
    //IRQAsserted: boolean;
    //NextEventAt: number;
    //PpuBankStarts: any;
    //BankStartCache: any;
    CurrentBank: number;

    //BankSwitchesChanged: boolean;
    //OneScreenOffset: number;
    UsesSRAM: boolean;
    //ChrRamStart: number;

    constructor();

    ClearDebugEvents(): void;

    LoadiNESCart(header: number[], prgRoms: number, chrRoms: number, prgRomData: number[], chrRomData: number[], chrRomOffset: number): void;

    GetByte(clock: number, address: number): number;

    SetByte(clock: number, address: number, data: number): void;

    GetPPUByte(clock: number, address: number): number;

    SetPPUByte(clock: number, address: number, data: number): void;

    SetupBankStarts(reg8: number, regA: number, regC: number, regE: number): void;

    MaskBankAddress(bank: number): number;

    WriteState(state: any): void;
    ReadState(state: any): void;

    HandleEvent(Clock: number): void;

    ResetClock(Clock: number): void;

    ResetBankStartCache(): void;

    UpdateBankStartCache(): number;

    ActualChrRomOffset(address: number): number;

    Mirror(clockNum: number, mirroring: number): void;

    InitializeCart(): void;

    UpdateScanlineCounter(): void;
}
export class NesCart extends BaseCart { }
export class MMC1Cart extends BaseCart { }
export class MMC3Cart extends BaseCart { }

export class ChiChiInputHandler  {
    IsZapper: boolean;
    ControlPad: any;
    CurrentByte: number;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    //controlPad_NextControlByteSet(sender: any, e: ChiChiNES.ControlByteEventArgs): void;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    SetNextControlByte(data: number): void;
    HandleEvent(Clock: number): void;
    ResetClock(Clock: number): void;
}

export class ChiChiBopper {

    audioSettings: AudioSettings;
    lastClock: number;
    throwingIRQs: boolean;
    reg15: number;

    constructor();

    sampleRate: number;
    Muted: boolean;
    InterruptRaised: boolean;

    enableTriangle: boolean;
    EnableNoise: boolean;
    EnableSquare1: boolean;
    EnableSquare0: boolean;

    NMIHandler: () => void;
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

export class WavSharer  {
    bufferWasRead: boolean;
    Locker: any;
    NESTooFast: boolean;
    Frequency: number;
    SharedBuffer: any;
    SharedBufferLength: number;
    BufferAvailable: boolean;
    constructor();

    BytesWritten: (sender: any, e: any) => void;
    WavesWritten(remain: number): void;
    ReadWaves(): void;

    SetSharedBuffer(values: any): void;
}

export enum RunningStatuses {
    Unloaded = 0,
    Off = 1,
    Running = 2,
    Frozen = 3,
    Paused = 4
}

export class AudioSettings {
    sampleRate: number;
    master_volume: number;

    enableSquare0: boolean;
    enableSquare1: boolean;
    enableTriangle: boolean;
    enableNoise: boolean;
    enablePCM: boolean;
}

//basic types
export class CpuStatus {
    PC: number;
    A: number;
    X: number;
    Y: number;
    SP: number;
    SR: number;
}

export class PpuStatus {
    status: number;
    controlByte0: number;
    controlByte1: number;
    nameTableStart: number;
    currentTile: number;
    lockedVScroll: number;
    lockedHScroll: number;
    X: number;
    Y: number;
}

export class ChiChiSprite {
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


//machine wrapper
export class ChiChiMachine {
    constructor(cpu?: any);

    Drawscreen(): void;
    RunState: any;
    Cpu: any;
    Cart: any;
    SoundBopper: any;
    WaveForms: any;

    EnableSound: boolean;

    FrameCount: number;
    IsRunning: boolean;

    PadOne: any;

    PadTwo: any;

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


//machine wrapper
export class ChiChiNsfMachine extends ChiChiMachine {

    LoadNsf(rom: any): void;

}


////chichipig
export class ChiChiCPPU {

    frameFinished: () => void;
    vbufLocation: number;
    yPosition: number;
    xPosition: number;
    currentAttributeByte: number;
    spriteSize: number;
    spritesOnThisScanline: number;
    spriteZeroHit: boolean;
    isForegroundPixel: boolean;
    currentSprites: ChiChiSprite[];
    _spriteCopyHasHappened: boolean;

    LastcpuClock: number;

    unpackedSprites: ChiChiSprite[];
    chrRomHandler: any;

    spriteChanges: boolean;
    ppuReadBuffer: number;
    _clipSprites: boolean;
    _clipTiles: boolean;
    _tilesAreVisible: boolean;
    _spritesAreVisible: boolean;
    nameTableMemoryStart: number;

    static pal: Uint32Array;

    Rams: Uint8Array;


    backgroundPatternTableIndex: number;
    _PPUControlByte0: number;
    _PPUControlByte1: number;

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


    currentXPosition: number;
    currentYPosition: number;
    _hScroll: number;
    _vScroll: number;
    lockedHScroll: number;
    lockedVScroll: number;

    _spriteAddress: number;
    spriteRAM: Uint8Array;


    byteOutBuffer: Uint8Array;
    PadOne: any;
    PadTwo: any;
    SoundBopper: any;

    Cart: any;

    ChrRomHandler: any;


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



    PPU_SetByte(Clock: number, address: number, data: number): void;
    PPU_GetByte(Clock: number, address: number): number;

    GetStatus(): CpuStatus;

    GetPPUStatus(): PpuStatus;

    PPU_UnpackSprites(): void;
}

export class ChiChiNsfCPPU extends ChiChiCPPU { }