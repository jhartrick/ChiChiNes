import { ChiChiMachine, BaseCart, WavSharer, ChiChiInputHandler } from "chichi";
import { ChiChiIO } from "../chichi.io";
import { WishBoneControlPad } from "./keyboard/wishbone.controlpad";
export interface Wishbone
{
    wavSharer: WavSharer;
    vbuffer: Uint8Array | Uint8ClampedArray;
    padOne: ChiChiInputHandler;
    padTwo: ChiChiInputHandler;
    
    poweron: () => void;
    poweroff: () => void;
    reset: () => void;
    runframe: () => void;
    setpads: () => void;
}

export interface WishboneRuntime {
     teardown: () => Promise<void>; 
     pause: (val: boolean) => void; 
     wishbone: Wishbone;
}

const createWishboneLoader = (cart: BaseCart) => {
    const chichi = new ChiChiMachine();

    const result: Wishbone = {
        wavSharer: chichi.SoundBopper.writer,
        vbuffer:  chichi.Cpu.ppu.byteOutBuffer,
        padOne:  chichi.Cpu.PadOne,
        padTwo:  chichi.Cpu.PadOne,
        poweron:  chichi.PowerOn.bind(chichi),
        poweroff:  chichi.PowerOff.bind(chichi),
        reset:  chichi.Reset.bind(chichi),
        runframe:  chichi.RunFrame.bind(chichi),
        setpads: () => undefined,
    }
    chichi.loadCart(cart);
    chichi.PowerOn();
    return result;
}

const updatePadState = (dest: any, src: any) => () => dest.padOneState = src.padOneState;

export const createWishboneFromCart = (cart: BaseCart) => {
    const wishbone = createWishboneLoader(cart);
    wishbone.poweron();
    return wishbone;
};

// returns options for running emulator
export const runAChichi = (wishbone: Wishbone, io: ChiChiIO, padOne: WishBoneControlPad): WishboneRuntime => {
    let drawFrame = io.drawFrame(wishbone);
    wishbone.setpads = updatePadState(wishbone.padOne.ControlPad, padOne);
    let paused = false;
    const run = () => {        
        wishbone.setpads();
        wishbone.runframe();
        drawFrame();
    }

    let interval = setInterval(p => {
        if (!paused) { 
            run(); 
        }
    }, 1000.0/60);

    const teardown =  (): Promise<void> => {
        clearInterval(interval);
        return new Promise((resolve, reject) => {
            setTimeout(()=> {
                drawFrame = null,
                wishbone.setpads = null,
                wishbone.wavSharer = null,
                wishbone.poweroff();
                resolve();
            }, 60);
        });
    }

    const pause = (val: boolean) => { 
        paused = val;
        if (paused) {
            wishbone.wavSharer.SharedBuffer.fill(0)
        }
    }

    return { teardown, pause, wishbone };
}