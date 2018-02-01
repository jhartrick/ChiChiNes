import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener,  NgZone } from '@angular/core';
import { NESService } from '../wishbone/NESService';
import * as THREE from 'three';

import { BasicEncoder } from './basicEncoder';
import { RunningStatuses, BaseCart } from 'chichi';
import { iNESFileHandler } from 'chichi';

import { loadRom } from '../wishbone/filehandler'
import { setInterval } from 'timers';
import { WishBoneControlPad } from '../wishbone/keyboard/wishbone.controlpad';
import { AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'chichi-viewer',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css'],
    host: {
        '(document:keydown)': 'onkeydown($event)',
        '(document:keyup)': 'onkeyup($event)'
      }
})

export class ChiChiComponent implements AfterViewInit {
    padOne: WishBoneControlPad;
    interval: NodeJS.Timer;
    loadRom: (cart: BaseCart) => any;
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
        this.vbuffer = new Uint8Array(new ArrayBuffer(256 * 256 * 4));
        this.p32 = new Uint8Array(new ArrayBuffer(32 * 256 * 4));
        const abuffer = new Float32Array(new ArrayBuffer(2048 *  4 * Float32Array.BYTES_PER_ELEMENT));

        const getBone = this.nesService.getWishbone();
        const setBbuffer = getBone(this.vbuffer);
        this.loadRom = setBbuffer(abuffer);

        this.padOne = new WishBoneControlPad('one');

    }

    rebuildNesScene(listener: THREE.AudioListener) {

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.add(listener);
        const scene = new THREE.Scene();

        const encoder = new BasicEncoder();
        // const encoder = new NTSCEncoder(this.nesService);

        const geometry = new THREE.PlaneGeometry(5, 5);
        const material =  encoder.createMaterial(this.vbuffer);
        scene.add(new THREE.Mesh(geometry, material));

        this.drawFrame = () => {
            encoder.render();
            this.renderer.render(scene, camera);
        };

        camera.position.z = 5.8;



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

    onkeydown(event) {
        this.padOne.handleKeyDownEvent(event);
    }

    onkeyup(event) {
        this.padOne.handleKeyUpEvent(event);
    }


    private setupScene(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

    }

    ngAfterViewInit(): void {
        this.setupScene();
        setTimeout(() => {
            this.onResize();
        }, 1);


    }

    drawFrame(): void {

    }

    soundOver = true;


    loadfile(e: Event) {
        const files: FileList = (<HTMLInputElement>e.target).files;

        this.runChiChi(files);
    }
    private runChiChi(files: FileList) {
        clearInterval(this.interval);


        loadRom(files).subscribe((rom) => {
            this.zone.runOutsideAngular(() => {
                const wishbone = this.loadRom(<any>rom);
                const chichi = wishbone.chichi;
                chichi.PowerOn();
                this.rebuildNesScene(wishbone.audio.listener);

                this.interval = setInterval(p => {
                    chichi.PadOne.padOneState = this.padOne.padOneState;
                    
                    requestAnimationFrame(() => {
                        chichi.RunFrame();
                        this.drawFrame();
                    });
                }, 17);
                
            });
        });
    }
}
