import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Emulator } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { AudioSettings } from 'chichi';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { IAudioHandler } from '../../services/wishbone/wishbone.audio';

@Component({
  selector: 'chichi-audiosettings',
  templateUrl: './chichi.audiosettings.html',
  styleUrls: ['./chichi.audiosettings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AudioSettingsComponent {
    audioSettings: AudioSettings = new AudioSettings();

    wishbone: WishboneMachine;
    audioHandler: IAudioHandler;

    constructor(public nesService: Emulator ) {
        this.wishbone = nesService.wishbone;

        this.wishbone.asObservable().subscribe((machine) => {
            if (machine && machine.SoundBopper) {
                this.audioSettings = this.wishbone.SoundBopper.audioSettings;
                this.audioHandler = this.wishbone.SoundBopper.audioHandler;
            }
        });
    }

    get volume(): number {
        return this.audioHandler ? this.audioHandler.gainNode.gain.value : 0;
    }

    volumeChange(e) {
        if (this.audioHandler)
        this.audioHandler.gainNode.gain.value  = e.value;
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
