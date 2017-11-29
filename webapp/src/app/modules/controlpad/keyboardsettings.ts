
import { NgZone, Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";
import { WishboneWorkerInterop } from "../../services/wishbone/wishbone.worker.interop";
import { WishBoneControlPad } from "./wishbone.controlpad";

@Injectable()
export class WishboneKeyboardSettings {

    padTwo: WishBoneControlPad;
    padOne: WishBoneControlPad;
    kuSub: Subscription;
    kdSub: Subscription;
    keydownEvent: Observable<any> = Observable.fromEvent(document, 'keydown');
    keyupEvent: Observable<any> = Observable.fromEvent(document, 'keyup');

    constructor(private interop: WishboneWorkerInterop) {
        this.padOne = new WishBoneControlPad('padOne');
        this.padOne.controlByteChange().subscribe((val:number)=>{
            this.interop.controlPad0 = val;
        })

        this.padTwo = new WishBoneControlPad('padTwo');
        this.padTwo.controlByteChange().subscribe((val:number)=>{
            this.interop.controlPad1 = val;
        })
        
        const zone = new NgZone({enableLongStackTrace: false});

        zone.runOutsideAngular(() => {
            if (this.kdSub) {
                this.kdSub.unsubscribe();
                this.kuSub.unsubscribe();
            }
            this.kdSub = this.keydownEvent.subscribe((event) => {
                this.padOne.handleKeyDownEvent(event);
                this.padTwo.handleKeyDownEvent(event);
                
            });
            this.kuSub = this.keyupEvent.subscribe((event) => {
                this.padOne.handleKeyUpEvent(event);
                this.padTwo.handleKeyUpEvent(event);
            });
        });
    

    }

}
