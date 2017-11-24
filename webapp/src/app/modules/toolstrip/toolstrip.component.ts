import { Component, Input } from '@angular/core';
import { NESService } from '../../services/NESService';
import { PopoverContent } from './popover/popover.content';
import { CartLoaderComponent } from '../controlpanel/cartloader.component';

@Component({
    selector: 'chichi-toolstrip',
    templateUrl: 'toolstrip.component.html',
    styleUrls: ['toolstrip.component.css']
    })
    export class ToolStripComponent {
        constructor(private nesService: NESService) {
        }

        fileHandlerButton(): PopoverContent {
            return new PopoverContent(CartLoaderComponent, {});
        }

        muteToggle() {
            this.nesService.audioSettings.muted = !this.nesService.audioSettings.muted;
        }
    }
