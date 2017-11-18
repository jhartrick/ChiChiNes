import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { Emulator } from '../services/NESService';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as THREE from 'three';
import { AudioSettings } from 'chichi';
import { WishBoneControlPad } from '../services/wishbone/wishbone';
import { WishboneAPU } from '../services/wishbone/wishbone.audio';
import { ChiChiThreeJSAudio } from '../services/wishbone/wishbone.audio.threejs';

@Component({
    selector: 'chichi',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css'],
})

export class ChiChiComponent implements AfterViewInit {
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') canvasRef: ElementRef;
    @ViewChild('fragmentShader') fragmentShader: ElementRef;
    @ViewChild('vertexShader') vertexShader: ElementRef;

    private pal32: number[] = [7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    private renderer: THREE.WebGLRenderer;
    private dkrom: number[];
    private canvasCtx: CanvasRenderingContext2D;
    private sharedBuffer: SharedArrayBuffer = new SharedArrayBuffer(256 * 256 * 4);
    private vbuffer: Uint8Array = new Uint8Array(<any>this.sharedBuffer);
    private pal: Uint8Array = new Uint8Array(256 * 4);

    private text: THREE.DataTexture;
    private paltext: THREE.DataTexture;
    private draw: boolean;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private material: THREE.ShaderMaterial;


    private sound: THREE.Audio;
    private listener: THREE.AudioListener;
    private audioCtx: AudioContext;
    private audioSource: AudioBufferSourceNode;

    public canvasLeft = '0px';
    public canvasTop = '0px';

    constructor(private nesService: Emulator, private cd: ChangeDetectorRef, private zone: NgZone) {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?: any) {
        if (this.canvasRef.nativeElement.offsetHeight < this.canvasRef.nativeElement.offsetWidth) {
            this.renderer.setSize(this.canvasRef.nativeElement.offsetHeight * 4/3, this.canvasRef.nativeElement.offsetHeight );
            this.canvasLeft = ((this.chichiHolder.nativeElement.offsetWidth - (this.canvasRef.nativeElement.offsetHeight * 4 /3)) / 2) + 'px';
            this.canvasTop = '0px';
        } else {
            this.renderer.setSize(this.canvasRef.nativeElement.offsetWidth , this.canvasRef.nativeElement.offsetWidth * 3 / 4);
            this.canvasLeft = '0px';
            this.canvasTop = ((this.chichiHolder.nativeElement.offsetWidth - (this.canvasRef.nativeElement.offsetWidth * 3 / 4)) / 2) + "px";
        }
        this.cd.detectChanges();
       // console.log("Width: " + event.target.innerWidth);
    }

    private setupScene(): void {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

        let fragShader: string = `
        bool InColorPhase (float color, float phase) { 
            return modI( (color + phase) , 12.0) < 6.0; 
            
        }
        
        float NTSCsignal(int color, int level, int emphasis, int phase)
        {
            // Voltage levels, relative to synch voltage
            float black=.518, white=1.962, attenuation=.746;
            float p = float(phase);
            // const float levels[8] = float[8](.350, .518, .962, 1.550, 1.094, 1.506, 1.962, 1.962); 
        
            // Decode the NES color.
            if(color > 13) { level = 1;  } // For colors 14..15, level 1 is forced.
        
            // The square wave for this color alternates between these two voltages:
            float low  = levels[0 + level];
            float high = levels[4 + level];
            if(color == 0) { low = high; } // For color 0, only high level is emitted
            if(color > 12) { high = low; } // For colors 13..15, only low level is emitted
        
            // Generate the square wave
            float signal = InColorPhase(float(color), float(phase)) ? high : low;
        
            // When de-emphasis bits are set, some parts of the signal are attenuated:
            if (emphasis == 1 || emphasis == 3 || emphasis == 7)
            {
                if (InColorPhase(0.0, p)) {
                    signal = signal * attenuation;
                }   
            }
        
            // When de-emphasis bits are set, some parts of the signal are attenuated:
            if (emphasis == 2 || emphasis == 6 || emphasis == 7)
            {
                if (InColorPhase(4.0, p)) {
                    signal = signal * attenuation;
                }   
            }
            
            // When de-emphasis bits are set, some parts of the signal are attenuated:
            if (emphasis == 4 || emphasis == 6 || emphasis == 7)
            {
                if (InColorPhase(8.0, p)) {
                    signal = signal * attenuation;
                }   
            }
        
            return signal;
        }
        `


        this.zone.runOutsideAngular(() => {
            this.nesService.wishbone.SoundBopper.audioHandler = new ChiChiThreeJSAudio(this.nesService.wishbone.WaveForms);
            const result = this.nesService.wishbone.SoundBopper.setupAudio();
            this.camera.add( <any>result.listener);
            this.nesService.wishbone.RequestSync();
        });

        // console.log(scriptNode.bufferSize);

        const w = 1;
        const h = 1;
        const geometry = new THREE.PlaneGeometry(5, 5);

        this.text = new THREE.DataTexture(this.vbuffer, 256, 256, THREE.RGBAFormat);

        for (let i = 0; i < 256; i++) {
            const color = this.pal32[i & 0x3f];
            this.pal[i * 4] = color & 0xFF;
            this.pal[(i * 4) + 1] = (color >> 8) & 0xFF;
            this.pal[(i * 4) + 2] = (color >> 16) & 0xFF;
            this.pal[(i * 4) + 3] =  0xFF;
        }
        this.paltext = new THREE.DataTexture(this.pal, 256, 1, THREE.RGBAFormat);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                myTexture: { value: this.text },
                myPalette: { value: this.paltext }
            },
            vertexShader:
`
varying vec2 v_texCoord;
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    v_texCoord = uv.st;
}
`,
            fragmentShader:
`
uniform sampler2D myTexture;
uniform sampler2D myPalette;
varying vec2 v_texCoord;

void main()	{
  vec2 texCoord = vec2(v_texCoord.s, 1.0 - v_texCoord.t);
  vec4 color = texture2D(myTexture, texCoord);
  vec4 finalColor = texture2D(myPalette,vec2(color.r,0.5));
  
  gl_FragColor = vec4(finalColor.rgb, 1.0);
}
`
        });
        this.paltext.needsUpdate = true;
        // var material = new THREE.MeshBasicMaterial({ map: this.text });

        const cube = new THREE.Mesh(geometry, this.material);

        this.scene.add(cube);
        // cube.rotateZ(2 & Math.PI);
        this.camera.position.z = 5.8;
        // this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.renderer = new THREE.WebGLRenderer();

        this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
        setTimeout(() => {
          this.onResize();
        }, 1);
        this.renderScene();
    }

    ngAfterViewInit(): void {
        this.setupScene();
        this.nesService.SetVideoBuffer(this.vbuffer);
        this.nesService.SetCallbackFunction(() => this.renderScene());
        this.zone.runOutsideAngular(() => {
          this.drawFrame();
        });
        this.cd.detach();
    }

    drawFrame(): void {
        requestAnimationFrame(() => {
            this.renderer.render(this.scene, this.camera);
            this.text.needsUpdate = true;
            this.drawFrame();
        });
    }

    soundOver = true;

    renderScene(): void {
        this.text.needsUpdate = true;
    }

}
