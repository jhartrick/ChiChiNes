// 
import { BaseCart } from "./BaseCart";

export class Mapper133Cart extends BaseCart {
    InitializeCart() {
        this.mapperName = 'UNL-SA-72008';
        this.usesSRAM = false;
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0,0,this.chrRomCount  - 1,1);
        this.mirror(0,1)
    }

    SetByte(clock:number, address: number, data: number) {
        switch(address & 0x6100) {
            case 0x4100:
                const chrbank = data & 3;
                this.copyBanks(clock,0,chrbank, 1);
                const prgbank = ((data >> 2) & 1) << 2;
                this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            break;

        }
    }
}