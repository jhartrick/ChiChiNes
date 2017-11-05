// MMC2 and MMC4

import { BaseCart } from "./BaseCart";

export class MMC2Cart extends BaseCart {
    selector: number[] = [0,0];
    banks: number[] = [0,0,0,0];
    
    InitializeCart() {
        this.mapperName='MMC2';
        this.selector[0] = 1;
        this.selector[1] = 2;

        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;

        this.SetupBankStarts(0,(this.prgRomCount * 2) - 3,(this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);

        this.CopyBanks(0, 0,this.banks[this.selector[0]], 1);
        this.CopyBanks(0,1,this.banks[this.selector[1]], 1);

    }
    
    CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        
            if (dest >= this.chrRomCount) {
                dest = (this.chrRomCount - 1) | 0;
            }
    
            const oneKsrc = src << 2;
            const oneKdest = dest << 2;

            for (let i = 0; i < (numberOf4kBanks << 2); i++) {
                this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
    
            }
            this.UpdateBankStartCache();
    }

    GetPPUByte(clock: number, address: number) : number {
        var bank: number =0;
        if (address == 0xFD8)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[0] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
        }else if (address == 0xFE8) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[0] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
        }else if (address >= 0x1FD8 && address <= 0x1FDF)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[1] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
        }else if (address >= 0x1FE8 && address <= 0x1FEF) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[1] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
        }

        bank = address >> 10 ;
        let newAddress = this.ppuBankStarts[bank] + (address & 1023);


        let data = this.chrRom[newAddress];
        return data;
    }

    SetByte(clock: number, address: number, val: number) {

        this.Whizzler.DrawTo(clock);

        switch (address >> 12) {
            case 0x6:
            case 0x7:
            if (this.SRAMEnabled && this.SRAMCanWrite) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
                break;
            case 0xA:
                this.SetupBankStarts((val & 0xF), this.currentA, this.currentC, this.currentE);
                break
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.UnpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
                break;
            case 0xF:
                this.Mirror(clock, (val & 0x1) + 1);
                 break;

        }

        // this.SetupBankStarts()
        
        //chr.SwapBanks<SIZE_4K,0x0000>( banks[selector[0]], banks[selector[1]] );

    }
}

export class MMC4Cart extends BaseCart {
    selector: number[] = [0,0];
    banks: number[] = [0,0,0,0];
    
    InitializeCart() {
        this.mapperName='MMC4';
        this.selector[0] = 1;
        this.selector[1] = 2;

        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;

        this.SetupBankStarts(0, 1,(this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);

        this.CopyBanks(0, 0,this.banks[this.selector[0]], 1);
        this.CopyBanks(0,1,this.banks[this.selector[1]], 1);

    }
    
    CopyBanks(clock: number, dest: number, src: number, numberOf4kBanks: number): void {
        if (dest >= this.chrRomCount) {
            dest = (this.chrRomCount - 1) | 0;
        }

        const oneKsrc = src << 2;
        const oneKdest = dest << 2;

        for (let i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    }
    
    GetPPUByte(clock: number, address: number) : number {
        var bank: number =0;
        if (address >= 0xFD8 && address <= 0xFDF)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[0] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
        }else if (address >= 0xFE8 && address <= 0xFEF) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[0] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
        }else if (address >= 0x1FD8 && address <= 0x1FDF)
        {
                bank = (address >> 11) & 0x2; 
                this.selector[1] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
        }else if (address >= 0x1FE8 && address <= 0x1FEF) {
            
                bank = ((address >> 11) & 0x2) | 0x1; 
                this.selector[1] = bank;
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
        }

        bank = address >> 10 ;
        let newAddress = this.ppuBankStarts[bank] + (address & 1023);
        let data = this.chrRom[newAddress];
        return data;
    }

    SetByte(clock: number, address: number, val: number) {

        this.Whizzler.DrawTo(clock);

        switch (address >> 12) {
            case 0x6:
            case 0x7:
            if (this.SRAMEnabled && this.SRAMCanWrite) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
                break;
            case 0xA:
                const bank8 = (val & 0xF) << 1;
                this.SetupBankStarts(bank8, bank8 + 1, this.currentC, this.currentE);
                break
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.UnpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock,1,this.banks[this.selector[1]], 1);
                break;
            case 0xF:
                this.Mirror(clock, (val & 0x1) + 1);
                 break;

        }
    }

}
