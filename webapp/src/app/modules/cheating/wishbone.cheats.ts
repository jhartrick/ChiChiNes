import { GameGenieCode, ChiChiCheats } from 'chichi';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { WishboneWorker } from '../../services/wishbone/wishbone.worker';

@Injectable()
export class WishboneCheats {
    constructor(private http: Http, private wishbone: WishboneMachine, private worker: WishboneWorker) {
    }

    private _cheats: GameGenieCode[] = new Array<GameGenieCode>();

    get cheats(): GameGenieCode[] {
        return this._cheats;
    }

    applyCheats(cheats: GameGenieCode[]) {
        this._cheats = cheats;
        const cc = new ChiChiCheats();
        const cpu = this.wishbone.Cpu;
        cpu.genieCodes = cheats.filter((v) => v.active).map((v) => cc.gameGenieCodeToPatch(v.code));
        cpu.cheating =  cpu.genieCodes.length > 0;
        this.worker.setCheats(cpu.genieCodes);
        // this.postNesMessage({ command: 'cheats', cheats: this.Cpu.genieCodes });
    }


    fetchCheats(): Observable<Array<GameGenieCode>> {
        const crc = this.wishbone.Cart.ROMHashFunction;
        const resp = new Subject<Array<GameGenieCode>> ();
        this.http.get('assets/geniecodes.xml').subscribe((response) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.text(), 'text/xml');
            let ggCodes = new Array<GameGenieCode>();
            const nodes = xmlDoc.evaluate('/database/game[@crc="' + crc + '"]/gamegenie', xmlDoc, null, XPathResult.ANY_TYPE, null);
            let result = nodes.iterateNext();
            while (result) {
                const ggCode = {
                    code: (<any>result.attributes).code.value,
                    description:  (<any>result.attributes).description.value,
                    active: false
                };
                ggCodes.push(ggCode);
                result = nodes.iterateNext();
            }

            const lastcheats = this.cheats;
            if (lastcheats) {
               ggCodes = ggCodes.map((ggCode) => {
               const existingCode = lastcheats.find((cheat) => cheat.code === ggCode.code);
                if (existingCode) {
                  ggCode.active = existingCode.active;
                }
                return ggCode;
              });
            }

            resp.next(ggCodes);
        }, (error) => {
                console.log(error);
                resp.next(new Array<GameGenieCode>());
        });
        return resp.asObservable();
    }
}
