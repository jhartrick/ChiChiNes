﻿import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { Emulator } from 'app/services/NESService'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import * as THREE from 'three'

@Component({
    selector: 'chichi',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css']
})

export class ChiChiComponent implements AfterViewInit {
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') canvasRef: ElementRef;
    @ViewChild('fragmentShader') fragmentShader: ElementRef;
    @ViewChild('vertexShader') vertexShader: ElementRef;
    
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
    private audioCtx : AudioContext;
    private audioSource : AudioBufferSourceNode;

    public canvasLeft: string = '0px';
    public canvasTop: string = '0px';


    private nesAudioBuffer: SharedArrayBuffer = new SharedArrayBuffer(4096 * Float32Array.BYTES_PER_ELEMENT);
    private nesAudio: Float32Array = new Float32Array(<any>this.nesAudioBuffer);

    constructor(private nesService: Emulator, cd: ChangeDetectorRef) {
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDownEvent(event: KeyboardEvent) {
        this.nesService.handleKeyDownEvent(event);
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent) {
        this.nesService.handleKeyUpEvent(event);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?:any){
        if (this.canvasRef.nativeElement.offsetHeight < this.canvasRef.nativeElement.offsetWidth) {
            this.renderer.setSize(this.canvasRef.nativeElement.offsetHeight * 4/3, this.canvasRef.nativeElement.offsetHeight );
            this.canvasLeft = ((this.chichiHolder.nativeElement.offsetWidth - (this.canvasRef.nativeElement.offsetHeight * 4/3)) /2) + "px";
            this.canvasTop='0px';
        } else {
            this.renderer.setSize(this.canvasRef.nativeElement.offsetWidth , this.canvasRef.nativeElement.offsetWidth * 3/4);
            this.canvasLeft = '0px';            
            this.canvasTop = ((this.chichiHolder.nativeElement.offsetWidth - (this.canvasRef.nativeElement.offsetWidth * 3/4)) /2) + "px";
        }

       //console.log("Width: " + event.target.innerWidth);
    }

    private setupScene(): void {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.listener = new THREE.AudioListener();
        this.camera.add( this.listener );

        this.sound = new THREE.Audio(this.listener);
        this.audioCtx = this.sound.context;
        
        this.audioSource = this.audioCtx.createBufferSource();
        
        this.sound.setNodeSource(this.audioSource);
        this.audioSource.buffer = this.audioCtx.createBuffer(1, 4096, 44100);
        var scriptNode = this.audioCtx.createScriptProcessor(2048, 1, 1);

        this.audioSource.connect(scriptNode);
        scriptNode.onaudioprocess = (audioProcessingEvent) => {
            if (this.nesService.soundEnabled) {
                // The input buffer is the song we loaded earlier
                var inputBuffer = audioProcessingEvent.inputBuffer;

                // The output buffer contains the samples that will be modified and played
                var outputBuffer = audioProcessingEvent.outputBuffer;
                // Loop through the output channels (in this case there is only one)
                for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                    var inputData = inputBuffer.getChannelData(channel);
                    var outputData = outputBuffer.getChannelData(channel);

                    // Loop through the 4096 samples
                    for (var sample = 0; sample < inputBuffer.length; sample++) {
                        let pos = ((sample / inputBuffer.length) * this.nesAudio.length) >>> 0;
                        // make output equal to the same as the input
                        outputData[sample] = this.nesAudio[pos];

                        // add noise to each output sample
                        //outputData[sample] += ((Math.random() * 2) - 1) * 0.2;
                    }
                }
            } else {
                var outputBuffer = audioProcessingEvent.outputBuffer;
                for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                    var outputData = outputBuffer.getChannelData(channel);

                    // Loop through the 4096 samples
                    for (var sample = 0; sample < outputBuffer.length; sample++) {
                        outputData[sample] = 0;
                    }
                }

            }
            this.nesService.clearAudio();
        }

        scriptNode.connect(this.audioCtx.destination);
        this.audioSource.loop = true;
        this.audioSource.start();
        //this.sound.setLoop(true);
        //this.sound.play();
        this.nesService.SetAudioBuffer(this.nesAudio);

        //console.log(scriptNode.bufferSize);

        var w = 1;
        var h = 1;
        var geometry = new THREE.PlaneGeometry(5, 5);

        this.text = new THREE.DataTexture(this.vbuffer, 256, 256, THREE.RGBAFormat);

        for (var i = 0; i < 256; i++) {
            var color = ChiChiNES.PixelWhizzler.pal[i];
            this.pal[i * 4] = color & 0xFF;
            this.pal[(i * 4) +1] = (color >> 8) & 0xFF;
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
`uniform sampler2D myTexture;
uniform sampler2D myPalette;
varying vec2 v_texCoord;
 

void main()	{
  vec2 texCoord = vec2(v_texCoord.s, 1.0 - v_texCoord.t);
  vec4 color = texture2D(myTexture, texCoord);
  vec4 finalColor = texture2D(myPalette,vec2(color.r,0.5));
  gl_FragColor = vec4(finalColor.rgb, 1.0); 
}`
        });
        this.paltext.needsUpdate = true;
        //var material = new THREE.MeshBasicMaterial({ map: this.text });

        var cube = new THREE.Mesh(geometry, this.material);

        this.scene.add(cube);
        //cube.rotateZ(2 & Math.PI);
        this.camera.position.z = 5.8;
        //this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.renderer = new THREE.WebGLRenderer();
        

        this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
        setTimeout(() => {
          this.onResize();
        },1);
        this.renderScene();
    }

    ngAfterViewInit(): void {
        this.setupScene();
        this.nesService.SetVideoBuffer(this.vbuffer);
        this.nesService.SetCallbackFunction(() => this.renderScene());
        this.drawFrame();
    }

    drawFrame(): void {
      requestAnimationFrame(() => {
        this.renderer.render(this.scene, this.camera);
        this.text.needsUpdate = true;
        this.drawFrame();
      });
    }

    soundOver = true;

    renderScene(): void
    {
        
        //this.audioSource
        // this.nesService.wavBuffer = this.audioCtx.createBuffer(2, 32, 22050);
        //if (this.nesService.soundEnabled ) {
        //    let sound = new THREE.Audio(this.listener);
        //    //this.soundOver = false; 
        //    if (this.nesService.fillWavBuffer(sound.context)) {
        //        sound.setBuffer(this.nesService.wavBuffer);
        //        //this.audioSource.onended = () => {
        //        //    console.log('buffer played');
        //        //    this.soundOver = true;
        //        //}
        //        //this.sound.setLoop(false);
        //        sound.playbackRate = 1.0;//this.nesService.framesPerSecond / 60; 
        //        sound.play();
        //        //while (this.sound.isPlaying);
        //    }
        //}
        // debugger;
        this.text.needsUpdate = true;
        //this.paltext.needsUpdate = true;
    }

}
