import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { WishboneWorker } from '../../services/wishbone/wishbone.worker';
import { RunningStatuses } from 'chichi';

@Component({
        selector: 'controlpanel-stopbutton',
        template: `<button *ngIf='show' (click)='worker.stop()' mat-fab >
        <mat-icon svgIcon='stop'></mat-icon>
    </button>
    `
    })
    export class StopButtonComponent {

        show = false;

        constructor(private worker: WishboneWorker, private wishbone: WishboneMachine) {
            this.show = this.wishbone.runningStatus === RunningStatuses.Running;
            this.wishbone.statusChanged.subscribe(() => {
                this.show = this.wishbone.runningStatus === RunningStatuses.Running;
            });
        }

    }
