import { BaseCart } from "./BaseCart";

// simple discrete logic multi-carts, various pirate xxxxx-in-1s

 export class Mapper051Cart extends BaseCart {
     InitializeCart() {
         this.mapperName = 'Charlie Multi-Cart';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1,  2, 3);
        }
 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             let mode = (val >> 6) & 0x01;
 
             if (mode)  {
                 // 16k banks 
                 let newbank81 = (val ) << 1;
                 this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
                     
             } else {
                 // 32k banks 
                 let newbank81 = 0;
                 newbank81 = (val ) << 2;
                 this.SetupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
         
             }
 
             this.Whizzler.DrawTo(clock);
             this.Mirror(clock, (( val >> 7) & 0x1) + 1 );
             this.CopyBanks(clock, 0,(val >> 3) & 7, 1);
         }
     }
     
 }
  
 export class Mapper058Cart extends BaseCart {
     InitializeCart() {
         this.mapperName = 'Charlie Multi-Cart';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1,  2, 3);
        }
 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             let mode = (address >> 6) & 0x01;
 
             if (mode)  {
                 // 16k banks 
                 let newbank81 = (address & 7) << 1;
                 this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
                     
             } else {
                 // 32k banks 
                 let newbank81 = 0;
                 newbank81 = (address & 7) << 2;
                 this.SetupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
         
             }
 
             this.Whizzler.DrawTo(clock);
             this.Mirror(clock, (( address >> 7) & 0x1) + 1 );
             this.CopyBanks(clock, 0,(address >> 3) & 7, 1);
         }
     }
     
 }
 
 export class Mapper202Cart extends BaseCart {
     
     InitializeCart() {
         this.mapperName = 'Multi-Cart';
         if (this.chrRomCount > 0) {
             this.CopyBanks(0, 0, 0, 1);
         }
         this.SetupBankStarts(0, 1, 0, 1);
        }
 
     SetByte(clock: number, address: number, val: number): void {
         if (address >= 0x8000) {
             //let mode = ((address >> 14) & 0x01)==0x01;
             let bank =(address >> 1) & 7;
          
             if ((address & 1 ) | ((address >> 2) & 2)) {
                 let newbank81 = (bank >> 1) << 2;
                 this.SetupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
     
             } else {
                 let newbank81 = (bank >> 1) << 1;
                 this.SetupBankStarts(newbank81, newbank81 + 1 ,  newbank81,  newbank81 + 1);
                 
             }
                 
 
             this.Whizzler.DrawTo(clock);
             this.Mirror(clock, (( address) & 0x1) + 1 );
             this.CopyBanks(clock, 0, bank, 1);
         }
     }
 }
 
 export class Mapper212Cart extends BaseCart {
    
    InitializeCart() {
        this.mapperName = 'Multi-Cart212';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 2);
        }
        this.SetupBankStarts(0, 1, 3, 4);
    }
 
    SetByte(clock: number, address: number, val: number): void {

        if (address >= 0x8000 && address <= 0xFFFF) {
            let mode = ((address >> 14) & 0x01)==0x01;
            let bank = address & 7;
            // Write $8000-$FFFF:
            // A~[1o.. .... .... MBBb]
            if (mode)  {
                // When it's 1, BB is 32 KiB PRG bank at CPU $8000.

                let newbank81 = (address & 6) << 2;
                this.SetupBankStarts(newbank81, newbank81 + 1 ,  newbank81 + 2,  newbank81 + 3);
                    
            } else {
                // When Banking style is 0, BBb specifies a 16 KiB PRG bank at both CPU $8000 and $C000. 
                let newbank81 = bank << 1;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }

            this.Whizzler.DrawTo(clock);
            this.Mirror(clock, (( address >> 3) & 0x1) + 1 );
            this.CopyBanks(clock, 0, bank, 1);
        }
    }
}
 