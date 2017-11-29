import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs";

import { KeyBindings } from "./wishbone.keybindings";

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

    constructor(private controllerId: string) {
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