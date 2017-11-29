import { AudioSettings } from "../ChiChiTypes";

export interface WorkerMessage {
    command: string;
}

export interface CreateWorkerMessage extends WorkerMessage {
    audioSettings: AudioSettings;
    iops: Int32Array;
    vbuffer: Uint8Array;
    abuffer: Float32Array;
}

export interface LoadRomMessage extends WorkerMessage {
    rom: number[];
    name: string;
}


export class ChiChiMessageFactory {

    static createMachine(vbuffer: Uint8Array, abuffer: Float32Array, audioSettings: AudioSettings, iops: Int32Array ): CreateWorkerMessage {
        return { 
            command: 'create',
            audioSettings: audioSettings,
            abuffer: abuffer,
            vbuffer: vbuffer,
            iops: iops
        };
    }


    static loadRom(rom: number[], name: string) : LoadRomMessage {
        return { command: 'loadrom', rom: rom, name: name };
    } 

}

