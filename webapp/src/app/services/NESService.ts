import { Injectable } from '@angular/core';

@Injectable()
export class ControlPad implements NES.CPU.Machine.IControlPad {

    currentByte: number = 0;
    readNumber: number = 0;
    padOneState: number = 0;

    NES$CPU$Machine$IControlPad$CurrentByte: number;

    NES$CPU$Machine$IControlPad$refresh(): void {
        this.refresh();
    }
    refresh(): void {
        
    }
    NES$CPU$Machine$IControlPad$getByte(clock: number): number {
        return this.getByte(clock);
    }
    getByte(clock: number): number {
        var result = (this.currentByte >> this.readNumber) & 0x01;
        this.readNumber = (this.readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    }
    NES$CPU$Machine$IControlPad$setByte(clock: number, data: number): void {
        this.setByte(clock, data);
    }
    setByte(clock: number, data: number): void {
        if ((data & 1) == 1) {
            this.currentByte = this.padOneState;
            // if im pushing up, i cant be pushing down
            if ((this.currentByte & 16) == 16) this.currentByte = this.currentByte & ~32;
            // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
            if ((this.currentByte & 64) == 64) this.currentByte = this.currentByte & ~128;

            this.readNumber = 0;
        }
        //if (data == 0) // strobed this port, get the next byte
        //{
        //}
    }




    dispose(): void {
        
    }


}

@Injectable()
export class Emulator {
    private machine: NES.CPU.nitenedo.NESMachine;
    private controlPad: ControlPad;
    private intervalId: NodeJS.Timer;
    private callback: () => void;

    constructor() {
        var wavsharer = new NES.CPU.Machine.BeepsBoops.WavSharer();
        
        var whizzler = new NES.CPU.PPUClasses.PixelWhizzler();
        whizzler.FillRGB = false;
        
        var soundbop = new NES.CPU.Machine.BeepsBoops.Bopper(wavsharer);
        var cpu = new NES.CPU.Fastendo.CPU2A03(whizzler, soundbop);
        this.controlPad = new ControlPad();
        
        this.machine = new NES.CPU.nitenedo.NESMachine(cpu, whizzler, new NES.CPU.PPUClasses.TileDoodler(whizzler), wavsharer, soundbop, new NES.Sound.SoundThreader(null));
        this.machine.PadOne = this.controlPad;

    }

      private padValues: any =
      {
          A: 1,
          B: 2,
          Select: 4,
          Start: 8,

          Up: 16,
          Down: 32,
          Left: 64,
          Right: 128,

          FullScreen: 256
      };

      handleKeyDownEvent(event: KeyboardEvent) {
          switch (event.keyCode) {
              case 37: //left arrow
                  this.controlPad.padOneState |= 64 & 0xFF;
                  break;
              case 38: //up arrow	
                  this.controlPad.padOneState |= 16 & 0xFF;
                  break;
              case 39: //right arrow	39
                  this.controlPad.padOneState |= 128 & 0xFF;
                  break;
              case 40: //down arrow	40
                  this.controlPad.padOneState |= 32 & 0xFF;
                  break;
              case 90: //	z
                  this.controlPad.padOneState |= 2 & 0xFF;
                  break;
              case 88: //x
                  this.controlPad.padOneState |= 1 & 0xFF;
                  break;
              case 13: // enter
                  this.controlPad.padOneState |= 8 & 0xFF;
                  break;
              case 9: // tab
                  this.controlPad.padOneState |= 4 & 0xFF;
                  break;
          }
      }

      handleKeyUpEvent(event: KeyboardEvent) {
          switch (event.keyCode) {
              case 37: //left arrow
                  this.controlPad.padOneState &=~64 & 0xFF;
                  break;
              case 38: //up arrow	
                  this.controlPad.padOneState &=~16 & 0xFF;
                  break;
              case 39: //right arrow	39
                  this.controlPad.padOneState &=~128 & 0xFF;
                  break;
              case 40: //down arrow	40
                  this.controlPad.padOneState &=~32 & 0xFF;
                  break;
              case 90: //	z
                  this.controlPad.padOneState &=~2 & 0xFF;
                  break;
              case 88: //x
                  this.controlPad.padOneState &=~1 & 0xFF;
                  break;
              case 13: // enter
                  this.controlPad.padOneState &=~8 & 0xFF;
                  break;
              case 9: // tab
                  this.controlPad.padOneState &=~4 & 0xFF;
                  break;
          }
      }

    IsRunning(): boolean {
        return this.machine.IsRunning;
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
    ResetEmulator(): void {
        this.machine.Reset();
    }
}