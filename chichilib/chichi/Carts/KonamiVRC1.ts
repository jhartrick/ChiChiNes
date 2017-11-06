import { BaseCart } from "./BaseCart";

export class KonamiVRC1Cart extends BaseCart {
    InitializeCart() {
        this.mapperName = 'KonamiVRC1';
        if (this.mapperId == 151) {
            this.mapperName = 'KonamiVRC1 (VS)';
        }
        this.SetupBankStarts(0, 0, 0, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);
    }
    chrbank0 = 0;
    chrbank1 = 0;
    
    SetByte(clock:number, address:number, data: number){
        switch(address & 0xF000) {
        case 0x8000:
            // 8kib prg rom at 8000
            let bank8 = data & 0xF;
            this.SetupBankStarts(bank8, this.currentA, this.currentC, this.currentE);

            break;
        case 0xA000:
            // 8kib prg rom at A000
            let bankA = data & 0xF;
            this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
            break;
        case 0xC000:
            // 8kib prg rom at C000
            let bankC = data & 0xF;
            this.SetupBankStarts(this.current8, this.currentA, bankC, this.currentE);
            break;
        case 0x9000:
            this.Whizzler.DrawTo(clock);
            
            if (!this.fourScreen) {
                this.Mirror(clock, (data & 1)+1);
            }
            this.chrbank0 = (data & 2) << 3;
            this.chrbank1 = (data & 4) << 2;
            // this.CopyBanks4k(clock, 0, this.chrbank0 , 1);
            // this.CopyBanks4k(clock, 1, this.chrbank1 , 1);
            break;
        case 0xE000:
            // 8kib prg rom at 8000
            this.CopyBanks4k(clock, 0, this.chrbank0 | (data & 0xF), 1);
            break;
        case 0xF000:
            // 8kib prg rom at 8000
            this.CopyBanks4k(clock, 1, this.chrbank1 | (data & 0xF), 1);
            break;

        }
    }
}