import * as THREE from 'three';
import { NESService } from '../services/NESService';

export class BasicEncoder {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private material: THREE.ShaderMaterial;

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
    uniform sampler2D myPalette;
    varying vec2 v_texCoord;

    void main()	{
      vec2 texCoord = vec2(v_texCoord.s, 1.0 - v_texCoord.t);
      vec4 color = texture2D(myTexture, texCoord);
      vec4 finalColor = texture2D(myPalette,vec2(color.r,0.5));

      gl_FragColor = vec4(finalColor.rgb, 1.0);
    }
    `;

    constructor(private nesService: NESService) {
    }

    createMaterial(): THREE.Material {
        const vbuffer = this.nesService.videoBuffer;

        const text = new THREE.DataTexture(vbuffer, 256, 256, THREE.RGBAFormat);

        const pal =  new Uint8Array(256 * 4);
        const p32 = this.nesService.defaultPalette;
        for (let i = 0; i < 256; i++) {
            const color = p32[i & 0x3f];
            pal[i * 4] = color & 0xFF;
            pal[(i * 4) + 1] = (color >> 8) & 0xFF;
            pal[(i * 4) + 2] = (color >> 16) & 0xFF;
            pal[(i * 4) + 3] =  0xFF;
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

        paltext.needsUpdate = true;
        this.render = () => {
            text.needsUpdate = true;
        };

        return material;
    }

    render() {
    }
}
