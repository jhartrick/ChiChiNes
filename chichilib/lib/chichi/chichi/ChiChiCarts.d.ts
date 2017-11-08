import { ChiChiCPPU } from './ChiChiMachine';
import { IBaseCart } from '../chichicarts/BaseCart';
export declare class iNESFileHandler {
    static LoadROM(cpu: ChiChiCPPU, thefile: number[]): IBaseCart;
    static loadRomFile(thefile: number[]): IBaseCart;
}
