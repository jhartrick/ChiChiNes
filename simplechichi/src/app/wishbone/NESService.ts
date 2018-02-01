import { Observable } from 'rxjs/Observable';
import { RunningStatuses, ChiChiMachine, IBaseCart, BaseCart, ChiChiPPU } from 'chichi';
import * as Three from 'three';
import { Wishbone } from './wishbone';
import { buildSound } from '../threejs/audio.threejs';
import { iNESFileHandler } from 'chichi';

export class NESService {
    wishbone: Wishbone;
    statusChanged: Observable<RunningStatuses> = new Observable<RunningStatuses>();

    constructor() {
        this.statusChanged = new Observable<RunningStatuses>();
    }

    getWishbone() {
        return createWishbone({
            chichi: undefined,
            audio: undefined
        });
    }
}

const createWishbone = (wishbone: Wishbone) => (videoBuffer: Uint8Array ) => (audioBuffer: Float32Array) =>  {
    const result = Object.assign({}, wishbone);
    const chichi = new ChiChiMachine();
    chichi.Cpu.ppu.byteOutBuffer = videoBuffer;
    chichi.SoundBopper.writer.SharedBuffer = audioBuffer;

    chichi.Cpu.FireDebugEvent = () => {
        const info = {};
    };
    chichi.Cpu.Debugging = false;
    result.chichi = chichi;
    result.audio = buildSound(chichi.SoundBopper.writer);

    return (cart: BaseCart): Wishbone => {
        chichi.loadCart(cart);
        chichi.PowerOn();
        return result;
    };
}
