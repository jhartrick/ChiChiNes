import { NESService } from '../services/NESService';

export class NTSCEncoder {
    private signal_levels = new Uint8Array(256 * 256 * 8);
    private ppuCycle = 0;
    constructor(private nesService: NESService) {
        this.signal_levels.fill(0);
    }

    private signal(pixel: number, phase: number): number {
        // Voltage levels, relative to synch voltage
        const black = .518;
        const white = 1.962;
        const attenuation = .746;

        const levels = [350, .518, .962, 1.550,  // Signal low
                        1.094, 1.506, 1.962, 1.962 ]; // Signal high

        // Decode the NES color.
        const color = (pixel & 0x0F);    // 0..15 "cccc"
        let level = (pixel >> 4) & 3;  // 0..3  "ll"
        const emphasis = (pixel >> 6);   // 0..7  "eee"
        if (color > 13) {
            level = 1;
        } // For colors 14..15, level 1 is forced.

        // The square wave for this color alternates between these two voltages:
        let low  = levels[0 + level];
        let high = levels[4 + level];
        if (color === 0) {
            low = high;
        } // For color 0, only high level is emitted
        if (color > 12) {
            high = low;
        } // For colors 13..15, only low level is emitted

        // Generate the square wave

        const inColorPhase = (c: number) => {
            return ((c + phase) % 12) < 6;
        };
        let signal = inColorPhase(color) ? high : low;

        // When de-emphasis bits are set, some parts of the signal are attenuated:
        if ( ((emphasis & 1) && inColorPhase(0))
            ||  ((emphasis & 2) && inColorPhase(4))
            ||  ((emphasis & 4) && inColorPhase(8)) ) {
            signal = signal * attenuation;
        }

        return signal;
    }

    private renderPixel(x: number, y: number, pixel: number, PPU_cycle_counter: number) {
        const signal_levels = this.signal_levels;
        const phase = PPU_cycle_counter * 8;
        for (let p = 0; p < 8; ++p) {
             // Each pixel produces distinct 8 samples of NTSC signal.
            let signal = this.signal(pixel, phase + p); // Calculated as above
            // Optionally apply some lowpass-filtering to the signal here.
            // Optionally normalize the signal to 0..1 range:
            const black = .518;
            const white = 1.962;

            signal = (signal - black) / (white - black);
            // Save the signal for this pixel.
            signal_levels[ (y * 256) +  (x * 8) + p ] = signal;
        }
    }

    render() {
        const vbuffer = this.nesService.videoBuffer;
        this.ppuCycle = (this.ppuCycle++) & 3;
        for (let i = 0; i < 256; ++i) {
            for (let j = 0; j < 256; ++j) {
                this.renderPixel(j, i, vbuffer[(i * 256) + (j * 4)], this.ppuCycle);
            }
            // render scanline
        }

    }
}
