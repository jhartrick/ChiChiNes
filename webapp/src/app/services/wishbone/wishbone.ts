import { NgZone } from '@angular/core';

import { CpuStatus, BaseCart, NesCart, MMC1Cart, MMC3Cart,  ChiChiInputHandler,
    AudioSettings, PpuStatus, ChiChiBopper, WavSharer, ChiChiCPPU, ChiChiMachine, iNESFileHandler, ChiChiPPU  } from 'chichi'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { TileDoodler } from './wishbone.tiledoodler';
import { WishboneCart } from './wishbone.cart';
import { WishBopper } from './wishbone.audio';

export class KeyBindings {
    left = 37;
    right = 39;
    up = 38;
    down = 40;
    b = 90;
    a = 88;
    select = 65;
    start = 83;
}

export class WishBoneControlPad {
    kuSub: Subscription;
    kdSub: Subscription;
    keydownEvent: Observable<any> = Observable.fromEvent(document, 'keydown');
    keyupEvent: Observable<any> = Observable.fromEvent(document, 'keyup');
    gamepad: Gamepad;

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

    constructor(private machine: WishboneMachine) {

        this.attach();
        this.gamepadConnected.subscribe((e) => {
            console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        });
    }

    attach(bindings?: KeyBindings) {
        const zone = new NgZone({enableLongStackTrace: false});
        zone.runOutsideAngular(() => {
            if (this.kdSub) {
                this.kdSub.unsubscribe();
                this.kuSub.unsubscribe();
            }
            if (bindings) {
                this.bindings = Object.assign({}, bindings);
            }
            this.kdSub = this.keydownEvent.subscribe((event) => {
                zone.runOutsideAngular(() => {
                    this.handleKeyDownEvent(event);
                });
            });
            this.kuSub = this.keyupEvent.subscribe((event) => {
                zone.runOutsideAngular(() => {
                    this.handleKeyUpEvent(event);
                });
            });
        });
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
        this.machine.nesInterop[2] = this.padOneState;
        // this.nesInterop[2] = this.padOneState & 0xFF;
        // this.postNesMessage({ command: "setpad", padOneState: this.padOneState });
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
        this.machine.nesInterop[2] = this.padOneState;

        // this.postNesMessage({ command: "setpad", padOneState: this.padOneState });
    }

}

export class WishbonePPU extends ChiChiPPU {
}

export class WishboneMachine  {
    ppuStatus: PpuStatus = new PpuStatus();
    cpuStatus: CpuStatus = new CpuStatus();
    fps = 0;
    nesReady: boolean;
    tileDoodler: TileDoodler;
    private worker: Worker;

    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_AUDIO_AVAILABLE = 3;

    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT);
    nesInterop: Int32Array = new Int32Array(<any>this.nesControlBuf);


    constructor() {
        this.SoundBopper = new WishBopper(this);
        this.WaveForms = this.SoundBopper.writer;
        this.ppu = new WishbonePPU();
        this.Cpu = new WishboneCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.Cart = new WishboneCart();
        this.PadOne = new WishBoneControlPad(this);


        const nesWorker = require('file-loader?name=worker.[hash:20].[ext]!../../../assets/emulator.worker.bootstrap.js');

        this.worker = new Worker(nesWorker);

        this.worker.onmessage = (data: MessageEvent) => {
            this.handleMessage(data);
        };


    }

    handleMessage(data: MessageEvent) {
        const d = data.data;
        if (d === 'ready') {
            this.nesReady = true;

            const createCommand = 'create';
            this.postNesMessage({ command: createCommand,
                vbuffer: this.ppu.byteOutBuffer,
                abuffer: this.WaveForms.SharedBuffer,
                iops: this.nesInterop });

            return;
        }

        this.Sync(d);
        this.nesStateSubject.next(this);
    }

    private nesStateSubject: Subject<WishboneMachine> = new Subject<WishboneMachine>();

    readonly iop_runStatus = 2;

    initChiChiWorker() {

    }

    asObservable() {
        return this.nesStateSubject.asObservable();
    }

    postNesMessage(message: any) {
        // this.oldOp = this.nesInterop[0] ;
        // this.nesInterop[0] = 0;
        <any>Atomics.store(this.nesInterop, this.NES_GAME_LOOP_CONTROL , 0);
        <any>Atomics.wake(this.nesInterop, this.NES_GAME_LOOP_CONTROL, 9999);

        this.worker.postMessage(message);
    }

    Run() {
        this.postNesMessage({ command: 'run', debug: false });
        setInterval(() => {
            this.fps = this.nesInterop[1];
        }, 500);
        // (<any>Atomics).store(this.nesInterop, 2, 1);

    }

    RunFrame() {
    }

    RequestSync() {
        // case 'audiosettings':
        // this.machine.SoundBopper.audioSettings = event.data.settings;
        this.postNesMessage({ command: 'audiosettings', settings: this.SoundBopper.audioSettings });
    }


    Sync(data: any) {
        if (data.bufferupdate) {
            if (data.Cpu.Rams) {
                this.Cpu.Rams = data.Cpu.Rams;
                this.ppu.spriteRAM = data.Cpu.spriteRAM;
                for (let i = 0; i < this.ppu.unpackedSprites.length; ++i) {
                    this.ppu.unpackedSprites[i].Changed = true;
                }
                this.ppu.UnpackSprites();
            }
            if (data.Cart && this.Cart.realCart) {

                this.Cart.realCart.prgRomBank6 = data.Cart.prgRomBank6;
                this.Cart.realCart.ppuBankStarts = data.Cart.ppuBankStarts;
                this.Cart.realCart.bankStartCache = data.Cart.bankStartCache;
                this.Cart.realCart.chrRom = data.Cart.chrRom;
            }
        }
        if (data.stateupdate) {
            if (data.Cpu) {
                this.ppu.backgroundPatternTableIndex = data.Cpu.backgroundPatternTableIndex;
                this.cpuStatus = data.Cpu.status;
                this.ppuStatus = data.Cpu.ppuStatus;
                this.ppu._PPUControlByte0 = data.Cpu._PPUControlByte0;
                this.ppu._PPUControlByte1 = data.Cpu._PPUControlByte1;

            }
            if (data.Cart && this.Cart.realCart) {

                this.Cart.realCart.CurrentBank = data.Cart.CurrentBank;
                this.Cart.realCart.current8 = data.Cart.current8;
                this.Cart.realCart.currentA = data.Cart.currentA;
                this.Cart.realCart.currentC = data.Cart.currentC;
                this.Cart.realCart.currentE = data.Cart.currentE;

                this.Cart.realCart.bank8start = data.Cart.bank8start;
                this.Cart.realCart.bankAstart = data.Cart.bankAstart;
                this.Cart.realCart.bankCstart = data.Cart.bankCstart;
                this.Cart.realCart.bankEstart = data.Cart.bankEstart;

            }
        }
        if (data.sound)
            this.SoundBopper.audioSettings = data.sound.settings;

        if (data.debug && data.debug.InstructionHistory) {
            this.Cpu._instructionHistory = data.debug.InstructionHistory.Buffer;
            this.Cpu.instructionHistoryPointer = data.debug.InstructionHistory.Index;
            this.Cpu.flushHistory = data.debug.InstructionHistory.Finish ? true : false;
        }
    }

    Drawscreen() {
        // throw new Error('Method not implemented.');
    }
    RunState: ChiChiNES.Machine.ControlPanel.RunningStatuses;
    Cpu: WishboneCPPU;
    ppu: WishbonePPU;
    Cart: WishboneCart;

    SoundBopper: WishBopper;
    WaveForms: any;

    get nesAudioDataAvailable(): number {
        return <any>Atomics.load(this.nesInterop, this.NES_AUDIO_AVAILABLE);
    }

    set nesAudioDataAvailable(value: number) {
        <any>Atomics.store(this.nesInterop, this.NES_AUDIO_AVAILABLE, value);

        <any>Atomics.wake(this.nesInterop, this.NES_AUDIO_AVAILABLE, 321);
    }

    private _soundEnabled = false;

    public get EnableSound() {
        return this.IsRunning && this._soundEnabled;
    }
    public set EnableSound(value: boolean) {
        this._soundEnabled = value;
        if (this._soundEnabled) {
            this.postNesMessage({ command: 'unmute' });
        } else {
            this.postNesMessage({ command: 'mute' });
        }

    }

    FrameCount: number;
    get IsRunning(): boolean {
        return this.nesInterop[this.NES_GAME_LOOP_CONTROL] > 0;
    }

    PadOne: WishBoneControlPad;
    PadTwo: WishBoneControlPad;

    SRAMReader: (RomID: string) => any;
    SRAMWriter: (RomID: string, SRAM: any) => void;

    Reset() {
        this.postNesMessage({ command: 'reset', debug: true });
    }

    PowerOn() {
        throw new Error('Method not implemented.');
    }

    PowerOff() {
        this.postNesMessage({ command: 'stop' });
    }

    Step() {
        this.postNesMessage({ command: 'step', debug: true });
    }

    EjectCart() {
        this.postNesMessage({ command: 'stop' });
    }

    LoadCart(rom: any) {
        const cartName = this.Cart.CartName;
        const cart = iNESFileHandler.LoadROM(this.Cpu, rom);

        this.Cart = new WishboneCart();
        this.Cart.realCart = cart;
        this.Cart.realCart.CPU = this.Cpu;
        this.Cart.realCart.Whizzler = this.ppu;
        this.Cart.CartName = cartName;

        this.tileDoodler = new TileDoodler(this.ppu);
        this.postNesMessage({ command: 'loadrom', rom: rom, name: this.Cart.CartName });
        //        this.machine.LoadCart(rom);
    }

    HasState(index: number): boolean {
        throw new Error('Method not implemented.');
    }

    GetState(index: number) {
        throw new Error('Method not implemented.');
    }

    SetState(index: number) {
        throw new Error('Method not implemented.');
    }

    SetupSound() {
        throw new Error('Method not implemented.');
    }

    FrameFinished() {
        throw new Error('Method not implemented.');
    }


}

class WishboneCPPU extends ChiChiCPPU {
    constructor(soundBopper: WishBopper, ppu: WishbonePPU) {
        super(soundBopper, ppu);
    }

    Step(): void {}
    Execute(): void {}
    flushHistory = false;
}
