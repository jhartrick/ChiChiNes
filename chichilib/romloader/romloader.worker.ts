import { iNESFileHandler } from '../chichicarts/ChiChiCarts'
import { IBaseCart } from '../chichicarts/BaseCart';
import { ChiChiMachine } from '../chichi/ChiChiMachine';
import { GeniePatch } from '../chichi/ChiChiCheats';

export class romLoader {
    constructor() {
    }
    loadRom(data: any, name: string, machine: ChiChiMachine) : IBaseCart {
        let cart = iNESFileHandler.loadRomFile(data);
        cart.installCart(machine.ppu, machine.Cpu);
        machine.Cpu.Cart = cart;

        machine.Cart.NMIHandler = () => { machine.Cpu._handleIRQ = true; };
        machine.ppu.ChrRomHandler = machine.Cart;

        machine.Cpu.cheating = false;
        machine.Cpu.genieCodes = new Array<GeniePatch>();


        return cart;
    }
}
export const loader = new romLoader();
