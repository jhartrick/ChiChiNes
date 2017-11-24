import { Component, Input } from "@angular/core";
import { LocalAudioSettings } from "../services/wishbone/wishbone.audio.localsettings";
import { NESService } from "../services/NESService";

@Component({
    selector: 'controlpanel-volume',
    template: `
    <div style="background-color: #CCC; display:flex; flex-direction: row; width: max-content;">
        <mat-slider style="margin: 4px;" [value]="localSettings.volume" (change)="localSettings.volume = $event.source.value;" min="0" max="1" step="0.05" value="0.75"></mat-slider>
    </div>
    `
    })
    export class VolumeComponent {
        @Input() data: any;
        localSettings: LocalAudioSettings;
        constructor(private nesService: NESService) {
            this.localSettings = this.nesService.audioSettings;
        }
        onclick = () => {
            this.localSettings.muted = !this.localSettings.muted;
        }

    }
