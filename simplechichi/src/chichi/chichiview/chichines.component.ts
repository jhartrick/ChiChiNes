import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener,  NgZone, Input } from '@angular/core';
import { NESService } from '../wishbone/NESService';
import * as THREE from 'three';
import { RunningStatuses, BaseCart } from 'chichi';
import { iNESFileHandler } from 'chichi';

import { loadRom, loadUrl } from '../wishbone/filehandler';
import { setInterval } from 'timers';
import { WishBoneControlPad } from '../wishbone/keyboard/wishbone.controlpad';
import { Wishbone } from '../wishbone/wishbone';
import { drawFrameWebGL } from '../threejs/threejs.drawframe';
import { ChiChiIO } from '../chichi.io';

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
    interval: NodeJS.Timer;
    p32: Uint8Array;
    vbuffer: Uint8Array;
    nesService: NESService;
    @ViewChild('chichiHolder') chichiHolder: ElementRef;
    @ViewChild('chichiPig') canvasRef: ElementRef;

    @Input('romUrl')
    set romUrl(value: string)  {
        loadUrl(value).subscribe(cart => {
            this.runCart()(cart);
        });
    }

    private renderer: THREE.WebGLRenderer;

    public canvasLeft = '0px';
    public canvasTop = '0px';

    listener: THREE.AudioListener;

    constructor(private zone: NgZone) {
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

    loadfile(e: Event) {
        const files: FileList = (<HTMLInputElement>e.target).files;
        clearInterval(this.interval);
        loadRom(files).subscribe(this.runCart());
    }

    private runCart(): (value: BaseCart) => void {
        return (rom) => {
            const io: ChiChiIO = {
                keydown: (val: (e: any) => void) => this.onkeydown = val,
                keyup: (val: (e: any) => void) => this.onkeyup = val,
                getDrawFrame: drawFrameWebGL(this.renderer)
            };
            const runchi = runEmulation(io);
            const wishbone = makeAChiChi().loadRom(<any>rom);
            this.zone.runOutsideAngular(() => runchi(wishbone));
        };
    }
}

const makeAChiChi = () => {
    const nesService = new NESService();
    const vbuffer = new Uint8Array(new ArrayBuffer(256 * 256 * 4));
    const abuffer = new Float32Array(new ArrayBuffer(8192 * Float32Array.BYTES_PER_ELEMENT));

    const lr = (cart: BaseCart) => {
        const wishbone = nesService.getWishbone()(vbuffer)(abuffer)(cart);
        wishbone.chichi.PowerOn();
        return wishbone;
    };
    return {
        nesService, abuffer, loadRom: lr
    };
};

const updatePadState = (dest: any) => (src: any) => () => dest.padOneState = src.padOneState;

const runEmulation = (io: ChiChiIO) => (wishbone: Wishbone) => {
    {
        const chichi = wishbone.chichi;
        const drawFrame = io.getDrawFrame(wishbone);
        const padOne: WishBoneControlPad = new WishBoneControlPad('one');
        const padTwo: WishBoneControlPad = new WishBoneControlPad('two');

        io.keydown((event) => {
            padOne.handleKeyDownEvent(event);
            padTwo.handleKeyDownEvent(event);
        });
        io.keyup((event) => {
            padOne.handleKeyUpEvent(event);
            padTwo.handleKeyUpEvent(event);
        });

        const setPadOne = updatePadState(chichi.Cpu.PadOne.ControlPad)(padOne);
       // const setPadTwo = updatePadState(chichi.Cpu.PadTwo.ControlPad)(padTwo);

        const runFrame = () => {
            setPadOne(); // setPadTwo();
            chichi.RunFrame();
            requestAnimationFrame(() => {
                drawFrame();
            });
        };

        setInterval(p => {
            runFrame();
        }, 17);

    }
};

