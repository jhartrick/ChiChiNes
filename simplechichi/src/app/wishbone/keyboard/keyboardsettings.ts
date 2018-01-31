
import { NgZone, Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";
import { WishBoneControlPad } from "./wishbone.controlpad";

@Injectable()
export class WishboneKeyboardSettings {

    padTwo: WishBoneControlPad;
    padOne: WishBoneControlPad;
    kuSub: Subscription;
    kdSub: Subscription;
    keydownEvent: Observable<any> = Observable.fromEvent(document, 'keydown');
    keyupEvent: Observable<any> = Observable.fromEvent(document, 'keyup');

    constructor() {
        this.padOne = new WishBoneControlPad('padOne');
        this.padOne.controlByteChange().subscribe((val:number)=>{
        })

        this.padTwo = new WishBoneControlPad('padTwo');
        this.padTwo.controlByteChange().subscribe((val:number)=>{
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
