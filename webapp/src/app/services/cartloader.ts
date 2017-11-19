import { BaseCart } from 'chichi';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as JSZip from 'jszip';
import * as crc from 'crc';
import { Subscriber } from 'rxjs';
import { Emulator } from './NESService';
import { WishboneMachine } from './wishbone/wishbone';
export class RomFile  {
    name?: string;
    data?: number[];
    nsf? = false;
    info?: any;
}

@Injectable()
export class RomLoader {

    constructor(private nes: Emulator, private http: Http) {
        this.wishbone = this.nes.wishbone;
        debugger;    
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

    private loadZipRom(files: FileList): Observable<BaseCart> {
        const file = files[0];
        return new Observable<BaseCart>(observer => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = (e) => {
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                // zip file
                JSZip.loadAsync(rom).then((zip: any) => {
                    zip.forEach((relativePath, zipEntry) => {  // 2) print entries
                        zipEntry.async('blob').then((fileData) => {
                            fileReader.onload = (ze) => {
                                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                                RomLoader.doLoadCart(rom, name ).subscribe((cart)=>{
                                    this.nes.setupCart(cart, rom);
                                    observer.next(cart);
                                })
                            };
                            fileReader.readAsArrayBuffer(fileData);
                        });
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
                 this.loadZipRom(files).subscribe((cart) => {
                     observer.next(cart);
                 });
            } else if (file.name.endsWith('.nes')) {
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e) => {
                    const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                    RomLoader.doLoadCart(rom, name ).subscribe((cart)=>{
                        this.nes.setupCart(cart, rom);
                        observer.next(cart);
                    })

                };
                fileReader.readAsArrayBuffer(file);
                
            } else {
                observer.next(null);
            }
        }); 

    }

    static doLoadCart(rom: number[], name: string): Observable<BaseCart> {
        return new Observable<BaseCart>((subj) => {
            (require as any).ensure(['../../assets/romloader.worker.js'], (require) => {
                const romLoader = require('../../assets/romloader.worker.js');
                const cart = romLoader.loader.loadRom(rom, name);
                subj.next(cart);
                delete romLoader.loader;
                delete require.cache[require.resolve('../../assets/romloader.worker.js')];
            });
        });
    }
}
