import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { WishboneWorker } from '../../services/wishbone/wishbone.worker';

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
            this.worker.run();
            this.powerstate = true;
        }

        poweroff() {
            this.worker.powerOff();
            this.powerstate = false;
        }

        constructor(private worker: WishboneWorker) {
        }

    }
