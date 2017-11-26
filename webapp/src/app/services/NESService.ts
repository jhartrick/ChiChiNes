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
import { WramManager } from './wishbone/wishbone.wrammanger';

@Injectable()
export class NESService {
    cartSettings: ICartSettings;
    audioSettings: ThreeJSAudioSettings;

    // events
    cartChanged = new EventEmitter<ICartSettings>(true);
    runStatusChanged = new EventEmitter<string>(true);
    onDebug: EventEmitter<any> = new EventEmitter<any>();
    
    private vbuffer: Uint8Array = new Uint8Array(<any>new SharedArrayBuffer(256 * 256 * 4));
    get videoBuffer(): Uint8Array {
        return this.vbuffer;
    }
    
    private audioHandler: ChiChiThreeJSAudio;

    constructor(public wishbone: WishboneMachine, private worker: WishboneWorker) {
        this.audioHandler = new ChiChiThreeJSAudio(this.wishbone.WaveForms);
        this.audioSettings = this.audioHandler.getSound();

        const statusMsgs = this.worker.nesMessageData
            .filter( (data)=> data.status ? true : false)
            .subscribe((data) => {
                this.runStatusChanged.emit(data.status);
        });

        const debugMsgs = this.worker.nesMessageData
            .filter( (data)=> data.debug ? true : false)
            .subscribe((data) => {
                this.onDebug.emit(data.debug);
        });
    }

    saveState(){
        const r = this.wishbone.Cart.realCart ;
        if (r)
        {
            let obs = this.worker.nesMessageData.filter((d)=>d.state ? true: false).subscribe((d) => {
                localStorage.setItem(r.ROMHashFunction + '_state', JSON.stringify(d.state));
                obs.unsubscribe();
            });

            this.worker.postNesMessage({ command: 'getstate' })
        }
    }

    restoreState() {
        const r = this.wishbone.Cart.realCart ;
        if (r)
        {
            let item = localStorage.getItem(r.ROMHashFunction + '_state');
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
            this.cartSettings =   {
                name: cart.CartName,
                mapperName: cart.mapperName,
                mapperId: cart.mapperId,
                submapperId: cart.submapperId,
                crc: cart.ROMHashFunction,
                prgRomCount: cart.prgRomCount,
                chrRomCount: cart.chrRomCount,
                wram: new WramManager(this)
            }
            
            this.cartChanged.emit(this.cartSettings);
        });
    }

    get isDebugging(): boolean {
        return false;
    }

    debugStep() {
        this.worker.postNesMessage({ command: 'step', debug: true });
    }

    debugStepFrame() {
        this.worker.postNesMessage({ command: 'runframe', debug: true });
    }
            
    continue() {
        this.worker.postNesMessage({ command: 'continue', debug: false });
    }
 

    SetDebugCallbackFunction(callback: () => void) {
    }
 
}
