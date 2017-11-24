import { Component } from "@angular/core";
import { RomLoader } from "../services/cartloader";
import { NESService } from "../services/NESService";
import { ICartSettings } from "../services/ICartSettings";

@Component({
    selector: 'controlpanel-powerbutton',
    templateUrl: './powerbutton.component.html',
    })
    export class PowerButtonComponent {
        cartSettings: ICartSettings;
        
        powerButtons: any =
        [
            {
                icon: 'power',
                click: () => {
                    this.powertoggle();
                }
            },
            {
                icon: 'reset',
                click: () => {
                    this.reset();
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
            this.nesService.cartChanged.subscribe((settings) => {
                this.cartSettings = settings;
            });
        }

    }
