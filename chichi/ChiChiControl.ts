    //input classes
class ChiChiInputHandler {
    ControlPad = createControlPad();

    GetByte(clock: number, address: number): number {
        return this.ControlPad.getByte(clock, address);
    }
    SetByte(clock: number, address: number, data: number): void {
        return this.ControlPad.setByte(clock, address, data);
    }

}

interface ChiChiControlPad {
    getPadState: () => number;
    getByte: (clock: number, address: number) => number;
    setByte: (clock: number, address: number, value: number) => void;
}


const createControlPad = (): ChiChiControlPad => {

    let currentByte: number = 0;
    let readNumber: number = 0;
    let padOneState: number = 0;

    const getPadState  = () => {
        return padOneState;
    }

    const getByte = (clock: number, address: number) => {
        var result = (currentByte >> readNumber) & 0x01;
        readNumber = (readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    }

    const setByte = (clock: number, address: number, data: number): void => {
        if ((data & 1) == 1) {
            currentByte = getPadState();
            // if im pushing up, i cant be pushing down
            if ((currentByte & 16) == 16) currentByte = currentByte & ~32;
            // if im pushign left, i cant be pushing right..  the nes will glitch
            if ((currentByte & 64) == 64) currentByte = currentByte & ~128;
            readNumber = 0;
        }
    }

    return Object.create({
        getPadState, getByte, setByte
    });
}

export { ChiChiControlPad, createControlPad }