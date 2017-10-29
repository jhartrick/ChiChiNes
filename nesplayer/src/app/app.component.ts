import { Component } from '@angular/core';
import { ChiChiNsfMachine } from 'chichi'
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private machine: ChiChiNsfMachine) {
        var machine = new ChiChiNsfMachine();
    }

    handleFile(e: Event) {
        const files: FileList = (<HTMLInputElement>e.target).files;
        this.loadNsf(files).subscribe((rom) => {
            this.machine.LoadNsf(rom.data);
        });
    }

    loadNsf(files: FileList): Observable<any> {
        const file = files[0];
        const romLoader = new Observable<any>(observer => {
            const fileReader: FileReader = new FileReader();
            fileReader.onload = (e) => {
                const rom: number[] = Array.from(new Uint8Array(fileReader.result));
                observer.next({ name: file.name, data: rom, nsf: true });
            };
            fileReader.readAsArrayBuffer(file);
        });
        return romLoader;
    }

    title = 'app';
}
