import { Component, Input } from '@angular/core';
import { NESService } from '../../services/NESService';
import { PopoverContent } from './popover/popover.content';
import { CartLoaderComponent } from '../controlpanel/cartloader.component';
import { ControlConfigComponent } from '../controlpad/controlpad.component';
import { ICartSettings } from '../../services/ICartSettings';
import { CartInfoComponent } from '../cartinfo/cartinfo-main.component';


@Component({
    selector: 'chichi-toolstrip',
    templateUrl: 'toolstrip.component.html',
    styleUrls: ['toolstrip.component.css']
    })
    export class ToolStripComponent {
    cartSettings: ICartSettings;
        constructor(private nesService: NESService) {
            this.cartSettings = nesService.cartSettings;
            nesService.cartChanged.subscribe((cart: ICartSettings)=> {
                this.cartSettings = cart;
            })
        }

        fileHandlerButton(): PopoverContent {
            return new PopoverContent(CartLoaderComponent, {});
        }

        controlConfigButton(): PopoverContent {
            return new PopoverContent(ControlConfigComponent, {});
        }

        cartInfoButton(): PopoverContent {
            return new PopoverContent(CartInfoComponent, {});
        }

        

        muteToggle() {
            this.nesService.audioSettings.muted = !this.nesService.audioSettings.muted;
        }
    }
