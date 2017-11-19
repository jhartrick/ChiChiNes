import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { WishboneMachine } from "./wishbone/wishbone";
import { ChiChiCPPU, AudioSettings, ChiChiPPU, BaseCart } from 'chichi';
import { Http } from '@angular/http';
import * as crc from 'crc';
import { WishboneWorker } from './wishbone/wishbone.worker';
import { IBaseCart } from 'chichi';
import { ChiChiThreeJSAudio, ThreeJSAudioSettings } from './wishbone/wishbone.audio.threejs';
import { IBaseCartState } from '../../../../chichilib/lib/chichi/chichicarts/BaseCart';
import { ICartSettings } from './ICartSettings';


export enum RunStatus {
    Off,
    Running,
    Paused,
    DebugRunning,
    Stepping
}

export class EmuState {
    constructor(public romLoaded: string, public powerState: boolean, public paused: boolean, public debugging: boolean) {
    }
}

@Injectable()
export class Emulator {
    wishbone : WishboneMachine;
    audioSettings: ThreeJSAudioSettings;
    cartSettings: ICartSettings;
    
    cartChanged = new EventEmitter<ICartSettings>(true);

    worker: WishboneWorker;
    
    private audioHandler: ChiChiThreeJSAudio;
    
    public onDebug: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        this.wishbone = new WishboneMachine();
        this.worker = new WishboneWorker(this.wishbone);
        this.audioHandler = new ChiChiThreeJSAudio(this.wishbone.WaveForms);
        this.audioSettings = this.audioHandler.getSound();
    }

    saveState(){
        const r = this.wishbone.Cart.realCart ;
        if (r)
        {
            let obs = this.worker.nesMessageData.filter((d)=>d.state ? true: false).subscribe((d) => {
                localStorage.setItem(this.cartSettings.crc + '_state', JSON.stringify(d.state));
                obs.unsubscribe();
            });

            this.worker.postNesMessage({ command: 'getstate' })
        }
    }

    restoreState() {
        const r = this.wishbone.Cart.realCart ;
        if (r)
        {
            let item = localStorage.getItem(this.cartSettings.crc + '_state');
            if (item) {
                this.worker.postNesMessage({ command: 'setstate', state: JSON.parse(item) })
            }

        }
        
    }

    setupCart(cart: BaseCart, rom: number[]) {

        this.worker.start((threadHandler)=>{
            this.wishbone.nesInterop = threadHandler.nesInterop;

            threadHandler.postNesMessage({ 
                command: 'create',
                vbuffer: this.vbuffer,
                abuffer: this.audioSettings.abuffer,
                audioSettings: this.wishbone.SoundBopper.cloneSettings(),
                iops: this.wishbone.nesInterop
            });

            threadHandler.postNesMessage({ command: 'loadrom', rom: rom, name: cart.CartName });
            
            this.wishbone.insertCart(cart);
            this.cartSettings = {
                name: cart.CartName,
                mapperName: cart.mapperName,
                mapperId: cart.mapperId,
                submapperId: cart.submapperId,
                crc: cart.ROMHashFunction,
                prgRomCount: cart.prgRomCount,
                chrRomCount: cart.chrRomCount
            }

            this.cartChanged.emit(this.cartSettings);
        });
    }

    get isDebugging(): boolean {
        return false;
    }

    private vbuffer: Uint8Array = new Uint8Array(<any>new SharedArrayBuffer(256 * 256 * 4));

    get videoBuffer(): Uint8Array {
        return this.vbuffer;
    }

    SetDebugCallbackFunction(callback: () => void) {
    }


 
}
