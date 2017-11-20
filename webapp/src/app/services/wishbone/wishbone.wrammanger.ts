import { ICartSettings } from "../ICartSettings";
import { Emulator } from "../NESService";

export class WramManager {
    constructor (private cartSettings: ICartSettings, private nes: Emulator) {

    }
    clearWram() {
        localStorage.setItem(this.cartSettings.crc + '_wram', undefined);
    }

    saveWram() {
        const wishbone = this.nes.wishbone;
        let item = wishbone.Cart.saveWram();
        localStorage.setItem(this.cartSettings.crc + '_wram', JSON.stringify(item));
    }        

    restoreWram() {
        let item = localStorage.getItem(this.cartSettings.crc + '_wram');
        const wishbone = this.nes.wishbone;
        if (item) {
            const wram = JSON.parse(item) 
            wishbone.Cart.restoreWram(wram);
        }
    }  
}