import { Subject } from 'rxjs/Subject';

export class StateBufferConfig {
    buffer: SharedArrayBuffer;
    segments: BufferSegment[] = new Array<BufferSegment>();
}

export class BufferSegment {
    name: string;
    start: number;
    size: number;
}

export class StateBuffer {
    data: StateBufferConfig = new StateBufferConfig();

    bufferSize: number = 0;

    onRestore = new Subject<StateBuffer>();
    onUpdateBuffer = new Subject<StateBuffer>();

    pushSegment(size: number, name: string): StateBuffer {
        const seg = this.data.segments.findIndex((v,i) => v.name == name);
        if (seg === -1) {
            const start = this.bufferSize;
            this.data.segments.push({name, start, size});
            this.bufferSize += size;
        }
        return this;
    }

    getSegment(name: string): any {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return { buffer: this.data.buffer, start: x.start, size: x.size }
    }

    getUint8Array(name: string): Uint8Array {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return new Uint8Array(this.data.buffer, x.start, x.size);
    }

    getUint16Array(name: string): Uint16Array {
        const x = this.data.segments.find(seg => { return seg.name === name; });
        return new Uint16Array(this.data.buffer, x.start, x.size / Uint16Array.BYTES_PER_ELEMENT );
    }

    build() {
        this.data.buffer = new SharedArrayBuffer(this.bufferSize);
        this.onRestore.next(this);
        return this;
    }

    syncBuffer(config: StateBufferConfig) {
        this.data = config;
        this.onRestore.next(this);
    }

    updateBuffer() {
        this.onUpdateBuffer.next(this);
    }

}