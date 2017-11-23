import { Component, Input } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';

class ButtonDef {
    icon? = '';
    name? = '';
    click?: () => void = () => {
    }
}

@Component({
  selector: 'buttonchain',
  templateUrl: './buttonchain.component.html',
  styleUrls: ['./buttonchain.component.css']
})
export class ButtonChainComponent {
    @Input('buttons')
    buttons: ButtonDef[] = new Array<ButtonDef>();

    floatClass = 'hidden';

    constructor() {
        this.buttons.push({ icon: 'chip', name: 'test1', click: () => {
            console.log('click');
        }});
        this.buttons.push({ icon: 'gamepad', name: 'test1', click: () => {
            console.log('gamepad');
        }});
        this.buttons.push({ icon: 'power', name: 'test1', click: () => {
            console.log('power');
        }});
    }
    float() {
        this.floatClass = 'floater';
    }

    onClickButton(buttonNumber: number) {
        this.buttons[buttonNumber].click();
    }
}
