import { Blip } from "./CommonAudio";
import { ChiChiCPPU } from "../ChiChiMachine";

export class NoiseChannel {
    private _bleeper: any = null;
    private _chan = 0;
    private noisePeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
    private lengthCounts = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
    private _time = 0;
    private _envConstantVolume = false;
    private _envVolume = 0;
    private amplitude = 0;
    private _phase = 0;
    private _envTimer = 0;
    private _envStart = false;

    length = 0;
    period = 0;
    volume = 0;
    looping = false;
    gain = 0;
    enabled = true;

    constructor(bleeper: Blip, chan: number) {
        this._bleeper = bleeper;
        this._chan = chan;
        this._phase = 1;
        this._envTimer = 15;

    }

    Length: number;

    writeRegister(register: number, data: number, time: number): void {
        // Run(time);

        switch (register) {
            case 0:
                this._envConstantVolume = (data & 16) === 16;
                this.volume = data & 15;
                this.looping = (data & 128) === 128;
                break;
            case 1:
                break;
            case 2:
                this.period = this.noisePeriods[data & 15];
                // _period |= data;
                break;
            case 3:
                // setup length
                if (this.enabled) {
                    this.length = this.lengthCounts[(data >> 3) & 31];
                }
                this._envStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this.length = 0;
                }
                break;
        }
    }

    Run(end_time: number): void {
        var volume = this._envConstantVolume ? this.volume : this._envVolume;
        if (this.length === 0) {
            volume = 0;
        }
        if (this.period === 0) {
            this._time = end_time;
            this.UpdateAmplitude(0);
            return;
        }

        if (this._phase === 0) {
            this._phase = 1;
        }

        for (; this._time < end_time; this._time += this.period) {
            var new15;
            if (this.looping) {
                new15 = ((this._phase & 1) ^ ((this._phase >> 6) & 1));
            } else {
                new15 = ((this._phase & 1) ^ ((this._phase >> 1) & 1));
            }
            this.UpdateAmplitude(this._phase & 1 * volume);
            this._phase = ((this._phase >> 1) | (new15 << 14)) & 65535;



        }
    }

    UpdateAmplitude(amp: number) {
        var delta = amp * this.gain - this.amplitude;
        this.amplitude += delta;
        this._bleeper.blip_add_delta(this._time, delta);
    }

    EndFrame(time: number) {
        this.Run(time);
        this._time = 0;
    }

    FrameClock(time: number, step: number) {
        this.Run(time);

        if (!this._envStart) {
            this._envTimer--;
            if (this._envTimer === 0) {
                this._envTimer = this.volume + 1;
                if (this._envVolume > 0) {
                    this._envVolume--;
                } else {
                    this._envVolume = this.looping ? 15 : 0;
                }

            }
        } else {
            this._envStart = false;
            this._envTimer = this.volume + 1;
            this._envVolume = 15;
        }

        switch (step) {
            case 1:
            case 2:
                if (!this.looping && this.length > 0) {
                    this.length--;
                }
                break;
        }
    }
}
