import { BaseCart } from "./BaseCart";

export class VSCart extends BaseCart {
    
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        reg16 = 0;
        bankSelect = 0;
        InitializeCart() {
            this.usesSRAM = true;
            this.mapperName = 'VS Unisystem';
            this.mapsBelow6000 = true;
            if (this.chrRomCount > 0) {
                this.copyBanks(0, 0, 0, 2);
            }
            this.SetupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
            this.mirror(0,3);
        }

        SetByte(clock: number, address: number, val: number): void {
            this.setPrgRam(address, val);

            if (address == 0x4016) {
                this.bankSelect = val;
                const chrbank = (val >> 2) & 0x1;
                if (this.prgRomCount > 2) { 
                    this.SetupBankStarts(chrbank, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
                }
                this.copyBanks(clock, 0, chrbank, 1);
            }
        }
             
     }
     