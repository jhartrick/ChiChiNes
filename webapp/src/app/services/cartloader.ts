import { BaseCart } from 'chichi';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class CartLoader {
    
    static doLoadCart(rom: number[], name: string, machine: any) {
        return new Observable<BaseCart>((subj) => {
            (require as any).ensure(['../../assets/romloader.worker.js'], (require) => {
                const romLoader = require('../../assets/romloader.worker.js');

                const cart = romLoader.loader.loadRom(rom, name, machine);
                subj.next(cart);

                delete romLoader.loader;
                delete require.cache[require.resolve('../../assets/romloader.worker.js')];
            });
        });
    }
}
