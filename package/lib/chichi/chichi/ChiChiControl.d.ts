interface ChiChiControlPad {
    getPadState: () => number;
    getByte: (clock: number, address: number) => number;
    setByte: (clock: number, address: number, value: number) => void;
}
declare const createControlPad: () => ChiChiControlPad;
export { ChiChiControlPad, createControlPad };
