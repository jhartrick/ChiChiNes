import { iNESFileHandler } from '../chichicarts/ChiChiCarts'
import { IBaseCart } from '../chichicarts/BaseCart';

export class romLoader {
    constructor() {
    }
    loadRom(data: any, name: string) : IBaseCart {
        let cart = iNESFileHandler.loadRomFile(data);

        return cart;
    }
}
export const loader = new romLoader();
