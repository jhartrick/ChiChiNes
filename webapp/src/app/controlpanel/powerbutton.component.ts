import { Component } from "@angular/core";
import { RomLoader } from "../services/cartloader";
import { NESService } from "../services/NESService";

@Component({
    selector: 'controlpanel-powerbutton',
    templateUrl: './powerbutton.component.html',
    })
    export class PowerButtonComponent {

        powerButtons: any =
        [
            {
                icon: 'chip',
                click: () => {
                    this.reset();
            }
        },
            {
                icon: 'power',
                click: () => {
                    this.powertoggle();
                }
            },
        ];

        powerstate: boolean = false;
        powertoggle() {
            if (this.powerstate === false) {
                this.poweron();
            } else {
                this.poweroff();
            }
        }
        poweron() {
            this.nesService.wishbone.Run();
            this.powerstate = true;
        }
    
        poweroff() {
            this.nesService.wishbone.PowerOff();
            this.powerstate = false;
        }

        reset() {
            this.nesService.wishbone.Reset();
        }
        constructor(private nesService: NESService) {
            
        }

    }
