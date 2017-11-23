import { Component } from "@angular/core";
import { RomLoader } from "../services/cartloader";

@Component({
    selector: 'controlpanel-cartloader',
    templateUrl: './cartloader.component.html',
    })
    export class CartLoaderComponent {
        
        constructor(private romloader: RomLoader) {
            
        }

        handleFile(e: Event) {
            const files: FileList = (<HTMLInputElement>e.target).files;
            this.romloader.loadRom(files).subscribe((rom) => {
                // TODO: emit toast for loaded file
            }, (error) => {
                console.log('handleFile error %s', error);
            });
        }
    }
