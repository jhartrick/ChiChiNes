import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';

@Component({
    selector: 'controlpanel-powerbutton',
    templateUrl: './powerbutton.component.html',
    })
    export class PowerButtonComponent {

        powerstate = false;
        powertoggle() {
            if (this.powerstate === false) {
                this.poweron();
            } else {
                this.poweroff();
            }
        }
        poweron() {
            this.wishbone.Run();
            this.powerstate = true;
        }

        poweroff() {
            this.wishbone.PowerOff();
            this.powerstate = false;
        }

        constructor(private wishbone: WishboneMachine) {
        }

    }
