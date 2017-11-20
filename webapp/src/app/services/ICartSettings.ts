import { WramManager } from "./wishbone/wishbone.wrammanger";

export interface ICartSettings {
    name: string;
    mapperName: string;
    crc: string;
    prgRomCount: number;
    chrRomCount: number;
    mapperId: number;
    submapperId: number;
    wram: WramManager
}
