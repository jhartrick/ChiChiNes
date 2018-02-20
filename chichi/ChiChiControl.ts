    //input classes
export class ChiChiInputHandler {
    IsZapper: boolean;
    ControlPad = new ChiChiControlPad();
    CurrentByte: number;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    controlPad_NextControlByteSet(sender: any, e: any): void {
        // throw new Error("Method not implemented.");
    }
    GetByte(clock: number, address: number): number {
        return this.ControlPad.getByte(clock);
    }
    SetByte(clock: number, address: number, data: number): void {
        return this.ControlPad.setByte(clock, data);
    }
    SetNextControlByte(data: number): void {
    }
    HandleEvent(Clock: number): void {
    }
    ResetClock(Clock: number): void {
    }

}

export class ChiChiControlPad {

    currentByte: number = 0;
    readNumber: number = 0;
    padOneState: number = 0;

    getPadState() {
        return this.padOneState;
    }

    refresh(): void {
    }

    getByte(clock: number) {
        var result = (this.currentByte >> this.readNumber) & 0x01;
        this.readNumber = (this.readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    }

    setByte(clock: number, data: number): void {
        if ((data & 1) == 1) {
            this.currentByte = this. getPadState();
            // if im pushing up, i cant be pushing down
            if ((this.currentByte & 16) == 16) this.currentByte = this.currentByte & ~32;
            // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
            if ((this.currentByte & 64) == 64) this.currentByte = this.currentByte & ~128;
            this.readNumber = 0;
        }
    }
}


// export const createPad = () => {
//     let currentByte = 0;
//     let readNumber = 0;
//     let padOneState = 0;

//     const getByte = () => {
//         let result = (currentByte >> readNumber) & 0x01;
//         readNumber = (readNumber + 1) & 7;
//         return (result | 0x40) & 0xFF;
//     }

//     const setByte = (data: number): void => {
//         if ((data & 1) == 1) {
//             currentByte = padOneState;
//             // if im pushing up, i cant be pushing down
//             if ((currentByte & 16) == 16) { currentByte = currentByte & ~32; }
//             // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
//             if ((currentByte & 64) == 64) { currentByte = currentByte & ~128; }
//             readNumber = 0;
//         }
//     }

//     return {
//         setByte,
//         getByte
//     }

// }
