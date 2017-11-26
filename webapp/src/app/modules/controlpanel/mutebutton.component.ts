import { Component } from '@angular/core';
import { NESService } from '../../services/NESService';

@Component({
    selector: 'controlpanel-mutebutton',
    templateUrl: './mutebutton.component.html',
    })
    export class MuteButtonComponent {
        lastvol: number = 1.0;

        constructor(private nesService: NESService) {
        }

        get icon(): string {
            return this.muted ? "volume-off" : "volume-high"
        }

        get muted(): boolean {
            return this.nesService.audioSettings.volume == 0;
        }
        set muted(value: boolean) {
            if (value) {
                this.lastvol = this.nesService.audioSettings.volume;
                this.nesService.audioSettings.volume = 0;
            } else {
                this.nesService.audioSettings.volume = this.lastvol;
            }
        }
        toggleMute() {
            this.muted = !this.muted;
            
        }

    }
