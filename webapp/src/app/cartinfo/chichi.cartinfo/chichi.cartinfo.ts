import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { Emulator } from '../../services/NESService';
import { MatDialog } from '@angular/material';
import { CartInfoDialogComponent } from './chichi.cartinfo.dialog';
import { Http } from '@angular/http';


@Component({
  selector: 'chichi-cartinfo',
  templateUrl: './chichi.cartinfo.html',
  styleUrls: ['./chichi.cartinfo.css']
})
export class CartInfoComponent {
    wishbone: WishboneMachine;
    constructor(private nesService: Emulator, private dialog: MatDialog, private http: Http) {
        this.wishbone = nesService.wishbone;
    }

    makeCartInfo(xmlDoc: Document): any {
        let child = xmlDoc.firstElementChild;
        let x: any =         {
            crc: (<any>child.attributes).crc.value,
            sha1: (<any>child.attributes).sha1.value,
            system: (<any>child.attributes).system.value,
            dumper: (<any>child.attributes).dumper.value,
            datedumped: (<any>child.attributes).datedumped.value
        };

        const board = xmlDoc.getElementsByTagName('board')[0];
        const prg = board.getElementsByTagName('prg')[0];
        const chr = board.getElementsByTagName('chr')[0];
        const pad = board.getElementsByTagName('pad')[0];
        x.board = {
            type:  (<any>board.attributes).type.value,
            mapper:  (<any>board.attributes).mapper.value,
            pcb:  (<any>board.attributes).pcb.value,
            prg : prg ? {
                size: (<any>prg.attributes).size.value
            } : { size : 0 },
            chr : chr ? {
                size: (<any>chr.attributes).size.value
            } : { size: 0 },
            pad : pad ? {
                h: (<any>pad.attributes).h.value,
                v: (<any>pad.attributes).v.value
            } : { h: 0, v: 0 } 
            
        }
        return x;

    }

    showDialog () {
        let crc = this.nesService.wishbone.Cart.ROMHashFunction;
        this.http.get('assets/carts/' + crc + '.json').subscribe((response) => {
            const parser = new DOMParser();
            const info = response.json();
           // let info = this.makeCartInfo(xmlDoc);
            const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                height: '80%',
                width: '60%',
                data: { wishbone:  this.wishbone, info: info }
            });
        }, (err) => {
            const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                height: '80%',
                width: '60%',
                data: { wishbone:  this.wishbone, info: null }
            });
            
        });
    }
}
