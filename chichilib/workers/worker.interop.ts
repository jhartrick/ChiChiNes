export class WorkerInterop {
    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_FPS = 1;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_AUDIO_AVAILABLE = 3;
    readonly NES_CONTROL_PAD_1 = 4;

    constructor(private nesInterop: Int32Array) {
    }


    loop() {
        Atomics.store(this.nesInterop, this.NES_GAME_LOOP_CONTROL, 1);
    }

    unloop() {
        Atomics.store(this.nesInterop, this.NES_GAME_LOOP_CONTROL, 0);
    }

    get looping(): boolean {
        return this.nesInterop[this.NES_GAME_LOOP_CONTROL] > 0;
    }

    get fps(): number {
        return this.nesInterop[this.NES_FPS] & 0xff;
    }

    set fps(val: number) {
        this.nesInterop[this.NES_FPS] = val;
    }

    get controlPad0(): number {
        return this.nesInterop[this.NES_CONTROL_PAD_0] & 0xff;
    }

    set controlPad0(val: number) {
        this.nesInterop[this.NES_CONTROL_PAD_0] = val;
    }

    get controlPad1(): number {
        return this.nesInterop[this.NES_CONTROL_PAD_0] & 0xff;
    }

    set controlPad1(val: number) {
        this.nesInterop[this.NES_CONTROL_PAD_0] = val;
    }

    get audioAvailable(): number {
        return this.nesInterop[this.NES_AUDIO_AVAILABLE];
    }

    set audioAvailable(val: number) {
        this.nesInterop[this.NES_AUDIO_AVAILABLE] = val;
    }

}