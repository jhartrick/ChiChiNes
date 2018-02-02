import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { BaseCart, iNESFileHandler } from 'chichi';
import * as JSZip from 'jszip';
import * as crc from 'crc';

const loadNesFile = (filedata: File, name: string): Observable<BaseCart> => {
    console.log('loading file ' + name);
    const obs = new Observable<BaseCart>((observer) => {
        const reader: FileReader = new FileReader();
        reader.onload = (ze) => {
            const rom = reader.result;
            observer.next(iNESFileHandler(rom));
        };
        reader.readAsArrayBuffer(filedata);
    });
    return obs;
};

const loadZipFile = (file: File): Observable<BaseCart> => {
    return new Observable<BaseCart>(observer => {
        const fileReader: FileReader = new FileReader();
        const name = file.name;
        fileReader.onload = (e) => {
            const rom: number[] = Array.from(new Uint8Array(fileReader.result));
            // zip file
            JSZip.loadAsync(rom).then((zip: any) => {
                zip.forEach((relativePath, zipEntry) => {  // 2) print entries
                    if (zipEntry.name.endsWith('.nes')) {
                        zipEntry.async('blob').then((fileData) => {
                            loadNesFile(fileData, zipEntry.name).subscribe((cart) => observer.next(cart));
                        });
                    }
                });
            });

        };
        fileReader.readAsArrayBuffer(file);
    });
};

export const loadUrl = (url: string): any => {
    return Observable.fromPromise(
        fetch(url).then( (response) => {
            return response.arrayBuffer();
        }).then((buffer) => {
            return iNESFileHandler(buffer);
        })
    );
};

export const loadRom = (files: FileList): Observable<BaseCart> => {
    return new Observable<BaseCart>(observer => {
        const file = files[0];
        if (file.name.endsWith('.zip')) {
             loadZipFile(file).subscribe((cart) => {
                 observer.next(cart);
             });
        } else if (file.name.endsWith('.nes')) {
            loadNesFile(file, file.name).subscribe((cart) => observer.next(cart));
        } else {
            observer.error('invalid file type')
        }
    });
}
