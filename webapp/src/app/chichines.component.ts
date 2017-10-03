import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Http, ResponseContentType, Response } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Emulator } from './services/NESService'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import * as THREE from 'three'

@Component({
    selector: 'chichi',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css'],
    providers: [Emulator ]
})

export class ChiChiComponent implements OnInit {

    private renderer: THREE.WebGLRenderer;
    private dkrom: number[];
    @ViewChild('chichiPig') canvasRef: ElementRef;
    private canvasCtx: CanvasRenderingContext2D;
    private vbuffer: Uint8Array = new Uint8Array(256 * 256 * 4);

    private text: THREE.DataTexture;
    private draw: boolean;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

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

    private setupScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
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
        this.renderer.setSize(320, 256);
        this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

    }

    ngOnInit(): void {
        // this.canvasCtx = this.canvasRef.nativeElement.getContext('2d');
        this.setupScene();
        
        this.nesService.SetVideoBuffer(this.vbuffer);
        this.nesService.SetCallbackFunction(() => {
            this.renderScene();
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
