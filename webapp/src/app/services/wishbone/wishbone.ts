import { NgZone } from '@angular/core';
import * as crc from 'crc';

import { CpuStatus, BaseCart, ChiChiInputHandler, AudioSettings, PpuStatus, ChiChiBopper,
        WavSharer, ChiChiCPPU, ChiChiMachine, ChiChiPPU, GameGenieCode, ChiChiCheats, IBaseCart  } from 'chichi';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { TileDoodler } from './wishbone.tiledoodler';
import { WishboneCart } from './wishbone.cart';
import { WishBopper } from './wishbone.audio';
import { KeyboardSettings } from '../keyboardsettings';
import { WishboneCheats } from './wishbone.cheats';
import { Http } from '@angular/http';
import { WishboneWorker } from './wishbone.worker';


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

export class WishboneMachine  {
    interval: NodeJS.Timer;
    keyHandler: WishboneKeyHandler;
    ppuStatus: PpuStatus = new PpuStatus();
    cpuStatus: CpuStatus = new CpuStatus();
    fps = 0;
    nesReady: boolean;
    tileDoodler: TileDoodler;
    boneThread: WishboneWorker = new WishboneWorker();
    private worker: Worker;

    readonly NES_GAME_LOOP_CONTROL = 0;
    readonly NES_CONTROL_PAD_0 = 2;
    readonly NES_CONTROL_PAD_1 = 4;
    readonly NES_AUDIO_AVAILABLE = 3;

    private nesControlBuf: SharedArrayBuffer = new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT);
    nesInterop: Int32Array = new Int32Array(<any>this.nesControlBuf);

    constructor() {
        // initialize sound
        this.WaveForms = new WavSharer();
        this.SoundBopper = new WishBopper(this.WaveForms);

        this.ppu = new WishbonePPU();
        this.Cpu = new WishboneCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.Cart = new WishboneCart();
        
        
        this.PadOne = new WishBoneControlPad(this, 'padOne');
        this.PadOne.controlByteChange().subscribe((val:number)=>{
            this.nesInterop[this.NES_CONTROL_PAD_0] = val & 0xFF;// | (this.nesInterop[2] & 0xFF00);
        })
        this.PadTwo = new WishBoneControlPad(this, 'padTwo');
        this.PadTwo.controlByteChange().subscribe((val:number)=>{
            this.nesInterop[this.NES_CONTROL_PAD_1] = (val & 0xFF);// << 8 | (this.nesInterop[2] & 0x00FF);
        })

        this.keyHandler = new WishboneKeyHandler([this.PadOne, this.PadTwo]);
    }

    private debugSubject: Subject<any> = new Subject<any>();
    
    get debugEvents(): Observable<any> {
        return this.debugSubject.asObservable();
    }

    private _cheats: GameGenieCode[];

    get cheats(): GameGenieCode[] {
        //let ggCodes = new ChiChiCheats().getCheatsForGame(this.Cart.realCart.ROMHashFunction);
        return this._cheats;
    }

    applyCheats(cheats: GameGenieCode[]) {
        this._cheats = cheats;
        const cc = new ChiChiCheats();
        this.Cpu.genieCodes = cheats.filter((v) => v.active).map((v) => cc.gameGenieCodeToPatch(v.code));
        this.Cpu.cheating =  this.Cpu.genieCodes.length > 0;
        this.postNesMessage({ command: 'cheats', cheats: this.Cpu.genieCodes });
    }

    handleMessage(data: MessageEvent) {
        const d = data.data;
        if (d.debug) {
            this.debugSubject.next(d.debug);
        }
        this.Sync(d);
        this.nesStateSubject.next(this);
    }

    private nesStateSubject: Subject<WishboneMachine> = new Subject<WishboneMachine>();

    readonly iop_runStatus = 2;

    asObservable() {
        return this.nesStateSubject.asObservable();
    }

    pendingMessages: Array<any> = new Array<any>();

    postNesMessage(message: any) {
        this.boneThread.postNesMessage(message);
    }

    Run() {
        this.postNesMessage({ command: 'run', debug: false });
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.fps = this.nesInterop[1];
        }, 500);
        // (<any>Atomics).store(this.nesInterop, 2, 1);

    }

    RunFrame() {
    }

    RequestSync() {
        this.postNesMessage({ command: 'audiosettings', settings:  this.SoundBopper.cloneSettings() });
    }


    Sync(data: any) {
        if (data.bufferupdate) {
            if (data.Cpu.Rams) {
                this.Cpu.Rams = data.Cpu.Rams;
                this.ppu.spriteRAM = data.Cpu.spriteRAM;
                for (let i = 0; i < this.ppu.unpackedSprites.length; ++i) {
                    this.ppu.unpackedSprites[i].Changed = true;
                }
                this.ppu.unpackSprites();
            }
            if (data.Cart && this.Cart.realCart) {

                this.Cart.realCart.prgRomBank6 = data.Cart.prgRomBank6;
                this.Cart.realCart.ppuBankStarts = data.Cart.ppuBankStarts;
                // this.Cart.realCart.bankStartCache = data.Cart.bankStartCache;
                this.Cart.realCart.chrRom = data.Cart.chrRom;
            }
            if (data.sound) {
                this.WaveForms.controlBuffer = data.sound.waveForms_controlBuffer;//
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

                // this.Cart.realCart.CurrentBank = data.Cart.CurrentBank;
                // this.Cart.realCart.current8 = data.Cart.current8;
                // this.Cart.realCart.currentA = data.Cart.currentA;
                // this.Cart.realCart.currentC = data.Cart.currentC;
                // this.Cart.realCart.currentE = data.Cart.currentE;

                // this.Cart.realCart.bank8start = data.Cart.bank8start;
                // this.Cart.realCart.bankAstart = data.Cart.bankAstart;
                // this.Cart.realCart.bankCstart = data.Cart.bankCstart;
                // this.Cart.realCart.bankEstart = data.Cart.bankEstart;

            }
        }
        if (data.sound) {
            this.SoundBopper.updateSettings(data.sound.settings);
        }


    }

    Drawscreen() {
        // throw new Error('Method not implemented.');
    }
    RunState: number;
    Cpu: WishboneCPPU;
    ppu: WishbonePPU;
    Cart: WishboneCart;

    SoundBopper: WishBopper;
    WaveForms: WavSharer;

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
        this.postNesMessage({ command: 'reset', debug: false });
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

    insertCart(cart: BaseCart, rom: number[]) {
        this.boneThread.start((threadHandler)=>{
            const createCommand = 'create';
            this.nesInterop = threadHandler.nesInterop;
            threadHandler.postNesMessage({ 
                command: createCommand,
                vbuffer: this.ppu.byteOutBuffer,
                abuffer: this.WaveForms.SharedBuffer,
                audioSettings: this.SoundBopper.cloneSettings(),
                iops: this.nesInterop
            });

            cart.installCart(this.ppu, this.Cpu);
            this.Cpu.Cart = this.ppu.ChrRomHandler = this.Cart.realCart = cart;
            this.Cart.ROMHashFunction = this.Cart.realCart.ROMHashFunction;
            this.Cart.CartName = this.Cart.realCart.CartName;
            this.ppu.chrRomHandler = this.Cart.realCart;
            
            this.tileDoodler = new TileDoodler(this.ppu);
            threadHandler.postNesMessage({ command: 'loadrom', rom: rom, name: cart.CartName });
        });
        this.boneThread.nesMessageData.subscribe((data)=>this.handleMessage(data));
    }

    // loadCart(rom: number[], name: string, cartInfo: any) {
        
    //     this.boneThread.start((threadHandler)=>{
    //         const createCommand = 'create';
    //         this.nesInterop = threadHandler.nesInterop;
    //         threadHandler.postNesMessage({ command: createCommand,
    //             vbuffer: this.ppu.byteOutBuffer,
    //             abuffer: this.WaveForms.SharedBuffer,
    //             audioSettings: this.SoundBopper.cloneSettings(),
    //             iops: this.nesInterop });

    //         CartLoader.doLoadCart(rom, name, this, cartInfo).subscribe((cart) => {
    //             this.Cart.realCart = cart;
                
    //             this.Cart.ROMHashFunction = this.Cart.realCart.ROMHashFunction;
    //             this.Cart.CartName = this.Cart.realCart.CartName = name;
    //             this.ppu.chrRomHandler = this.Cart.realCart;
    //             this.tileDoodler = new TileDoodler(this.ppu);
    //             this.postNesMessage({ command: 'loadrom', rom: rom, name: this.Cart.CartName });
    
    //         });                
    //     });
    //     this.boneThread.nesMessageData.subscribe((data)=>this.handleMessage(data));


    // }
}

class WishboneCPPU extends ChiChiCPPU {
    constructor(soundBopper: WishBopper, ppu: WishbonePPU) {
        super(soundBopper, ppu);
    }

    Step(): void {}
    Execute(): void {}
    flushHistory = false;
}
