import { NgZone, Injectable } from '@angular/core';
import * as crc from 'crc';

import { CpuStatus, BaseCart, ChiChiInputHandler, AudioSettings, PpuStatus, IChiChiAPU, IChiChiAPUState,
        WavSharer, ChiChiCPPU, ChiChiMachine, ChiChiPPU, GameGenieCode, ChiChiCheats, IBaseCart  } from 'chichi';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { TileDoodler } from './wishbone.tiledoodler';
import { WishboneCart } from './wishbone.cart';
import { WishboneAPU } from './wishbone.audio';
import { KeyboardSettings } from '../keyboardsettings';
import { Http } from '@angular/http';
import { WishboneWorker } from './wishbone.worker';
import { EventEmitter } from 'selenium-webdriver';


export class KeyBindings {
    keyName(keyCode: number): string {
        let keyName = '';
        keyName = KeyboardSettings.keys[keyCode.toString()];
        return keyName;
    }

    left = 37;
    right = 39;
    up = 38;
    down = 40;
    b = 90;
    a = 88;
    select = 65;
    start = 83;
}

class WishboneKeyHandler {
    kuSub: Subscription;
    kdSub: Subscription;
    keydownEvent: Observable<any> = Observable.fromEvent(document, 'keydown');
    keyupEvent: Observable<any> = Observable.fromEvent(document, 'keyup');

    constructor(private pads: WishBoneControlPad[]) {
        const zone = new NgZone({enableLongStackTrace: false});
        zone.runOutsideAngular(() => {
            if (this.kdSub) {
                this.kdSub.unsubscribe();
                this.kuSub.unsubscribe();
            }
            this.kdSub = this.keydownEvent.subscribe((event) => {
                for (let i = 0; i < this.pads.length; ++i) {
                    this.pads[i].handleKeyDownEvent(event);
                }
            });
            this.kuSub = this.keyupEvent.subscribe((event) => {
                for (let i = 0; i < this.pads.length; ++i) {
                    this.pads[i].handleKeyUpEvent(event);
                }
            });
        });

    }
}

export class WishBoneControlPad {
    gamepad: Gamepad;
    private controlByteSubject : Subject<number> = new Subject<number>();

    public controlByteChange() : Observable<number> {
        return this.controlByteSubject.asObservable();
    }

    gamepadConnected: Observable<any> = Observable.fromEvent(window, 'gamepadconnected');

    readGamepad() {
        if (this.gamepad) {
            this.padOneState = 0;
            // left
            if (this.gamepad.axes[0]) {
                this.padOneState |= 64 & 0xFF;
            }
        }
    }

    constructor(private machine: WishboneMachine, private controllerId: string) {
        const ctrl = localStorage.getItem(this.controllerId + 'KeyBindings');
        if (ctrl) {
            this.bindings = JSON.parse(ctrl);
        }

        this.attach(this.bindings);
        this.gamepadConnected.subscribe((e) => {
            console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        });

    }

    attach(bindings?: KeyBindings) {
        if (bindings) {
            this.bindings = Object.assign({}, bindings);
            localStorage.setItem(this.controllerId + 'KeyBindings', JSON.stringify(this.bindings));
        }
    }

    bindings: KeyBindings = new KeyBindings();

    padOneState  = 0;

    enabled = true;

    // control pad
    handleKeyDownEvent(event: KeyboardEvent) {
        switch (event.keyCode) {
            case this.bindings.left: // left arrow
                this.padOneState |= 64 & 0xFF;
                break;
            case this.bindings.up: // up arrow
                this.padOneState |= 16 & 0xFF;
                break;
            case this.bindings.right: // right arrow	39
                this.padOneState |= 128 & 0xFF;
                break;
            case this.bindings.down: // down arrow	40
                this.padOneState |= 32 & 0xFF;
                break;
            case this.bindings.b: // z
                this.padOneState |= 2 & 0xFF;
                break;
            case this.bindings.a: // x
                this.padOneState |= 1 & 0xFF;
                break;
            case this.bindings.start:  // enter
                this.padOneState |= 8 & 0xFF;
                break;
            case this.bindings.select: // tab
                this.padOneState |= 4 & 0xFF;
                break;
        }
        // debugger;
        this.controlByteSubject.next(this.padOneState);
    }

    handleKeyUpEvent(event: KeyboardEvent) {
        switch (event.keyCode) {
            case this.bindings.left: // left arrow
                this.padOneState &= ~64 & 0xFF;
                break;
            case this.bindings.up: // up arrow
                this.padOneState &= ~16 & 0xFF;
                break;
            case this.bindings.right: // right arrow	39
                this.padOneState &= ~128 & 0xFF;
                break;
            case this.bindings.down: // down arrow	40
                this.padOneState &= ~32 & 0xFF;
                break;
            case this.bindings.b: // 	z
                this.padOneState &= ~2 & 0xFF;
                break;
            case this.bindings.a: // x
                this.padOneState &= ~1 & 0xFF;
                break;
            case this.bindings.start: // enter
                this.padOneState &= ~8 & 0xFF;
                break;
            case this.bindings.select: // tab
                this.padOneState &= ~4 & 0xFF;
                break;
        }
        this.controlByteSubject.next(this.padOneState);
    }
}

export class WishbonePPU extends ChiChiPPU {
}

@Injectable()
export class WishboneMachine  {
    interval: NodeJS.Timer;
    keyHandler: WishboneKeyHandler;
    ppuStatus: PpuStatus = new PpuStatus();
    cpuStatus: CpuStatus = new CpuStatus();
    fps = 0;
    nesReady: boolean;
    tileDoodler: TileDoodler;
    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_CONTROL_PAD_1 = 4;
    readonly NES_AUDIO_AVAILABLE = 3;

    RunState: number;
    Cpu: WishboneCPPU;
    ppu: WishbonePPU;
    Cart: WishboneCart;

    SoundBopper: WishboneAPU;
    WaveForms: WavSharer;

    FrameCount: number;


    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT);
    nesInterop: Int32Array = new Int32Array(<any>this.nesControlBuf);

    constructor() {
        // initialize sound
        this.WaveForms = new WavSharer();
        this.SoundBopper = new WishboneAPU(this.WaveForms);
        this.ppu = new WishbonePPU();
        this.Cpu = new WishboneCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.Cart = new WishboneCart();
        
        
        this.PadOne = new WishBoneControlPad(this, 'padOne');
        this.PadOne.controlByteChange().subscribe((val:number)=>{
            this.nesInterop[this.NES_CONTROL_PAD_0] = val & 0xff;
        })

        this.PadTwo = new WishBoneControlPad(this, 'padTwo');
        this.PadTwo.controlByteChange().subscribe((val:number)=>{
            this.nesInterop[this.NES_CONTROL_PAD_1] = (val & 0xff);
        })

        this.keyHandler = new WishboneKeyHandler([this.PadOne, this.PadTwo]);
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

    readonly iop_runStatus = 2;

    asObservable() {
        return this.nesStateSubject.asObservable();
    }

    Run() {

    }

    RunFrame() {
    }

    RequestSync() {
    }

    Drawscreen() {
    }
    get IsRunning(): boolean {
        return this.nesInterop[this.NES_GAME_LOOP_CONTROL] > 0;
    }

    PadOne: WishBoneControlPad;
    PadTwo: WishBoneControlPad;

    SRAMReader: (RomID: string) => any;
    SRAMWriter: (RomID: string, SRAM: any) => void;

    Reset() {
    }

    PowerOn() {
    }

    PowerOff() {
    }

    Step() {
    }

    EjectCart() {
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
