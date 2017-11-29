import { NESService } from '../../services/NESService';
import { Component, Inject, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { WishboneKeyboardSettings } from './keyboardsettings';
import { KeyBindings } from './wishbone.keybindings';

@Component({
  selector: 'controlpad-dialog',
  templateUrl: './controlpad.dialog.component.html',
  styleUrls: ['./controlpad.dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ControlDialogComponent {
    wishbone: WishboneMachine;
    controls: KeyBindings = new KeyBindings();
    controls2: KeyBindings = new KeyBindings();

    currCapture: KeyBindings;

    origControls: KeyBindings;
    origControls2: KeyBindings;
    capturing = false;
    captureType = '';
    sub: Subscription;
    keydownEvent: Observable<any> = Observable.fromEvent(document, 'keydown');

    constructor(
        public dialogRef: MatDialogRef<ControlDialogComponent>,
        private keysettings: WishboneKeyboardSettings,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef
    ) {
        this.wishbone = data.wishbone;
        this.origControls = Object.assign({}, this.keysettings.padOne.bindings);
        this.origControls2 = Object.assign({}, this.keysettings.padTwo.bindings);
        this.controls = Object.assign({}, this.keysettings.padOne.bindings);
        this.controls2 = Object.assign({}, this.keysettings.padTwo.bindings);

        this.sub = this.keydownEvent.subscribe((event) => { this.handleKeyDownEvent(event); });
    }

    handleKeyDownEvent(event: KeyboardEvent) {
        if (this.capturing) {
            console.log(this.captureType + ' ' + event.keyCode );
            this.currCapture[this.captureType] = event.keyCode;
        }
    }

    keyName(keyCode: number): string {
        return KeyBindings.keys[keyCode.toString()];
    }

    captureInput(event: any, type: string, captureFor: KeyBindings) {
        // debugger;
        this.currCapture = captureFor;
        this.captureType = type;
        this.capturing = event.value;
        this.cd.detectChanges();
    }

    applyBindings() {
        this.keysettings.padOne.attach(this.controls);
        this.keysettings.padTwo.attach(this.controls2);
        this.sub.unsubscribe();

        this.dialogRef.close();
        this.capturing = false;
    }

    onNoClick(): void {
        this.keysettings.padOne.attach(this.origControls);
        this.keysettings.padTwo.attach(this.origControls2);
        this.sub.unsubscribe();
        this.dialogRef.close();
        this.capturing = false;
    }
}
