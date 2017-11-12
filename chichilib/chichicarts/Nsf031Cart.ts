import { BaseCart } from "./BaseCart";

// simple discrete logic multi-carts, various pirate xxxxx-in-1s

 export class Mapper031Cart extends BaseCart {
     registers:number[] = [0,0,0,0,0,0,0,0xFF];
     InitializeCart() {
         this.mapsBelow6000 = true;
         this.mapperName = 'NSF Compilation';
         if (this.chrRomCount > 0) {
             this.copyBanks(0, 0, 0, 1);
         }
         this.setupBanks4k(2, this.registers)
         
      }
 
     SetByte(clock: number, address: number, val: number): void {
         if ((address & 0xFFF0)=== 0x5FF0) {
            this.registers[address & 0x7] = val;
            this.setupBanks4k(2, this.registers)
         }
     }


 }
  