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


    constructor(private http: Http) {}

    wishbone: WishboneMachine;

    loadZipRom(files: FileList): Observable<BaseCart> {
        const file = files[0];
        const romLoader = new Observable<RomFile>(observer => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = (e) => {
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                // zip file
                JSZip.loadAsync(rom).then((zip: any) => {
                    zip.forEach((relativePath, zipEntry) => {  // 2) print entries
                        zipEntry.async('blob').then((fileData) => {
                            fileReader.onload = (ze) => {
                                const zrom: number[] = Array.from(new Uint8Array(fileReader.result));
                                this.deliverRom(observer, zrom, file.name,false);
                            };
                            fileReader.readAsArrayBuffer(fileData);
                        });
                    });
                });

            };
            fileReader.readAsArrayBuffer(file);
        });
        return romLoader;
    }

    loadRom(files: FileList): Observable<BaseCart> {
        const file = files[0];
        if (file.name.endsWith('.zip')) {
            return this.loadZipRom(files);
        } else 
        if (file.name.endsWith('.nsf')) {
            return this.loadNsf(files);
        } else 
        if (file.name.endsWith('.nes')) {
            const romLoader = new Observable<RomFile>(observer => {
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e) => {
                    const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                    this.deliverRom(observer, rom, file.name,false);
                };
                fileReader.readAsArrayBuffer(file);
            });
            return romLoader;
        } else {
            return new Observable<RomFile>(observer => { 
                observer.next({});
            });
        }
    }

    loadNsf(files: FileList): Observable<BaseCart> {
        const file = files[0];
        const romLoader = new Observable<RomFile>(observer => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = (e) => {
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                this.deliverRom(observer, rom, file.name, true);
            };
            fileReader.readAsArrayBuffer(file);
        });
        return romLoader;
    }

    deliverRom(observer: Subscriber<BaseCart>, rom: number[], name: string, isNsf: boolean) {
        const myCrc = crc.crc32(new Buffer(rom.slice(16, rom.length))).toString(16).toUpperCase().padStart(8,'0');
        this.http.get("assets/carts/" + myCrc + ".json").subscribe((resp)=> {
            let cartInfo = resp.json();

            RomLoader.doLoadCart(rom, name, cartInfo ).subscribe((cart)=>{
                this.wishbone.insertCart(cart, rom);
                observer.next(cart);
            })
            
        }, (err) => {
            observer.next(null);            
        });
    }

    static doLoadCart(rom: number[], name: string, cartInfo: any): Observable<BaseCart> {
        return new Observable<BaseCart>((subj) => {
            (require as any).ensure(['../../assets/romloader.worker.js'], (require) => {
                const romLoader = require('../../assets/romloader.worker.js');

                const cart = romLoader.loader.loadRom(rom, name);
                cart.cartInfo = cartInfo;
                
                subj.next(cart);

                delete romLoader.loader;
                delete require.cache[require.resolve('../../assets/romloader.worker.js')];
            });
        });
    }
}
