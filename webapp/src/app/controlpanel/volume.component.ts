import { Component } from "@angular/core";
import { LocalAudioSettings } from "../services/wishbone/wishbone.audio.localsettings";
import { NESService } from "../services/NESService";

@Component({
    selector: 'controlpanel-volume',
    template: `
    <div style="background-color: #CCC; width: 200px;">
        <mat-button-toggle [checked]="localSettings.muted" (change)="localSettings.muted = $event.source.checked;">
        {{ localSettings.muted ? 'muted' : 'sound' }}
        </mat-button-toggle>
        <mat-slider [value]="localSettings.volume" (change)="localSettings.volume = $event.source.value;" min="0" max="1" step="0.05" value="0.75"></mat-slider>
    </div>
    `
    })
    export class VolumeComponent {
        localSettings: LocalAudioSettings;
        constructor(private nesService: NESService) {
            this.localSettings = this.nesService.audioSettings;
        }
    }
