import { Subject } from 'rxjs/Subject';
export declare const bufferType = "ArrayBuffer";
export declare type ChiChiBuffer = ArrayBuffer;
export interface StateBufferConfig {
    buffer: ArrayBuffer;
    segments: Array<BufferSegment>;
}
export interface BufferSegment {
    name: string;
    start: number;
    size: number;
}
export declare class StateBuffer {
    data: StateBufferConfig;
    bufferSize: number;
    onRestore: Subject<StateBuffer>;
    onUpdateBuffer: Subject<StateBuffer>;
    pushSegment(size: number, name: string): StateBuffer;
    build(): this;
    updateBuffer(): void;
    getSegment(name: string): any;
    getUint8Array(name: string): Uint8Array;
    getUint16Array(name: string): Uint16Array;
    getUint32Array(name: string): Uint32Array;
    getFloat32Array(name: string): Float32Array;
    syncBuffer(config: StateBufferConfig): void;
}
