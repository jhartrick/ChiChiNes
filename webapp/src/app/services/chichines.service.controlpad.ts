import { Injectable } from '@angular/core';

@Injectable()
export class ControlPad implements ChiChiNES.IControlPad {

    currentByte: number = 0;
    readNumber: number = 0;
    padOneState: number = 0;
    CurrentByte: number;

    public padValues: any =
    {
        A: 1,
        B: 2,
        Select: 4,
        Start: 8,

        Up: 16,
        Down: 32,
        Left: 64,
        Right: 128

    };


    ChiChiNES$IControlPad$refresh(): void {
        this.refresh();
    }

    refresh(): void {
    }

    ChiChiNES$IControlPad$getByte(clock: number): number {
        return this.getByte(clock);
    }

    getByte(clock: number): number {
        var result = (this.currentByte >> this.readNumber) & 0x01;
        this.readNumber = (this.readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    }

    ChiChiNES$IControlPad$setByte(clock: number, data: number): void {
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
    }

      handleKeyDownEvent(event: KeyboardEvent) {
          switch (event.keyCode) {
              case 37: //left arrow
                  this.padOneState |= 64 & 0xFF;
                  break;
              case 38: //up arrow	
                  this.padOneState |= 16 & 0xFF;
                  break;
              case 39: //right arrow	39
                  this.padOneState |= 128 & 0xFF;
                  break;
              case 40: //down arrow	40
                  this.padOneState |= 32 & 0xFF;
                  break;
              case 90: //	z
                  this.padOneState |= 2 & 0xFF;
                  break;
              case 88: //x
                  this.padOneState |= 1 & 0xFF;
                  break;
              case 13: // enter
                  this.padOneState |= 8 & 0xFF;
                  break;
              case 9: // tab
                  this.padOneState |= 4 & 0xFF;
                  break;
          }
      }

      handleKeyUpEvent(event: KeyboardEvent) {
          switch (event.keyCode) {
              case 37: //left arrow
                  this.padOneState &=~64 & 0xFF;
                  break;
              case 38: //up arrow	
                  this.padOneState &=~16 & 0xFF;
                  break;
              case 39: //right arrow	39
                  this.padOneState &=~128 & 0xFF;
                  break;
              case 40: //down arrow	40
                  this.padOneState &=~32 & 0xFF;
                  break;
              case 90: //	z
                  this.padOneState &=~2 & 0xFF;
                  break;
              case 88: //x
                  this.padOneState &=~1 & 0xFF;
                  break;
              case 13: // enter
                  this.padOneState &=~8 & 0xFF;
                  break;
              case 9: // tab
                  this.padOneState &=~4 & 0xFF;
                  break;
          }
      }

    dispose(): void {
    }
}
