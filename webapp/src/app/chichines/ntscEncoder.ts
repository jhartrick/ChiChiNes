import * as THREE from 'three';
import { NESService } from '../services/NESService';

export class NTSCEncoder {
    material: THREE.ShaderMaterial;

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


    private signal_levels = new Uint8Array(256 * 8);
    private ppuCycle = 0;
    constructor(private nesService: NESService) {
        this.signal_levels.fill(0);
    }

    createScene(): THREE.Scene {
        // debugger;
        const vbuffer = this.nesService.videoBuffer;

        const geometry = new THREE.PlaneGeometry(5, 5);
        const text = new THREE.DataTexture(vbuffer, 256, 256, THREE.RGBAFormat);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                myTexture: { value: text },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            }
        });

        this.render = () => {
            this.ppuCycle = (this.ppuCycle++) & 3;
            for (let i = 0; i < 240; ++i) {
                for (let j = 0; j < 256; ++j) {
                    this.renderPixel(j, i, vbuffer[(i * 256) + (j * 4)], this.ppuCycle, vbuffer);
                }
                // render scanline
            }
            text.needsUpdate = true;
        };
        const scene = new THREE.Scene();
        scene.add(new THREE.Mesh(geometry, this.material));

        return scene;
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

    private renderPixel(x: number, y: number, pixel: number, PPU_cycle_counter: number, dest: Uint8Array) {
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
            signal_levels[ (x * 8) + p ] = signal;

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
                const level = signal_levels[p1] / 12;
                cy  =  cy + level;
                ci  =  ci + level * Math.cos( Math.PI * (phase + p1) / 6 );
                cq  =  cq + level * Math.sin( Math.PI * (phase + p1) / 6 );
            }

            dest[(y * 256) + (x * 4)] = cy;
            dest[(y * 256) + (x * 4) + 1]  = ci;
            dest[(y * 256) + (x * 4) + 2]  = cq;
            dest[(y * 256) + (x * 4) + 3]  = 0xff;

        }
    }

    render() {

    }
}
