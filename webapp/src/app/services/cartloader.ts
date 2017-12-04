import { BaseCart } from 'chichi';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as JSZip from 'jszip';
import * as crc from 'crc';
import { Subscriber } from 'rxjs';
import { NESService } from './NESService';
import { WishboneMachine } from './wishbone/wishbone';
export class RomFile  {
    name?: string;
    data?: number[];
    nsf? = false;
    info?: any;
}

@Injectable()
export class RomLoader {

    constructor(private nes: NESService, private http: Http) {
        this.wishbone = this.nes.wishbone;
 
    }

    wishbone: WishboneMachine;

    getCartInfo(): Observable<any> {
        return new Observable<any>((subject)=> {
            const myCrc =  this.wishbone.Cart.ROMHashFunction;
            this.http.get("assets/carts/" + myCrc + ".json").subscribe((resp)=> {
                let cartInfo = resp.json();
                subject.next(cartInfo);
            }, (err) => {
                subject.next({ error: 'not found.' });
            });
        });
    }

    private doRead(filedata: File, name: string) : Observable<BaseCart> {
        console.log('loading file ' + name);
        const obs = new Observable<BaseCart>((observer) => {
            const reader: FileReader = new FileReader();
            reader.onload = (ze) => {
                const rom = reader.result;
                RomLoader.doLoadCart(rom, name ).subscribe((cart)=>{
                    this.nes.setupCart(cart, rom);
                    observer.next(cart);
                })
            };
            reader.readAsArrayBuffer(filedata);
        });
        return obs;
    }

    private loadZipRom(file: File): Observable<BaseCart> {
        return new Observable<BaseCart>(observer => {
            const fileReader: FileReader = new FileReader();
            let name = file.name;
            fileReader.onload = (e) => {
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                // zip file
                JSZip.loadAsync(rom).then((zip: any) => {
                    zip.forEach((relativePath, zipEntry) => {  // 2) print entries
                        if (zipEntry.name.endsWith('.nes')) {
                            zipEntry.async('blob').then((fileData) => {
                                this.doRead(fileData, zipEntry.name).subscribe((cart) => observer.next(cart));
                            });
                        }
                    });
                });

            };
            fileReader.readAsArrayBuffer(file);
        });
    }

    loadRom(files: FileList): Observable<BaseCart> {
        return new Observable<BaseCart>(observer => {
            const file = files[0];
            if (file.name.endsWith('.zip')) {
                 this.loadZipRom(file).subscribe((cart) => {
                     observer.next(cart);
                 });
            } else if (file.name.endsWith('.nes')) {
                this.doRead(file, file.name).subscribe((cart) => observer.next(cart));
            } else {
                observer.error('invalid file type')
            }
        }); 

    }

    static doLoadCart(rom: ArrayBuffer, name: string): Observable<BaseCart> {
        return new Observable<BaseCart>((subj) => {
            (require as any).ensure(['../../assets/romloader.worker.js'], (require) => {
                const romLoader = require('../../assets/romloader.worker.js');
                const cart = romLoader.loader.loadRom(rom, name);
                cart.CartName = name;
                subj.next(cart);
                delete romLoader.loader;
                delete require.cache[require.resolve('../../assets/romloader.worker.js')];
            });
        });
    }
}
