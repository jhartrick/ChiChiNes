import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { NESService } from '../services/NESService';
import * as THREE from 'three';
import { ChiChiThreeJSAudio } from '../services/wishbone/wishbone.audio.threejs';
import { BasicEncoder } from './basicEncoder';
import { NTSCEncoder } from './ntscEncoder';
@Component({
    selector: 'chichi',
    templateUrl: './chichi.component.html',
    styleUrls: ['./chichi.component.css'],
})

export class ChiChiComponent implements AfterViewInit {
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') canvasRef: ElementRef;

    private renderer: THREE.WebGLRenderer;

    public canvasLeft = '0px';
    public canvasTop = '0px';

    constructor(private nesService: NESService, private cd: ChangeDetectorRef, private zone: NgZone) {
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
        this.cd.detectChanges();
       // console.log("Width: " + event.target.innerWidth);
    }

    private setupScene(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

        camera.add(this.nesService.audioSettings.listener);

        // const encoder = new BasicEncoder(this.nesService);
        const encoder = new NTSCEncoder(this.nesService);

        const scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(5, 5);
        const material =  encoder.createMaterial();

        scene.add(new THREE.Mesh(geometry, material));
        this.drawFrame = () => {
            requestAnimationFrame(() => {
                encoder.render();
                this.renderer.render(scene, camera);
                this.drawFrame();
            });
        };
        camera.position.z = 5.8;

        setTimeout(() => {
          this.onResize();
        }, 1);

    }

    ngAfterViewInit(): void {
        this.setupScene();

        this.zone.runOutsideAngular(() => {
          this.drawFrame();
        });
        this.cd.detach();
    }

    drawFrame(): void {

    }

    soundOver = true;

}
