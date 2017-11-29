import { Component, ChangeDetectorRef } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { WishboneWorker } from '../../services/wishbone/wishbone.worker';
import { RunningStatuses } from 'chichi';

@Component({
        selector: 'controlpanel-powerbutton',
        templateUrl: './powerbutton.component.html',

    })
    export class PowerButtonComponent {
        status: RunningStatuses = RunningStatuses.Off;
        powertoggle() {
            debugger;
            if (this.status === RunningStatuses.Running ) {
                this.worker.pause();
            } else {
                this.worker.run();
            }
        }

        get icon(): string {
            if (this.status === RunningStatuses.Running ) {
                return 'pause';
            } else {
                return 'play';
            }
        }

        constructor(private worker: WishboneWorker, private wishbone: WishboneMachine, private cd: ChangeDetectorRef) {
            this.wishbone.statusChanged.subscribe(() => {
                this.status = wishbone.runningStatus;
                cd.detectChanges();
            });
        }

    }
