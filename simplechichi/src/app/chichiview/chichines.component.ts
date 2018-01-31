import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener,  NgZone } from '@angular/core';
import { NESService } from '../wishbone/NESService';
import * as THREE from 'three';

import { BasicEncoder } from './basicEncoder';
import { RunningStatuses, BaseCart } from 'chichi';
import { iNESFileHandler } from 'chichi';

import { loadRom } from '../wishbone/filehandler'
import { setInterval } from 'timers';

@Component({
    selector: 'chichi-viewer',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css'],
})

export class ChiChiComponent implements AfterViewInit {
    p32: Uint8Array;
    vbuffer: Uint8Array;
    nesService: NESService;
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') canvasRef: ElementRef;

    private renderer: THREE.WebGLRenderer;

    public canvasLeft = '0px';
    public canvasTop = '0px';

    listener: THREE.AudioListener;


    constructor(private zone: NgZone) {
        
        this.nesService = new NESService(); 
        this.vbuffer = new Uint8Array(new ArrayBuffer(256 * 256 * 4));//this.nesService.videoBuffer;
        this.p32 = new Uint8Array(new ArrayBuffer(32 * 256 * 4));;

        this.rebuildNesScene();
        
    }

    rebuildNesScene() {

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.add(this.listener);

        const scene = new THREE.Scene();

        const encoder = new BasicEncoder();
        // const encoder = new NTSCEncoder(this.nesService);

        const geometry = new THREE.PlaneGeometry(5, 5);
        const material =  encoder.createMaterial(this.vbuffer);
        scene.add(new THREE.Mesh(geometry, material));

        this.drawFrame = () => {
            requestAnimationFrame(() => {
                encoder.render();
                this.renderer.render(scene, camera);
            });
        };

        camera.position.z = 5.8;

        setTimeout(() => {
            this.onResize();
        }, 1);

    }

    rebuildNullScene() {
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        // this.nesService.audioHandler.noSound();
        const scene = new THREE.Scene();

        const encoder = new BasicEncoder();
        // const encoder = new NTSCEncoder(this.nesService);

        const geometry = new THREE.PlaneGeometry(5, 5);
        const material =  new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(0x111111);
        scene.add(new THREE.Mesh(geometry, material));

        this.drawFrame = () => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    encoder.render();
                    this.renderer.render(scene, camera);
                    this.drawFrame();
                });
            }, 160);
        };

        camera.position.z = 5.8;

        setTimeout(() => {
            this.onResize();
        }, 1);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?: any) {
        const ccElem = this.chichiHolder.nativeElement;
        const canvElem = this.canvasRef.nativeElement;
        if (canvElem.offsetHeight < canvElem.offsetWidth) {
            this.renderer.setSize(canvElem.offsetHeight * 4 / 3, canvElem.offsetHeight );
            this.canvasLeft = ((ccElem.offsetWidth - (canvElem.offsetHeight * 4 / 3)) / 2) + 'px';
            this.canvasTop = '0px';
        } else {
            this.renderer.setSize(canvElem.offsetWidth , canvElem.offsetWidth * 3 / 4);
            this.canvasLeft = '0px';
            this.canvasTop = ((ccElem.offsetWidth - (canvElem.offsetWidth * 3 / 4)) / 2) + 'px';
        }
       // console.log("Width: " + event.target.innerWidth);
    }

    private setupScene(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
        this.rebuildNesScene();

    }

    ngAfterViewInit(): void {
        this.setupScene();


    }

    drawFrame(): void {

    }

    soundOver = true;


    loadfile(e: Event) {
        const files: FileList = (<HTMLInputElement>e.target).files;
        const buf = this.vbuffer;
        loadRom(files).subscribe((rom) => {
            const wishbone = this.nesService.getWishbone()
                                            (<any>buf)
                                            (new Float32Array(new ArrayBuffer(256*256*4)))(<BaseCart>rom);
            this.zone.runOutsideAngular(() => {
                    wishbone.chichi.PowerOn();
                    setInterval(p=> {
                        wishbone.chichi.RunFrame();
                        this.drawFrame();
            
                },16);
            });
        });
    }

}
