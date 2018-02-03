import { ChiChiMachine, BaseCart } from "chichi";
import { LocalAudioSettings } from "../threejs/audio.localsettings";
import { ThreeJSAudioSettings, buildSound } from "../threejs/audio.threejs";
import { ChiChiControlPad } from "../../../../chichilib/lib/chichi/chichi/ChiChiControl";
import { ChiChiIO } from "../chichi.io";
import { WishBoneControlPad } from "./keyboard/wishbone.controlpad";

export interface Wishbone
{
    audio: ThreeJSAudioSettings;
    vbuffer: Uint8Array | Uint8ClampedArray;
    padOne: ChiChiControlPad;
    padTwo: ChiChiControlPad;
    
    poweron: () => void;
    poweroff: () => void;
    reset: () => void;
    runframe: () => void;
    setpads: () => void;
}

const BLANK_WISHBONE = {
    audio: undefined,
    vbuffer: undefined,
    padOne: undefined, padTwo: undefined,
    poweron: () => undefined,
    poweroff: () => undefined,
    reset: () => undefined,
    runframe: () => undefined,
    setpads: () => undefined,
}

const createWishboneLoader = (cart: BaseCart) => {
    const chichi = new ChiChiMachine();

    const result: Wishbone = {
        audio:  buildSound(chichi.SoundBopper.writer),
        vbuffer:  chichi.Cpu.ppu.byteOutBuffer,
        padOne:  chichi.Cpu.PadOne.ControlPad,
        padTwo:  chichi.Cpu.PadOne.ControlPad,
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
export const runAChichi = (wishbone: Wishbone, io: ChiChiIO, padOne: WishBoneControlPad) => {
    const drawFrame = io.getDrawFrame(wishbone);
    wishbone.setpads = updatePadState(wishbone.padOne, padOne);

    const interval = setInterval(p => {
        wishbone.setpads();
        wishbone.runframe();
        requestAnimationFrame(() => {
            drawFrame();
        });
    }, 17);

    const teardown =  () => {
        clearInterval(interval);
        wishbone.audio.teardown();
    }

    return teardown;
}