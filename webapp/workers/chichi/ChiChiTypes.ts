// utility classes
export enum RunningStatuses {
    Unloaded = 0,
    Off = 1,
    Running = 2,
    Frozen = 3,
    Paused = 4
}

export enum ChiChiCPPU_AddressingModes {
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

export class ChiChiInstruction {
    AddressingMode: number = 0;
    frame: number = 0;
    time: number = 0;
    A: number = 0;
    X: number = 0;
    Y: number = 0;
    SR: number = 0;
    SP: number = 0;
    Address: number = 0;
    OpCode: number = 0;
    Parameters0: number = 0;
    Parameters1: number = 0;
    ExtraTiming: number = 0;
    Length: number = 0;
}

export class ChiChiSprite {
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

export class AudioSettings {
    sampleRate: number = 44100;
    master_volume: number = 0.0;

    enableSquare0: boolean = true;
    enableSquare1: boolean = true;
    enableTriangle: boolean = true;
    enableNoise: boolean = true;
    enablePCM: boolean = true;
}