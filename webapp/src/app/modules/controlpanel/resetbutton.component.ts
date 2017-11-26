import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';

@Component({
    selector: 'controlpanel-resetbutton',
    templateUrl: './resetbutton.component.html',
    })
    export class ResetButtonComponent {

        reset() {
            this.wishbone.Reset();
        }

        constructor(private wishbone: WishboneMachine) {
        }

    }
