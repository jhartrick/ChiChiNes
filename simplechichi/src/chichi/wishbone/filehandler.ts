import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { BaseCart, iNESFileHandler } from 'chichi';
import * as JSZip from 'jszip';
import * as crc from 'crc';

const loadFile = (filedata: File) => {
    const reader: FileReader = new FileReader();
    const promise = new Promise<BaseCart>((resolve, reject)=>{ 
        reader.onload = (ze) => {
            const ab = reader.result;
            resolve(iNESFileHandler(ab));
        };
    });
    reader.readAsArrayBuffer(filedata);
    return promise;
} 

const loadNesFile = async (filedata: File, name: string) => {
    const reader: FileReader = new FileReader();
    return await loadFile(filedata);
};

const blobToFile = (theBlob: Blob, fileName:string): File => {
    Object.assign(theBlob, { lastModifiedDate: new Date, name: fileName });
    return <File>theBlob;
}

const loadZipFile = async (file: File) => {
    const fileReader: FileReader = new FileReader();
    const name = file.name;
    return new Promise<BaseCart>((r,x) => { 

        fileReader.onload = (e) => {
            (async ()=>{
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                // zip file
                const zip = await JSZip.loadAsync(rom);
                const list = zip.filter((relativePath, zipEntry) => zipEntry.name.endsWith('.nes'));
                if (list.length > 0) {
                    const zipEntry = list[0];
                    const blob = await zipEntry.async('blob');
                    r(await loadFile(blobToFile(blob, zipEntry.name)));
                } else {
                    x('no nes file found in zip.')
                }
            })();
        }
        fileReader.readAsArrayBuffer(file);
    })
};

export const loadCartFromFile = async (file: File) => {
    let cart: BaseCart = undefined;
    return (async () => {
        try {
            if (file.name.endsWith('.zip')) {
                cart = await loadZipFile(file);
           } else if (file.name.endsWith('.nes')) {
                cart = await loadNesFile(file, file.name);
           } else {
               throw new Error(`invalid file type ${file.name}`);
           }
        } catch (e) {
            console.log(e);
        }
        return cart;
    })();
}

export const loadCartFromUrl = async (url: string)=> {
    return (async () => {
        const response = await fetch(url);
        return loadFile(blobToFile(await response.blob(), url));
    })();
};
