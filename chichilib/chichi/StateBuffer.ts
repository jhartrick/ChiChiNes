import { Subject } from 'rxjs/Subject';

export class BufferSegment {
    name: string;
    start: number;
    size: number;
}

export class StateBuffer {
    buffer: SharedArrayBuffer;
    private segments: BufferSegment[] = new Array<BufferSegment>();
    bufferSize: number = 0;

    onRestore = new Subject<StateBuffer>();
    onUpdateBuffer = new Subject<StateBuffer>();

    pushSegment(size: number, name: string): StateBuffer {
        const start = this.bufferSize;
        this.segments.push({name, start, size});
        this.bufferSize += size;
        return this;
    }

    getSegment(name: string): any {
        const x = this.segments.find(seg => { return seg.name === name; });
        return { buffer: this.buffer, start: x.start, size: x.size }
    }

    getUint8Array(name: string): Uint8Array {
        const x = this.segments.find(seg => { return seg.name === name; });
        return new Uint8Array(this.buffer, x.start, x.size);
    }

    getUint16Array(name: string): Uint16Array {
        const x = this.segments.find(seg => { return seg.name === name; });
        return new Uint16Array(this.buffer, x.start, x.size );
    }

    getArray<T>(name: string, arrayType: new (buf: SharedArrayBuffer, start: number, size: number) => T): T {
        const x = this.segments.find(seg => { return seg.name === name; });
        return new arrayType(this.buffer, x.start, x.size );
    }

    getArrayEntry<T>(name: string, index: number, arrayType: new (buf: SharedArrayBuffer, start: number, size: number) => T): number { 
        const x = this.segments.find(seg => { return seg.name === name; });
        return new arrayType(this.buffer, x.start, x.size )[index];
    }

    build() {
        this.buffer = new SharedArrayBuffer(this.bufferSize);
        this.onRestore.next(this);
        return this;
    }

    syncBuffer(newBuf: SharedArrayBuffer) {
        this.buffer = newBuf;
        this.onRestore.next(this);
    }

    updateBuffer() {
        this.onUpdateBuffer.next(this);
    }

}