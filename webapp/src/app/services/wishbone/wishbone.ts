import { NgZone, Injectable, EventEmitter } from '@angular/core';
import * as crc from 'crc';

import { CpuStatus, BaseCart, ChiChiInputHandler, AudioSettings, PpuStatus, IChiChiAPU, IChiChiAPUState,
        WavSharer, ChiChiCPPU, ChiChiMachine, ChiChiPPU, GameGenieCode, ChiChiCheats, IBaseCart, WorkerInterop, RunningStatuses, StateBuffer  } from 'chichi';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { TileDoodler } from './wishbone.tiledoodler';
import { WishboneCart } from './wishbone.cart';
import { WishboneAPU } from './wishbone.audio';

import { Http } from '@angular/http';
import { WishboneWorker } from './wishbone.worker';
import { WishboneWorkerInterop } from './wishbone.worker.interop';

export class WishbonePPU extends ChiChiPPU {
}

@Injectable()
export class WishboneMachine  {
    stateBuffer: StateBuffer;

    ppuStatus: PpuStatus = new PpuStatus();
    cpuStatus: CpuStatus = new CpuStatus();
    fps = 0;
    nesReady: boolean;
    tileDoodler: TileDoodler;
    statusChanged = new EventEmitter<RunningStatuses>(true);

    private runStatus: RunningStatuses;

    get runningStatus(): RunningStatuses {
        return this.runStatus;
    }

    set runningStatus(run: RunningStatuses) {
        this.runStatus = run;
        this.statusChanged.next(this.runStatus);
    }

    Cpu: WishboneCPPU;
    ppu: WishbonePPU;
    Cart: WishboneCart;

    SoundBopper: WishboneAPU;
    WaveForms: WavSharer;

    FrameCount: number;


    constructor(private interop: WishboneWorkerInterop) {
        // initialize sound
        this.WaveForms = new WavSharer();
        this.SoundBopper = new WishboneAPU(this.WaveForms);
        this.ppu = new WishbonePPU();
        this.Cpu = new WishboneCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.Cart = new WishboneCart();

    }

    private debugSubject: Subject<any> = new Subject<any>();

    get debugEvents(): Observable<any> {
        return this.debugSubject.asObservable();
    }


    handleMessage(data: MessageEvent) {
        const d = data.data;
        if (d.debug) {
            this.debugSubject.next(d.debug);
        }
        
        this.nesStateSubject.next(this);
    }

    private nesStateSubject: Subject<WishboneMachine> = new Subject<WishboneMachine>();

    asObservable() {
        return this.nesStateSubject.asObservable();
    }

    insertCart(cart: BaseCart) {


        this.tileDoodler = new TileDoodler(this.ppu);
        this.Cpu.setupMemoryMap(cart);
        cart.installCart(this.ppu, this.Cpu);

        this.Cart.realCart = cart;
        this.Cart.ROMHashFunction = this.Cart.realCart.ROMHashFunction;
        this.Cart.CartName = this.Cart.realCart.CartName;


    }

    setStateBuffer(arr: SharedArrayBuffer) {
        this.stateBuffer = new StateBuffer();
        this.Cpu.memoryMap.setupStateBuffer(this.stateBuffer);
        this.Cpu.setupStateBuffer(this.stateBuffer);
        this.ppu.setupStateBuffer(this.stateBuffer);
        this.Cart.realCart.setupStateBuffer(this.stateBuffer);
        this.stateBuffer.build();
        this.stateBuffer.syncBuffer(arr);
    }

}

export class WishboneCPPU extends ChiChiCPPU {
    constructor(soundBopper: WishboneAPU, ppu: WishbonePPU) {
        super(soundBopper, ppu);
    }

    get programCounter() : number { return this.cpuStatus16[0]; }
    get addressBus(): number { return this.cpuStatus16[1];}

    get statusRegister(): number { return  this.cpuStatus[0]; }
    get accumulator(): number { return  this.cpuStatus[1]; }
    get indexRegisterX(): number { return  this.cpuStatus[2]; }
    get indexRegisterY(): number { return  this.cpuStatus[3]; }
    get dataBus(): number { return  this.cpuStatus[4]; }
    get stackPointer(): number { return  this.cpuStatus[5]; }

    set programCounter(val: number) { }
    set addressBus(val: number) { }

    set statusRegister(val: number) { }
    set accumulator(val: number) { }
    set indexRegisterX(val: number) { }
    set indexRegisterY(val: number) { }
    set dataBus(val: number) { }
    set stackPointer(val: number) { }

    private subject: Subject<WishboneCPPU> = new Subject<WishboneCPPU>();
    pulse() {
        this.subject.next(this);
    }

    asObservable() : Observable<WishboneCPPU> {
        return this.subject.asObservable();
    }

    setupStateBuffer(sb: StateBuffer) {
        
        sb.onRestore.subscribe((buffer: StateBuffer) => {
            this.attachStateBuffer(buffer);
        });

        sb  .pushSegment(2 * Uint16Array.BYTES_PER_ELEMENT, 'cpu_status_16')
            .pushSegment(8, 'cpu_status')
            ;
        return sb;

    }
    

    Step(): void {}
    Execute(): void {}
    flushHistory = false;
}
