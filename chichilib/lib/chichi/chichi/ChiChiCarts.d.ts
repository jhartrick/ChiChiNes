import { ChiChiCPPU } from './ChiChiMachine';
import { IBaseCart } from './Carts/BaseCart';
export declare class iNESFileHandler {
    static LoadROM(cpu: ChiChiCPPU, thefile: number[]): IBaseCart;
}
