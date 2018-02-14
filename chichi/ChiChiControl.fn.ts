    //input classes
    export class ChiChiInputHandler {
        ControlPad = createPad();
        GetByte(clock: number, address: number): number {
            return this.ControlPad.getByte(clock);
        }
        SetByte(clock: number, address: number, data: number): void {
            return this.ControlPad.setByte(clock, data);
        }
    }
    
    export interface ChiChiControlPad {
        padOneState: number;
        currentByte: number;
        readNumber: number;
        getByte(clock: number): number;
        setByte(clock: number, data: number): void;
    }
    
    
    export function createPad(): ChiChiControlPad {
        console.log('createpad');
        let currentByte: number = 0;
        let padOneState: number = 0;
        let readNumber: number = 0;
    
        const getByte = (state: ChiChiControlPad) => (clock: number) => {
            const result = (state.currentByte >> state.readNumber) & 0x01;
            state.readNumber = (state.readNumber + 1) & 7;
            return (result | 0x40) & 0xFF;
        }
    
        const setByte = (state: ChiChiControlPad) => (clock: number, data: number): void => {
            if ((data & 1) == 1) {
                currentByte = padOneState;
                // if im pushing up, i cant be pushing down
                if ((currentByte & 16) == 16) currentByte = currentByte & ~32;
                // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
                if ((currentByte & 64) == 64) currentByte = currentByte & ~128;
                readNumber = 0;
            }
        }
        const result = {
            currentByte, 
            padOneState,
            readNumber,
            getByte: <(clock: number) => number>undefined,
            setByte: <(clock: number, data: number) => void>undefined
        };
        result.getByte = getByte(result), 
        result.setByte = setByte(result)
        return result;
    }
    