import { NgZone, Injectable, EventEmitter } from '@angular/core';
import * as crc from 'crc';

import { CpuStatus, BaseCart, ChiChiInputHandler, AudioSettings, PpuStatus, IChiChiAPU, IChiChiAPUState,
        WavSharer, ChiChiCPPU, ChiChiMachine, ChiChiPPU, GameGenieCode, ChiChiCheats, IBaseCart, WorkerInterop, RunningStatuses  } from 'chichi';
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
        cart.installCart(this.ppu, this.Cpu);
        this.Cpu.Cart = this.ppu.ChrRomHandler = this.Cart.realCart = cart;
        this.Cart.ROMHashFunction = this.Cart.realCart.ROMHashFunction;
        this.Cart.CartName = this.Cart.realCart.CartName;
        this.ppu.chrRomHandler = this.Cart.realCart;
    }

}

class WishboneCPPU extends ChiChiCPPU {
    constructor(soundBopper: WishboneAPU, ppu: WishbonePPU) {
        super(soundBopper, ppu);
    }

    Step(): void {}
    Execute(): void {}
    flushHistory = false;
}
