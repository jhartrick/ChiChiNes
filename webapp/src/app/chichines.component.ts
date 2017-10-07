import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Http, ResponseContentType, Response } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Emulator } from './services/NESService'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import * as THREE from 'three'

@Component({
    selector: 'chichi',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css']
})

export class ChiChiComponent implements AfterViewInit {
    
    private renderer: THREE.WebGLRenderer;
    private dkrom: number[];
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') canvasRef: ElementRef;
    private canvasCtx: CanvasRenderingContext2D;
    private vbuffer: Uint8Array = new Uint8Array(256 * 256 * 4);

    private text: THREE.DataTexture;
    private draw: boolean;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private sound: THREE.Audio;
    private listener : THREE.AudioListener;
    
    private audioCtx : AudioContext;
    private audioSource : AudioBufferSourceNode;

    public canvasLeft: string = '0px';
    public canvasTop: string = '0px';

     constructor(private http: Http, private nesService: Emulator) {
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
        
        this.sound = new THREE.Audio( this.listener );   
        this.audioCtx = this.sound.context;
        this.audioSource = this.audioCtx.createBufferSource();
        this.sound.setNodeSource ( this.audioSource );

        this.nesService.wavBuffer = this.audioCtx.createBuffer(2, 16, 44100);


        var w = 1;
        var h = 1;
        var geometry = new THREE.PlaneGeometry(5, 5);

        var uvs = geometry.faceVertexUvs[0];
        uvs[0][0].set(0, 0);
        uvs[0][1].set(0, h);
        uvs[0][2].set(w, 0);
        uvs[1][0].set(0, h);
        uvs[1][1].set(w, h);
        uvs[1][2].set(w, 0);
        geometry.uvsNeedUpdate = true;
        this.text = new THREE.DataTexture(this.vbuffer, 256, 256, THREE.RGBAFormat);

//        , THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping,
//            THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 1.0, THREE.LinearEncoding );

        var material = new THREE.MeshBasicMaterial({ map: this.text });

        var cube = new THREE.Mesh(geometry, material);

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
        // this.canvasCtx = this.canvasRef.nativeElement.getContext('2d');
        this.setupScene();
        
        this.nesService.SetVideoBuffer(this.vbuffer);

        this.nesService.SetCallbackFunction(() => {
            this.renderScene();
            //this.audioSource
           // this.sound = new THREE.Audio( this.listener );   
           // this.audioCtx = this.sound.context;
           // this.nesService.wavBuffer = this.audioCtx.createBuffer(2, 16, 22500);
           // this.nesService.fillWavBuffer()

           
           // this.sound.setBuffer(this.nesService.wavBuffer);
           // this.sound.setLoop(false);
           // this.sound.play();
            


        });
        


        this.http.get('/assets/smb.nes', {
            responseType: ResponseContentType.Blob
        }).map(res => {
            return res.blob();
        })
            .map(blob => {
                
                var fileReader: FileReader = new FileReader();
                fileReader.onload = (e) => {
                    this.dkrom = Array.from(new Uint8Array(fileReader.result));
                    this.nesService.LoadRom(this.dkrom);
                    
                };
                fileReader.readAsArrayBuffer(blob);
            }).subscribe();
  }

    renderScene(): void {
        this.text.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

}
