import { AudioSettings } from './ChiChiTypes'
import { DMCChannel } from './Audio/DMCChannel';
import { SquareChannel } from './Audio/SquareChannel';
import { TriangleChannel } from './Audio/TriangleChannel';
import { NoiseChannel } from './Audio/NoiseChannel';

import { Blip, WavSharer } from './Audio/CommonAudio';

export class ChiChiBopper {

    set audioSettings(value: AudioSettings) {
        this.EnableNoise = value.enableNoise;
        this.EnableSquare0 = value.enableSquare0;
        this.EnableSquare1 = value.enableSquare1;
        this.enableTriangle = value.enableTriangle;
        this.writer.synced = value.synced;
        if (value.sampleRate != this._sampleRate) {
            this._sampleRate = value.sampleRate;
        }
    }

    get audioSettings(): AudioSettings {
        const settings =  {
            sampleRate: this._sampleRate,
            master_volume: 1.0,
            enableSquare0: this.EnableSquare0,
            enableSquare1: this.EnableSquare1,
            enableTriangle: this.enableTriangle,
            enableNoise: this.EnableNoise,
            enablePCM: false,
            synced: this.writer.synced
        };
        return settings;
    }

    lastClock: number;
    throwingIRQs: boolean = false;
    reg15: number = 0;
    // blipper
    private myBlipper: Blip;
    // channels 
    private square0: SquareChannel;
    private square1: SquareChannel;

    private triangle: TriangleChannel;
    private noise: NoiseChannel;
    private dmc: DMCChannel;


    private _sampleRate = 44100;
    private static clock_rate = 1789772.727;
    private master_vol = 4369;
    private square0Gain = 873;
    private square1Gain = 873;
    private triangleGain = 1004;
    private noiseGain = 567;
    private muted = false;
    private lastFrameHit = 0;

    currentClock = 0;
    frameClocker = 0;

    constructor(public writer: WavSharer) {
        this.RebuildSound();
    }
    get SampleRate(): number {
        return this._sampleRate;
    }

    set sampleRate(value: number) {
        this._sampleRate = value;
        this.RebuildSound();
    }

    //Muted: boolean;
    InterruptRaised: boolean = true;
    get EnableSquare0(): boolean {
        return this.square0.gain > 0;
    }

    set EnableSquare0(value: boolean) {
        this.square0.gain = value ? this.square0Gain : 0;
    }

    get EnableSquare1(): boolean {
        return this.square1.gain > 0;
    }

    set EnableSquare1(value: boolean) {
        this.square1.gain = value ? this.square1Gain : 0;
    }

    get enableTriangle(): boolean {
        return this.triangle.gain > 0;
    }

    set enableTriangle(value: boolean) {
        this.triangle.gain = value ? this.triangleGain : 0;
    }

    get EnableNoise(): boolean {
        return this.noise.gain > 0;
    }

    set EnableNoise(value: boolean) {
        this.noise.gain = value ? this.noiseGain : 0;
    }

    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;

    RebuildSound(): void {
        this.myBlipper = new Blip(this._sampleRate / 5);
        this.myBlipper.blip_set_rates(ChiChiBopper.clock_rate, this._sampleRate);
        //this.writer = new ChiChiNES.BeepsBoops.WavSharer();
        this.writer.audioBytesWritten = 0;

        this.square0Gain = 873;
        this.square1Gain = 873;
        this.triangleGain = 1004;
        this.noiseGain = 567;

        this.square0 = new SquareChannel(this.myBlipper, 0);
        this.square0.gain = this.square0Gain;
        this.square0.period = 10;
        this.square0.sweepComplement = true;

        this.square1 = new SquareChannel(this.myBlipper, 0);
        this.square1.gain = this.square1Gain;
        this.square1.period = 10;
        this.square1.sweepComplement = false;

        this.triangle = new TriangleChannel(this.myBlipper, 2);
        this.triangle.gain = this.triangleGain; this.triangle.period = 0;

        this.noise = new NoiseChannel(this.myBlipper, 3);
        this.noise.gain = this.noiseGain; this.noise.period = 0;

        this.dmc = new DMCChannel(this.myBlipper, 4, null);
      //  this.dmc.Gain = 873; this.dmc.Period = 10;
    }

    GetByte(Clock: number, address: number): number {
        if (address === 0x4000) {
            this.InterruptRaised = false;
        }
        if (address === 0x4015) {
            return ((this.square0.length > 0) ? 1 : 0) | ((this.square1.length > 0) ? 2 : 0) | ((this.triangle.length > 0) ? 4 : 0) | ((this.square0.length > 0) ? 8 : 0) | (this.InterruptRaised ? 64 : 0);
        } else {
            return 66;
        }
    }

    
    SetByte(clock: number, address: number, data: number): void {
        if (address === 16384) {
            this.InterruptRaised = false;
        }
        switch (address) {
            case 0x4000:
            case 0x4001:
            case 0x4002:
            case 0x4003:
                this.square0.writeRegister(address - 0x4000, data, clock);
                break;
            case 0x4004:
            case 0x4005:
            case 0x4006:
            case 0x4007:
                this.square1.writeRegister(address - 0x4004, data, clock);
                break;
            case 0x4008:
            case 0x4009:
            case 0x400a:
            case 0x400b:
                this.triangle.writeRegister(address - 0x4008, data, clock);
                break;
            case 0x400c:
            case 0x400d:
            case 0x400e:
            case 0x400f:
                this.noise.writeRegister(address - 0x400c, data, clock);
                break;
            case 0x4010:
            case 0x4011:
            case 0x4012:
            case 0x4013:
                // dmc.WriteRegister(address - 0x40010, data, Clock);
                break;
            case 0x4015:
                this.reg15 = data;
                this.square0.writeRegister(4, data & 1, clock);
                this.square1.writeRegister(4, data & 2, clock);
                this.triangle.writeRegister(4, data & 4, clock);
                this.noise.writeRegister(4, data & 8, clock);
                break;
            case 0x4017:
                this.throwingIRQs = ((data & 64) !== 64);
                //this.endFrame(clock);
                //this.lastFrameHit = 0;
                break;
        }
    }

    advanceClock(ticks: number) {
        this.currentClock += ticks;
        this.frameClocker += ticks;
        if (this.frameClocker > 7445) {
            this.updateFrame(this.currentClock);
            this.frameClocker -= 7445;
        }
    }

    updateFrame(time: number): void {
        this.runFrameEvents(time, this.lastFrameHit);
        if (this.lastFrameHit === 3) {
            this.lastFrameHit = 0;
            this.endFrame(time)
            if (this.throwingIRQs) {
                this.InterruptRaised = true;
                this.NMIHandler();
            }

        } else {
            this.lastFrameHit++;
        }
    }

    runFrameEvents(time: number, step: number): void {
        this.triangle.frameClock(time, step);
        this.noise.FrameClock(time, step);
        this.square0.frameClock(time, step);
        this.square1.frameClock(time, step);
    }

    endFrame(time: number): void {
        
        this.square0.endFrame(time);
        this.square1.endFrame(time);
        this.triangle.endFrame(time);
        this.noise.EndFrame(time);

        this.myBlipper.blip_end_frame(time);

        this.myBlipper.ReadElementsLoop(this.writer);

        this.currentClock = 0;
        
    }

}
