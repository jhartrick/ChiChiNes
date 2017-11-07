import { IBaseCart } from './Carts/BaseCart';
import { ChiChiMachine } from './ChiChiMachine';

export class ChiChiUtilities {
    static require: any;

    romLoader(rom: number[], name: string, machine: ChiChiMachine, callback: (rom: IBaseCart) => void) {
        if (ChiChiUtilities.require) {
            ChiChiUtilities.require(
                { 
                    baseUrl: "./assets" 
                },['romloader.worker'], (romLoader: any) => {
                    const cart = romLoader.loader.loadRom(rom, name);
                    cart.installCart(machine.ppu, machine.Cpu);
                    romLoader = undefined;
                    callback(cart);
            });
        } else {
            throw 'require is not loaded';
        }
    }
}