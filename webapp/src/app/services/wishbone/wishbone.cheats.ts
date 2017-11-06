import { GameGenieCode } from 'chichi';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

export class WishboneCheats {
    constructor(private http: Http){
        
    }
    getCheatsForGame(crc: string) : Observable<Array<GameGenieCode>> {
        let resp = new Subject<Array<GameGenieCode>> ();
        
        this.http.get('assets/geniecodes.xml').subscribe((response)=>{

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.text(), 'text/xml');
                const ggCodes = new Array<GameGenieCode>();
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
                resp.next(ggCodes);
            },(error)=>{
                console.log(error);
                resp.next(new Array<GameGenieCode>());
            }
        );
        return resp.asObservable();
    }
}
