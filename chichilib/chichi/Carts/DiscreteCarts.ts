import { BaseCart } from "./BaseCart";

//  Simple discrete logic mappers

export class NesCart extends BaseCart {
    // prevBSSrc = new Uint8Array(8);
 
     InitializeCart(): void {
 
         //for (var i = 0; i < 8; i = (i + 1) | 0) {
         //    this.prevBSSrc[i] = -1;
         //}
         //SRAMEnabled = SRAMCanSave;
         switch (this.mapperId) {
         case 0:
             this.mapperName = 'NROM';
             break;
         case 180:
             this.mapperName  = 'UNROM (Crazy Climber?)';
 
             break;
         }
 


            if (this.chrRomCount > 0) {
                this.CopyBanks(0, 0, 0, 1);
            }
            this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);

     }

 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 24576 && address <= 32767) {
             if (this.SRAMEnabled) {
                 this.prgRomBank6[address & 8191] = val & 255;
             }
 
             return;
         }
 
         if (this.mapperId === 3 && address >= 0x8000) {
 
             this.CopyBanks(clock, 0, val, 1);
         }
 
         if (this.mapperId === 180 && address >= 32768) {
             let newbankC1 = 0;
 
             newbankC1 = val * 2;
             // keep two LOW banks, swap high banks
 
             // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
             this.SetupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));
         }
 
     }
 }
 
 export class UxROMCart extends BaseCart {
     InitializeCart(): void {
         this.mapperName = 'UxROM';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = 0;
 
             newbank81 = val << 1;
             this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
         }
 
     }
     
 }
 
 export class Mapper081Cart extends BaseCart {
     InitializeCart(): void {
         this.mapperName = 'Super Gun';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = 0;
 
             newbank81 = ((val >> 2) & 3) << 1;
             this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
 
             const chrBank = val & 3;
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock,0,chrBank,1);
         }
 
     }
 }
 
 export class Mapper030Cart extends BaseCart {
     InitializeCart(): void {
         this.mapperName = 'UNROM-512';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = 0;
 
             newbank81 = (val & 0x1F) << 1;
             this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
 
             const chrBank = (val >>5) & 3;
             this.Whizzler.DrawTo(clock);
             this.Mirror(0, (val >>7 ) & 0x1 )
             this.CopyBanks(clock,0,chrBank,1);
         }
 
     }
     
 }
 
 export class Mapper071Cart extends BaseCart {
     InitializeCart(): void {
         this.mapperName = 'Camerica UNROM';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000) {
             let newbank81 = 0;
 
             newbank81 = val << 1;
             this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
         }
 
     }
     
 }
 
 export class Mapper013Cart extends BaseCart {
            //SRAMEnabled = SRAMCanSave;
     InitializeCart() {
         this.mapperName = 'NES-CPROM';
         if (this.chrRomCount > 0) {
             this.CopyBanks4k(0, 0, 0, 1);
             this.CopyBanks4k(0, 1, 1, 1);
         }
         // one 32k prg rom
         this.SetupBankStarts(0, 1, 2, 3);
         this.Mirror(0,2)
     }
 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             this.Whizzler.DrawTo(clock);
             this.CopyBanks4k(clock, 1, (val & 3), 1);
         }
     }
     
 }
 
 export class CNROMCart extends BaseCart {
 
         //for (var i = 0; i < 8; i = (i + 1) | 0) {
         //    this.prevBSSrc[i] = -1;
         //}
         //SRAMEnabled = SRAMCanSave;
     InitializeCart() {
         this.mapperName = 'CNROM';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        }
 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock, 0, val, 1);
         }
     }
     
 }
 
 export class Mapper185Cart extends BaseCart {
     
             //for (var i = 0; i < 8; i = (i + 1) | 0) {
             //    this.prevBSSrc[i] = -1;
             //}
             //SRAMEnabled = SRAMCanSave;
         InitializeCart() {
             this.mapperName = 'CNROM + CP';
             if (this.chrRomCount > 0) {
                 this.CopyBanks(0, 0, 0, 1);
             }
             this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
            }
     
         SetByte(clock: number, address: number, val: number): void {
             if (address >= 0x8000) {
                 this.Whizzler.DrawTo(clock);
                 this.CopyBanks(clock, 0, val, 1);
             }
         }
         
     }
     

     export class Mapper190Cart extends BaseCart {

        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
    InitializeCart() {
        this.mapperName = 'MKGGROM';
        this.CopyBanks(0, 0, 0, 1);
        this.SetupBankStarts(0, 1, 0, 1);
    }

    SetByte(clock: number, address: number, val: number): void {
        if (address >= 0x6000 && address <= 0x7FFF) {
            this.prgRomBank6[address & 8191] = val & 255;
        }
        // prgBank = A14, D2, D1, D0
        if (address >= 0x8000 && address <= 0x9FFF) {
            let prgBank = (val & 7) <<1;
            this.SetupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
        }
        if (address >= 0xC000 && address <= 0xDFFF) {
            let prgBank = ((val & 7) + 8) << 1;
            this.SetupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
            
        }
        if (address >= 0xA000 && address <= 0xBFFF) {
            this.CopyBanks2k(clock, address & 3, val, 1);
        }
    }
}

export class Mapper087Cart extends BaseCart {

    //for (var i = 0; i < 8; i = (i + 1) | 0) {
    //    this.prevBSSrc[i] = -1;
    //}
    //SRAMEnabled = SRAMCanSave;
    InitializeCart() {
        this.mapperName = 'CNROM Clone';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    }

    SetByte(clock: number, address: number, val: number): void {
        if (address >= 0x6000 && address <= 0x7FFF) {
            const chrbank = ((val & 0x1) << 1) | ((val & 0x2) >> 1)
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }
    }
         
 }
 
 export class Mapper145Cart extends BaseCart {
     
             //for (var i = 0; i < 8; i = (i + 1) | 0) {
             //    this.prevBSSrc[i] = -1;
             //}
             //SRAMEnabled = SRAMCanSave;
         InitializeCart() {
             this.mapperName = 'Sachen Sidewinder';
             if (this.chrRomCount > 0) {
                 this.CopyBanks(0, 0, 0, 1);
             }
             this.SetupBankStarts(0, 1, 2, 3);
            }
     
         SetByte(clock: number, address: number, val: number): void {
             if ((address & 0xE100) == 0x4100 ) {
                 const chrbank = val;
                 this.Whizzler.DrawTo(clock);
                 this.CopyBanks(clock, 0, chrbank, 1);
         }
     }
         
 }
 
 export class ColorDreams extends BaseCart {
     // https://wiki.nesdev.com/w/index.php/Color_Dreams
     InitializeCart(): void {
         
         this.mapperName = 'Color Dreams';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, 2, 3);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             const prgbank = (val & 0x3) << 2 ;
             const chrbank = ((val >> 4) & 0xf);
 
             // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
             this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             // two high bits set mirroring
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock, 0, chrbank, 1);
         }
         //         %00 = 1ScA
         //         %01 = Horz
         //         %10 = Vert
         //         %11 = 1ScB
         //this.Mirror(clock,(val >> 6));
     }
 
 }
 
 export class MHROMCart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = 'GxROM';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, 2, 3);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0x3 ;
             const prgbank = ((val >> 4) & 0x3) << 2;
 
             this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 export class Mapper070Cart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = '~Family Trainer';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0xF ;
             const prgbank = ((val >> 4) & 0xF) << 1;
 
             this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
             
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 export class Mapper077Cart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = '~Mapper 077';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             const prgbank = (val & 0xF) << 2;
             const chrbank = ((val >> 4) & 0xF);
 
             this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
             
             this.Whizzler.DrawTo(clock);
             this.CopyBanks2k(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 export class Mapper093Cart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = 'Sunsoft-2';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
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
 
 export class Mapper152Cart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = '~FT + mirroring';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x8000 && address <= 0xFFFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0xF ;
             const prgbank = ((val >> 4) & 0x31) << 1;
 
             this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
             
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock, 0, chrbank, 1);
             this.oneScreenOffset = (val >> 7) == 1 ? 1024 : 0;
             this.Mirror(clock, 0);
         }
 
     }
 
 }
 
 export class JF1xCart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = 'Jaleco JF-11, JF-14';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, 2, 3);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x6000 && address <= 0x7FFF) {
             let newbank81 = 0;
 
             const chrbank = (val) & 0xF ;
             const prgbank = ((val >> 4) & 0x3) << 2;
 
             this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 export class Irem097Cart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = '~Irem TAM-S1 IC';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts((this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1, 0, 1);
     }
 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 24576 && address <= 32767) {
             if (this.SRAMEnabled) {
                 this.prgRomBank6[address & 8191] = val & 255;
             }
 
             return;
         }
 
         let newbankC1 = 0;
 
         newbankC1 = (val & 0xF) * 2;
         // keep two LOW banks, swap high banks
 
         // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
         this.SetupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));
 
         // two high bits set mirroring
         this.Whizzler.DrawTo(clock);
         //         %00 = 1ScA
         //         %01 = Horz
         //         %10 = Vert
         //         %11 = 1ScB
         this.Mirror(clock,(val >> 6));
     }
 
     
 }
 
 export class BitCorp038Cart extends BaseCart {
     InitializeCart(): void {
         
         this.mapperName = 'Bit Corp Crime Busters';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, 2, 3);
     }
 
     SetByte(clock: number, address: number, val: number): void {
 
         if (address >= 0x7000 && address <= 0x7FFF) {
             let newbank81 = 0;
 
             const prgbank = (val & 0x3) <<2;
             const chrbank = ((val >> 2) & 0x3);
 
             this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
 
             this.Whizzler.DrawTo(clock);
             this.CopyBanks(clock, 0, chrbank, 1);
         }
 
     }
 
 }
 
 //  Mapper 7 and derivatives 34
export class AxROMCart extends BaseCart {
    // prevBSSrc = new Uint8Array(8);

 
     InitializeCart(): void {
        this.mapperName = 'AxROM';
        
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
     }

     SetByte(clock: number, address: number, val: number): void {
        if (address < 0x5000) return;         
         if (address >= 24576 && address <= 32767) {
             if (this.SRAMEnabled) {
                 this.prgRomBank6[address & 8191] = val & 255;
             }
             return;
         }
 
        // val selects which bank to swap, 32k at a time
        var newbank8 = 0;
        newbank8 = (val & 15) << 2;
        
        this.SetupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
        // whizzler.DrawTo(clock);
        if ((val & 16) === 16) {
            this.oneScreenOffset = 1024;
        } else {
            this.oneScreenOffset = 0;
        }
        this.Whizzler.DrawTo(clock);
        this.Mirror(clock, 0);

     }
 
 
}

// BNROM (34)
export class BNROMCart extends AxROMCart {
    isNina = false;
    InitializeCart(): void {
        this.mapperName = 'BNROM';
        if (this.chrRomCount > 1) {
            this.mapperName = 'NINA-001';
            this.isNina = true;
            this.SetByte = this.SetByteNina;
        }
        this.SetupBankStarts(0, 1, 2, 3);
        //this.Mirror(0, 0);
     }

     SetByte(clock: number, address: number, val: number): void {
        if (address < 0x5000) return;
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }

            return;
        }

       // val selects which bank to swap, 32k at a time
       var newbank8 = 0;
       newbank8 = (val & 15) << 2;
       
       this.Whizzler.DrawTo(clock);

       this.SetupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
       // whizzler.DrawTo(clock);

    }

    SetByteNina(clock: number, address: number, val: number): void {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }

            return;
        }
        switch (address) {
            case 0x7FFD:
                // val selects which bank to swap, 32k at a time
                let newbank8 = 0;
                newbank8 = (val & 1) << 2;
                this.SetupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
                break;
            case 0x7FFE:
                // Select 4 KB CHR ROM bank for PPU $0000-$0FFF
                this.CopyBanks4k(clock, 0, val & 0xf, 1);
                break;
            case 0x7FFF:
                // Select 4 KB CHR ROM bank for PPU $1000-$1FFF
                this.CopyBanks4k(clock, 1, val & 0xf, 1);
                break;
            
        }


    }


}

