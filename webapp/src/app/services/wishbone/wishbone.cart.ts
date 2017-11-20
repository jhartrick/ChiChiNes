import { IBaseCart, BaseCart, ChiChiCPPU } from 'chichi';

export class WishboneCart {
    name: string;
    get supported(): boolean {
        return this.realCart ? this.realCart.supported : false;
    }

    get cartInfo() : any {
        return null;
    }

    get prgRomCount(): number {
        return this.realCart ? this.realCart.prgRomCount : -1;
    }

    get chrRomCount(): number {
        return this.realCart ? this.realCart.chrRomCount : -1;
    }

    get mapperID(): number {
        return this.realCart ? this.realCart.mapperId : -1;
    }

    get mapperName(): string {
        return this.realCart ? this.realCart.mapperName : '';
    }

    get submapperId(): number {
        return this.realCart.submapperId > 0 ? this.realCart.submapperId : 0;
    }

    saveWram(): number[] {
        return Array.from(this.realCart.prgRomBank6.slice());
    }

    restoreWram(value: number[]) {
        for(let i = 0; i < value.length; ++i) {
            this.realCart.prgRomBank6[i] = value[i];
        }
    }

    CartName: string;
    ROMHashFunction: string;

    realCart: BaseCart = null;

    GetPPUByte(clock: number, address: number): number {
        if (this.realCart) {
            return this.realCart.GetPPUByte(clock, address);
        } else {
            return 0;
        }
    }

    GetByte(Clock: number, address: number): number {
        if (this.realCart) {
            return this.realCart.GetByte(Clock, address);
        } else  {
            return 0;
        }
    }


}
