import { BaseCart, BaseCart4k } from "./BaseCart";

// simple discrete logic multi-carts, various pirate xxxxx-in-1s

 export class Mapper031Cart extends BaseCart4k {
     registers:number[] = [0,0,0,0,0,0,0,0xFF];
     InitializeCart() {
         this.mapsBelow6000 = true;
         this.mapperName = 'NSF Compilation';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(this.registers[0], this.registers[1], this.registers[2], this.registers[3], this.registers[4], this.registers[5], this.registers[6], this.registers[7])
         
//         this.SetupBankStarts(0, 0, 0, 0,  (this.prgRomCount * 4) - 4,  (this.prgRomCount * 4) - 3, (this.prgRomCount * 4) - 2, (this.prgRomCount * 4) - 1);
        }
 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 0x6000 && address <= 0x7FFF) {
            this.prgRomBank6[address & 8191] = val & 255;
         }
         if ((address & 0xFFF0)=== 0x5FF0) {
            this.registers[address & 0x7] = val;
            this.SetupBankStarts(this.registers[0], this.registers[1], this.registers[2], this.registers[3], this.registers[4], this.registers[5], this.registers[6], this.registers[7])
         }
        // switch (address) {
        //     case 0x5FF8:
        //         this.registers[address & 0x7] = val;
        //     //AAA  PPPP PPPP
        //         this.SetupBankStarts(val, this.current9,  this.currentA, this.currentB, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FF9:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, val,  this.currentA, this.currentB, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFA:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  val, this.currentB, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFB:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, val, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFC:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, val, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFD:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, this.currentC, val, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFE:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, this.currentC, this.currentD, val , this.currentF);
        //         break;
        //     case 0x5FFF:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, this.currentC, this.currentD, this.currentE , val);
        //         break;
        //     } 
     }

     GetByte(clock: number, address: number): number {
        let bank = 0;

        switch (address & 0xF000) {
            // case 0x5000: 
            //     return this.registers[address & 0x7];
            case 0x6000:
            case 0x7000:
                return this.prgRomBank6[address & 0x1FFF];
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0x9000:
                bank = this.bank9start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xB000:
                bank = this.bankBstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xD000:
                bank = this.bankDstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
            case 0xF000:
                bank = this.bankFstart;
                break;
        }
        return this.nesCart[bank + (address & 0xFFF)];

    }
 }
  