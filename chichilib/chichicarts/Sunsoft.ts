import { BaseCart } from "./BaseCart";

export class Mapper093Cart extends BaseCart {
    InitializeCart(): void {
        
        this.mapperName = 'Sunsoft-2';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            
            const prgbank = ((val >> 4) & 0x7) << 1;
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            
        }

    }

}

export class Mapper089Cart extends BaseCart {
    InitializeCart(): void {
        
        this.mapperName = 'Sunsoft-2 on 3';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            let lobank = val & 0x7;
            lobank |= ((val >> 7) & 1) << 3;
            const prgbank = ((val >> 4) & 0x7) << 1;

            let mirror = (val >> 3) & 1;
            this.oneScreenOffset = mirror * 1024;
            this.Mirror(clock,0);
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.copyBanks(clock, 0, lobank, 1);

        }

    }

}

export class Mapper184Cart extends BaseCart {
    InitializeCart(): void {
        this.usesSRAM = false;
        this.mapperName = 'Sunsoft-1';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x6000 && address <= 0x7FFF) {
            const lobank = val & 0x7;
            const hibank = (val >> 4) & 0x3;
            this.copyBanks4k(clock, 0, lobank, 1);
            this.copyBanks4k(clock, 1, hibank + 4, 1);
        }

    }

}
