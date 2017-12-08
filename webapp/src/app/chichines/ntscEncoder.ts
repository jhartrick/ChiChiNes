import * as THREE from 'three';
import { NESService } from '../services/NESService';

export class NTSCEncoder {
    private buf: SharedArrayBuffer = new SharedArrayBuffer(256 * 256 * 4);
    // private outBuffer: Uint32Array = new Uint32Array(<any>this.buf, 0, 256 * 256);
    private outBuf8: Uint8Array = new Uint8Array(<any>this.buf);
    private vertexShader = `
    varying vec2 v_texCoord;
    void main()
    {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        v_texCoord = uv.st;
    }
    `;

    private fragmentShader = `
    uniform sampler2D myTexture;
    varying vec2 v_texCoord;

    void main()	{
        vec2 texCoord = vec2(v_texCoord.s, 1.0 - v_texCoord.t);
        vec4 color = texture2D(myTexture, texCoord);

        gl_FragColor = vec4(color.rgb, 1.0);
    }
    `;


    private signal_levels = new Float32Array(256 * 8);
    private ppuCycle = 0;
    constructor(private nesService: NESService) {
        this.signal_levels.fill(0);
        this.outBuf8.fill(0);
    }

    createMaterial(): THREE.Material {
        const vbuffer = this.nesService.videoBuffer;

        const geometry = new THREE.PlaneBufferGeometry(5, 5);
        const text = new THREE.DataTexture(this.outBuf8, 256, 256, THREE.RGBAFormat);

        const pal =  new Uint8Array(256 * 4);
        const p32 = this.nesService.defaultPalette;
        for (let i = 0; i < 256; i++) {
            const color = p32[i & 0x3f];
            pal[i * 4] = color & 0xff;
            pal[(i * 4) + 1] = (color >> 8) & 0xff;
            pal[(i * 4) + 2] = (color >> 16) & 0xff;
            pal[(i * 4) + 3] =  0xff;
        }
        const paltext = new THREE.DataTexture(pal, 256, 1, THREE.RGBAFormat);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                myTexture: { value: text },
                myPalette: { value: paltext }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        });

        this.render = () => {
            this.ppuCycle = (this.ppuCycle + 1) & 3;
            let phase = (this.ppuCycle * 8) % 12;
            for (let y = 0; y < 256; y += 1) {
                phase = (phase + 8) % 12;
                for (let x = 0; x < 256; x += 1) {
                    const vpos = ((y * 256) + x) << 2;
                    this.renderNTSCPixel(this.ppuCycle, vbuffer[vpos], x);
                }
                for (let x = 0; x < 256; x += 1) {
                    const vpos = ((y * 256) + x) << 2;

                    const pixel  = this.renderPixel(x , y, phase, vpos );
                    // const pixel = 0xff00ff00;

                }
            }
            // render scanline
            text.needsUpdate = true;
        };
        return material;
    }

    // generate ntsc signals for a  pixel
    private signal(pixel: number, phase: number): number {
        // Voltage levels, relative to synch voltage
        const black = .518;
        const white = 1.962;
        const attenuation = .746;

        const levels = [350, .518, .962, 1.550,  // Signal low
                        1.094, 1.506, 1.962, 1.962 ]; // Signal high

        // Decode the NES color.
        const color = (pixel & 0x0F);   // 0..15 "cccc"
        let level = (pixel >> 4) & 3;  // 0..3  "ll"
        const emphasis = 0;//(pixel >> 8) & 0x7;   // 0..7  "eee"
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

    private renderNTSCPixel(PPU_cycle_counter: number, pixel: number, x: number) {
        const signal_levels = this.signal_levels;
        const phase = (PPU_cycle_counter * 8) % 12;

        for (let p = 0; p < 8; ++p) {
            // Each pixel produces distinct 8 samples of NTSC signal.
            let signal = this.signal(pixel, phase + p); // Calculated as above
            // Optionally apply some lowpass-filtering to the signal here.
            // Optionally normalize the signal to 0..1 range:
            const black = .518;
            const white = 1.962;

            signal = (signal - black) / (white - black);
            // Save the signal for this pixel.
            signal_levels[ (x * 8) + p ] = signal;
        }

    }

    private renderPixel(x: number, y: number, phase: number, vpos: number) {

        const width = 256; // Input: Screen width. Can be not only 256, but anything up to 2048.
                        // Input: This should the value that was PPU_cycle_counter * 8 + 3.9
                        // at the BEGINNING of this scanline. It should be modulo 12.
                        // It can additionally include a floating-point hue offset.

        // // Determine the region of scanline signal to sample. Take 12 samples.
        const center = x * (256 * 8) / width + 0;
        let begin = center - 6;

        if (begin < 0) {
            begin = 0;
        }
        let end   = center + 6;
        if (end > 256 * 8) {
                end = 256 * 8;
        }

        let cy = 0, ci = 0, cq = 0; // Calculate the color in YIQ.
        for (let p1 = begin; p1 < end; ++p1) {
            const level = this.signal_levels[p1] / 12;
            cy  =  cy + level;
            ci  =  ci + level * Math.cos( Math.PI * (phase + p1) / 6 );
            cq  =  cq + level * Math.sin( Math.PI * (phase + p1) / 6 );
        }

        const gamma = 2.0; // Assumed display gamma
        const gammafix = ( f: number) => {
            return f <= 0.0 ? 0.0 : Math.pow(f, 2.2 / gamma);
        };

        const clamp = (v: number) => {
            return v > 255 ? 255 : v;
        };

        const r = (cy +  (0.946882 * ci) +  (0.623557 * cq)) * 255;

        const g =  255 * (cy + (-0.274788 * ci) + (-0.635691 * cq));
        const b =  255 * (cy + (-1.108545 * ci) +  (1.709007 * cq));

        this.outBuf8[vpos + 0] = r; // red
        this.outBuf8[vpos + 1] = g; // green
        this.outBuf8[vpos + 2] = b; // blue;
        this.outBuf8[vpos + 3] = 0xff;
    }

    render() {

    }
}
