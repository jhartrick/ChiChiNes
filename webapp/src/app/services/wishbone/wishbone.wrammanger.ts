import { ICartSettings } from "../ICartSettings";
import { NESService } from "../NESService";

export class WramManager {
    batteryBacked: boolean = false;
    crc: string;
    extension: string = '_wram';

    constructor (private nes: NESService) {
        this.nes.runStatusChanged.subscribe((status) => {
            switch(status) {
                case 'loaded':
                    if (this.batteryBacked) {
                        this.restore();
                    }
                break;
                case 'stopped':
                    if (this.batteryBacked) {
                        this.save();
                    }
                break;
            }
        })
        this.crc = this.nes.wishbone.Cart.ROMHashFunction;
        this.batteryBacked = this.nes.wishbone.Cart.realCart.batterySRAM;
    }

    clear() {
        localStorage.setItem(this.crc + this.extension, undefined);
    }

    save() {
        const wishbone = this.nes.wishbone;
        let item = wishbone.Cart.saveWram();
        localStorage.setItem(this.crc + this.extension, JSON.stringify(item));
    }        

    restore() {
        let item = localStorage.getItem(this.crc + this.extension);
        const wishbone = this.nes.wishbone;
        if (item) {
            const wram = JSON.parse(item) 
            wishbone.Cart.restoreWram(wram);
        }
    }  
}