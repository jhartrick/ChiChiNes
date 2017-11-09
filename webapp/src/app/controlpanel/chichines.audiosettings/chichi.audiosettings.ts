﻿import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Emulator } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { AudioSettings } from 'chichi';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { IAudioHandler, LocalAudioSettings } from '../../services/wishbone/wishbone.audio';

@Component({
  selector: 'chichi-audiosettings',
  templateUrl: './chichi.audiosettings.html',
  styleUrls: ['./chichi.audiosettings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AudioSettingsComponent {
    audioSettings: AudioSettings ;
    localSettings: LocalAudioSettings ;
    wishbone: WishboneMachine;
    muted= false;

    constructor(public nesService: Emulator ) {
        this.wishbone = nesService.wishbone;
        this.audioSettings = this.wishbone.SoundBopper.audioSettings;
        this.localSettings = this.wishbone.SoundBopper.localSettings;

        this.wishbone.asObservable().subscribe((machine) => {
            if (machine && machine.SoundBopper) {
                this.audioSettings = this.wishbone.SoundBopper.audioSettings;
                this.localSettings = this.wishbone.SoundBopper.localSettings;
            }
        });
    }

    syncAudioSettings() {
        this.wishbone.RequestSync();
    }
}
