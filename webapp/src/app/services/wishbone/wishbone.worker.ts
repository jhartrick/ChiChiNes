import { Subject } from "rxjs";
import { WishboneMachine } from "./wishbone";
import { Observable } from "rxjs/Observable";

export class WishboneWorker {
    ready: boolean = false;

    worker: Worker;
    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_CONTROL_PAD_1 = 4;
    readonly NES_AUDIO_AVAILABLE = 3;

    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT);
    nesInterop: Int32Array = new Int32Array(<any>this.nesControlBuf);
    pendingMessages: Array<any> = new Array<any>();
    
    nesMessageData: Subject<any> = new Subject<any>();

    constructor(private wishbone: WishboneMachine) {
        console.log("making wishboneworker")
        wishbone.postNesMessage = (message:any) => { 
            this.postNesMessage(message); 
        }
        this.nesMessageData.subscribe((data ) =>
            this.wishbone.handleMessage(data)
        );
    }

    oncreate: (t: WishboneWorker)=>void;

    start (oncreate: (t: WishboneWorker)=>void)  {
        this.oncreate = oncreate;
        
        if (this.worker) {
            this.worker.terminate();
            this.worker = undefined;
            this.ready = false;
        }        
        const nesWorker = require('file-loader?name=worker.[hash:20].[ext]!../../../assets/emulator.worker.bootstrap.js');

        this.worker = new Worker(nesWorker);

        this.worker.onmessage = (data: MessageEvent) => {
            this.handleMessage(data);
        };
    
    }

    postNesMessage(message: any) {
        if (this.worker) {
            this.worker.postMessage(message);
            <any>Atomics.store(this.nesInterop, this.NES_GAME_LOOP_CONTROL , 0);
            <any>Atomics.wake(this.nesInterop, this.NES_GAME_LOOP_CONTROL, 9999);
        } else {
            this.pendingMessages.push(message);
        }
    }

    private handleMessage(data: MessageEvent) {
        const d = data.data;
        if (d === 'ready') {
            this.oncreate(this);

            while (this.pendingMessages.length > 0) {
                this.worker.postMessage(this.pendingMessages.pop());
            }
            return;

        }
        this.nesMessageData.next(data);
    }
}
