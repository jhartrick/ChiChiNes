import { iNESFileHandler } from '../chichi/ChiChiCarts'
import { IBaseCart } from '../chichi/Carts/BaseCart';

export class romLoader {
    constructor() {
    }
    loadRom(data: any, name: string) : IBaseCart {
        let rom = iNESFileHandler.loadRomFile(data);
        return rom;
    }
}
export const loader = new romLoader();
