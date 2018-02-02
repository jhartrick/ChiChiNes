import { ChiChiMachine } from "chichi";
import { LocalAudioSettings } from "../threejs/audio.localsettings";
import { ThreeJSAudioSettings } from "../threejs/audio.threejs";

export interface Wishbone
{
    chichi: ChiChiMachine;
    audio: ThreeJSAudioSettings;
    vbuffer: Uint8Array | Uint8ClampedArray;
}