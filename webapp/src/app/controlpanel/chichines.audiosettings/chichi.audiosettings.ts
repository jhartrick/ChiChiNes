import { Component } from '@angular/core';
import { Emulator } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { AudioSettings } from 'chichi';
import { WishboneMachine } from '../../services/wishbone/wishbone';

@Component({
  selector: 'chichi-audiosettings',
  templateUrl: './chichi.audiosettings.html',
  styleUrls: ['./chichi.audiosettings.css']
})

export class AudioSettingsComponent {
    audioSettings: AudioSettings = new AudioSettings();

    wishbone: WishboneMachine;


    constructor(public nesService: Emulator ) {
        this.wishbone = nesService.wishbone;
        this.wishbone.asObservable().subscribe((machine) => {
            if (machine && machine.SoundBopper) {
                this.audioSettings = machine.SoundBopper.audioSettings;
            }
        });
    }

    get enableSquare0(): boolean {
        return this.audioSettings.enableSquare0;
    }

    set enableSquare0(value: boolean) {
        this.audioSettings.enableSquare0 = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
        // this.wishbone.RequestSync();
    }

    get enableSquare1(): boolean {
        return this.audioSettings.enableSquare1;
    }

    set enableSquare1(value: boolean) {
        this.audioSettings.enableSquare1 = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
       // this.wishbone.RequestSync();
    }

    get enableTriangle(): boolean {
        return this.audioSettings.enableTriangle;
    }

    set enableTriangle(value: boolean) {
        this.audioSettings.enableTriangle = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
        // this.wishbone.RequestSync();
    }

    get enableNoise(): boolean {
        return this.audioSettings.enableNoise;
    }

    set enableNoise(value: boolean) {
        this.audioSettings.enableNoise = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
       // this.wishbone.RequestSync();
    }


}
