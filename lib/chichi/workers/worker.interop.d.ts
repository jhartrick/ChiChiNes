export declare class WorkerInterop {
    interopBuffer: Int32Array;
    readonly NES_GAME_LOOP_CONTROL: number;
    readonly NES_FPS: number;
    readonly NES_CONTROL_PAD_0: number;
    readonly NES_AUDIO_AVAILABLE: number;
    readonly NES_CONTROL_PAD_1: number;
    constructor(interopBuffer: Int32Array);
    loop(): void;
    unloop(): void;
    readonly looping: boolean;
    fps: number;
    controlPad0: number;
    controlPad1: number;
    audioAvailable: number;
}
