import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { WishboneMachine } from "./wishbone/wishbone";
import { ChiChiCPPU, AudioSettings, ChiChiPPU, BaseCart, RunningStatuses } from 'chichi';
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

    public defaultPalette: number[] = [7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    constructor(public wishbone: WishboneMachine, private worker: WishboneWorker) {
        this.audioHandler = new ChiChiThreeJSAudio(this.wishbone.WaveForms);
        this.audioSettings = this.audioHandler.getSound();

        wishbone.statusChanged.subscribe((status) => {
            if (!this.audioSettings.muted || this.audioSettings.volume > 0 ) {
                this.audioSettings.muted = (status !== RunningStatuses.Running); 
            }
        });


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


    setupCart(cart: BaseCart, rom: ArrayBuffer) {

        this.worker.createAndLoadRom(cart, rom, { 
            vbuffer: this.vbuffer,
            abuffer: this.audioSettings.abuffer            
        }).subscribe(()=>{
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
        }) 
    }

    get isDebugging(): boolean {
        return false;
    }

    SetDebugCallbackFunction(callback: () => void) {
    }
 
}
