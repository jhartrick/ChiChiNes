import { ChiChiMachine } from './ChiChiMachine';
import { ChiChiCPPU } from './ChiChiCPU';
import { ChiChiPPU } from './ChiChiPPU';
export declare class ChiChiNsfMachine extends ChiChiMachine {
    Cpu: ChiChiNsfCPPU;
    ppu: ChiChiPPU;
    constructor();
    LoadNsf(rom: number[]): void;
}
export declare class ChiChiNsfCPPU extends ChiChiCPPU {
    copyright: string;
    artist: string;
    songName: string;
    runNsfAt: number;
    loadNsfAt: number;
    initNsfAt: number;
    firstSong: number;
    songCount: number;
    __SetByte(address: number, data: number): void;
    GetByte(address: number): number;
    LoadNsf(nsfFile: number[]): void;
    InitNsf(): void;
}
