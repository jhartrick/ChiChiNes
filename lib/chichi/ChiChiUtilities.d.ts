import { IBaseCart } from './Carts/BaseCart';
import { ChiChiMachine } from './ChiChiMachine';
export declare class ChiChiUtilities {
    static require: any;
    romLoader(rom: number[], name: string, machine: ChiChiMachine, callback: (rom: IBaseCart) => void): void;
}
