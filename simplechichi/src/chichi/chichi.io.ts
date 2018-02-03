import { Wishbone } from './wishbone/wishbone';

export interface ChiChiIO {
    keydown: (f: (e: any) => void) => void;
    keyup: (f: (e: any) => void) => void;
    drawFrame: (wishbone: Wishbone) => () => void;
}
