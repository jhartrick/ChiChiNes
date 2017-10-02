import { Injectable } from '@angular/core';

@Injectable()
export class Emulator {
    private machine: NES.CPU.nitenedo.NESMachine;
    private intervalId: NodeJS.Timer;
    private callback: () => void;

    constructor() {
        var wavsharer = new NES.CPU.Machine.BeepsBoops.WavSharer();
        
        var whizzler = new NES.CPU.PPUClasses.PixelWhizzler();
        whizzler.FillRGB = false;
        
        var soundbop = new NES.CPU.Machine.BeepsBoops.Bopper(wavsharer);
        var cpu = new NES.CPU.Fastendo.CPU2A03(whizzler, soundbop);

        this.machine = new NES.CPU.nitenedo.NESMachine(cpu, whizzler, new NES.CPU.PPUClasses.TileDoodler(whizzler), wavsharer, soundbop, new NES.Sound.SoundThreader(null));

    }

    // platform hooks
    SetCallbackFunction(callback: () => void ) {
        this.machine.addDrawscreen(callback);
    }

    SetVideoBuffer(array: Uint8Array): void {
        this.machine.PPU.ByteOutBuffer = array;
    }

    // rom loading
    LoadRom(rom: number[]) {
        this.machine.LoadCart(rom);
        this.machine.Reset();
    }

    // control
    StartEmulator(): void {
        this.machine.PowerOn();
        var runNes = () => {
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => {
                this.machine.RunFrame();
            }, 0);
        };

        runNes();
    }

    StopEmulator(): void {
        clearInterval(this.intervalId);
        this.machine.PowerOff();
    }

}