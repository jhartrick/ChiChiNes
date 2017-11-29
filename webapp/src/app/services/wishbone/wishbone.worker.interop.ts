import { Injectable } from "@angular/core";
import { WorkerInterop } from 'chichi';

@Injectable()
export class WishboneWorkerInterop extends WorkerInterop {
    private myIops: Int32Array;    
    get iops(): Int32Array {
        return this.myIops;
    }
    constructor() {
        const iops = new Int32Array(<any>new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT));
        super (iops);
        this.myIops = iops;
    }
}