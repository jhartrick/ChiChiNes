import { ChiChiMachine } from "chichi";
import { LocalAudioSettings } from "../threejs/audio.localsettings";

export interface Wishbone
{
    chichi: ChiChiMachine;
    audio: LocalAudioSettings
}