import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Emulator } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { AudioSettings } from 'chichi';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { IAudioHandler } from '../../services/wishbone/wishbone.audio';
import { LocalAudioSettings } from '../../services/wishbone/wishbone.audio.localsettings';

@Component({
  selector: 'chichi-audiosettings',
  templateUrl: './chichi.audiosettings.html',
  styleUrls: ['./chichi.audiosettings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AudioSettingsComponent {
    audioSettings: AudioSettings ;
    wishbone: WishboneMachine;
    muted= false;

    constructor(public nesService: Emulator ) {
        this.wishbone = nesService.wishbone;
        this.audioSettings = this.wishbone.SoundBopper.audioSettings;

        this.wishbone.asObservable().subscribe((machine) => {
            if (machine && machine.SoundBopper) {
                this.audioSettings = this.wishbone.SoundBopper.audioSettings;
            }
        });
    }

    syncAudioSettings() {
        this.wishbone.RequestSync();
    }
}
