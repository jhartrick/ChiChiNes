import { BaseCart } from "./BaseCart";

export class VSCart extends BaseCart {
    
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        bankSelect = 0;
        InitializeCart() {
            this.mapperName = 'VS Unisystem';
            this.mapsBelow6000 = true;
            if (this.chrRomCount > 0) {
                this.CopyBanks(0, 0, 0, 1);
            }
            this.SetupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        }

        SetByte(clock: number, address: number, val: number): void {
            if (address == 0x4016) {
                this.bankSelect = val;
                const chrbank =(val >> 2) & 0x1;
                if (this.prgRomCount > 2){ 
                    this.SetupBankStarts(chrbank, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
                }
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 0, chrbank, 1);
            }
        }
             
     }
     