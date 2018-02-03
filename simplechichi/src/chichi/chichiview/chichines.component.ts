import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, NgZone, Input } from '@angular/core';
import * as THREE from 'three';

import { loadCartFromFileList, loadCartFromUrl } from '../wishbone/filehandler';
import * as Pads from '../wishbone/keyboard/wishbone.controlpad';
import * as WB from '../wishbone/wishbone';
import { drawFrameWebGL } from '../threejs/threejs.drawframe';
import { ChiChiIO } from '../chichi.io';
import { defaultBindings } from '../wishbone/keyboard/wishbone.keybindings';
import { BaseCart } from 'chichi';

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
    teardown: () => void;
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') canvasRef: ElementRef;

    @Input('cart')
    set cart(value: BaseCart) {
        this.zone.runOutsideAngular(()=>{
            if (this.teardown !== undefined) {
                this.teardown();
            }
            if (value !== undefined) {
                this.runCart()(value);
            }
    
        })
    }

    private renderer: THREE.WebGLRenderer;

    public canvasLeft = '0px';
    public canvasTop = '0px';

    constructor(private zone: NgZone) {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?: any) {
        const ccElem = this.chichiHolder.nativeElement;
        const canvElem = this.canvasRef.nativeElement;
        if (canvElem.offsetHeight < canvElem.offsetWidth) {
            this.renderer.setSize(canvElem.offsetHeight * 4 / 3, canvElem.offsetHeight);
            this.canvasLeft = ((ccElem.offsetWidth - (canvElem.offsetHeight * 4 / 3)) / 2) + 'px';
            this.canvasTop = '0px';
        } else {
            this.renderer.setSize(canvElem.offsetWidth, canvElem.offsetWidth * 3 / 4);
            this.canvasLeft = '0px';
            this.canvasTop = ((ccElem.offsetWidth - (canvElem.offsetWidth * 3 / 4)) / 2) + 'px';
        }
        // console.log("Width: " + event.target.innerWidth);
    }

    onkeydown(event) {
    }

    onkeyup(event) {
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

    private runCart(): (value: BaseCart) => void {
        return (rom) => {
            this.zone.runOutsideAngular(() => {
                
                const runchi = setupIO({
                    keydown: (val: (e: any) => void) => this.onkeydown = val,
                    keyup: (val: (e: any) => void) => this.onkeyup = val,
                    getDrawFrame: drawFrameWebGL(this.renderer)
                });

                this.teardown = runchi(WB.createWishboneFromCart(rom))
            });
        };
    }
}

const setupIO = (io: ChiChiIO) => {
    {
        const padOne: Pads.WishBoneControlPad = Pads.createControlPad(defaultBindings)('one');

        io.keydown((event) => Pads.handleKeyDownEvent(padOne, event));
        io.keyup((event) => Pads.handleKeyUpEvent(padOne, event));

        return (wishbone: WB.Wishbone) => {
            return WB.runAChichi(wishbone, io, padOne);
        }
    }
};