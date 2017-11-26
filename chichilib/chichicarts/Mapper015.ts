// 
import { BaseCart } from "./BaseCart";

export class Mapper015Cart extends BaseCart {
    InitializeCart() {
        this.mapperName = 'Contra 100-in-1';
        this.usesSRAM = true;
        
        this.SetupBankStarts(0,1,2,3);
        this.mirror(0,2);
    }

    SetByte(clock:number, address: number, data: number) {
        if (address >= 0x6000 && address <= 0xffff) {
            this.prgRomBank6[address & 0x1fff] = data;
        } else
        if (address >= 0x8000 && address <= 0xffff) {
            const bankmode = address & 3;
            let bank = data & 0x3f;
            let subbank = (data >> 7) & 1; 
            const mirror = (data >> 6) & 1;
            this.mirror(clock, 2-mirror );
            switch (bankmode) {
                case 0:
                    bank = bank << 2;
                    this.SetupBankStarts(bank ^ subbank, (bank + 1) ^ subbank, (bank + 2) ^ subbank, (bank + 3) ^ subbank);
                    break;
                case 2:
                    bank = (bank | subbank);
                    this.SetupBankStarts(bank, bank, bank, bank);
                    break;
                case 1:
                case 3:
                    bank = (bank << 1);
                    bank |= subbank;
                    this.SetupBankStarts(bank, bank + 1, (~address >> 1 & 1), (bank ) + 1);
                    break;

            } 
        }
    }
}