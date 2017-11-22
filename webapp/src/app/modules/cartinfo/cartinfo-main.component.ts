import { Component, Input } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { CartInfoDialogComponent } from './cartinfo-dialog.component';
import { Http } from '@angular/http';
import { RomLoader } from '../../services/cartloader';
import { ICartSettings } from '../../services/ICartSettings';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'cartinfo-main',
  templateUrl: './cartinfo-main.component.html',
  styleUrls: ['./cartinfo-main.component.css']
})
export class CartInfoComponent {
    @Input('cartSettings') cartSettings: ICartSettings;

    constructor(private loader: RomLoader, private dialog: MatDialog, private http: Http, public matIconRegistry: MatIconRegistry) {

    }
    
    showDialog () {
        this.loader.getCartInfo().subscribe((info) => {
            const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                height: '80%',
                width: '60%',
                data: { cart: this.cartSettings, info: info }
            });
        }, (err) => {
            console.log('cart info fail');
        });
    }
}
