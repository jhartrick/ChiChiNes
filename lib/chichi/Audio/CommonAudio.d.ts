export declare class WavSharer {
    readonly NES_BYTES_WRITTEN: number;
    readonly WAVSHARER_BLOCKTHREAD: number;
    readonly WAVSHARER_BUFFERPOS: number;
    controlBuffer: Int32Array;
    sharedAudioBufferPos: number;
    readonly bufferPosition: number;
    bufferWasRead: boolean;
    static sample_size: number;
    SharedBuffer: Float32Array;
    SharedBufferLength: number;
    chunkSize: number;
    constructor();
    audioBytesWritten: number;
    wakeSleepers(): void;
    synchronize(): void;
}
export declare class blip_buffer_t {
    size: number;
    constructor(size: number);
    factor: number;
    samples: Array<number>;
    offset: number;
    avail: number;
    integrator: number;
    time_bits: number;
    arrayLength: number;
}
export declare class Blip {
    static time_unit: number;
    static buf_extra: number;
    static phase_count: number;
    static time_bits: number;
    private bass_shift;
    private end_frame_extra;
    private half_width;
    private phase_bits;
    static delta_bits: number;
    static bl_step: number[][];
    constructor(size: number);
    BlipBuffer: blip_buffer_t;
    blip_samples_avail: number;
    blip_new(size: number): void;
    blip_set_rates(clock_rate: number, sample_rate: number): void;
    blip_clear(): void;
    blip_clocks_needed(samples: number): number;
    blip_end_frame(t: number): void;
    remove_samples(count: number): void;
    ReadBytes(outbuf: any, count: number, stereo: number): number;
    ReadElementsLoop(wavSharer: WavSharer): number;
    blip_add_delta(time: number, delta: number): void;
    blip_add_delta_fast(time: number, delta: number): void;
}
export declare class PortWriteEntry {
    time: number;
    address: number;
    data: number;
    constructor(time: number, address: number, data: number);
}
export declare class QueuedPort {
    private array;
    readonly Count: number;
    clear(): void;
    enqueue(item: PortWriteEntry): void;
    dequeue(): PortWriteEntry;
}
