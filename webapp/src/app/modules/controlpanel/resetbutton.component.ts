import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { WishboneWorker } from '../../services/wishbone/wishbone.worker';

@Component({
    selector: 'controlpanel-resetbutton',
    templateUrl: './resetbutton.component.html',
    })
    export class ResetButtonComponent {

        reset() {
            this.worker.reset();
        }

        constructor(private worker: WishboneWorker) {
        }

    }
