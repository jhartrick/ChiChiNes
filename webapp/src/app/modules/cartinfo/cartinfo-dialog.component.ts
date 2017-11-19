import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, ChangeDetectorRef, ElementRef, AfterContentInit } from '@angular/core';
import { setTimeout } from 'timers';
import { ICartSettings } from '../../services/NESService';

@Component({
  selector: 'cartinfo-dialog',
  templateUrl: './cartinfo-dialog.component.html',
  styleUrls: ['./cartinfo-dialog.component.css']
})
export class CartInfoDialogComponent implements AfterContentInit {

    board: any;
    game: any;
    cartridge: any;
    romInfo: ICartSettings;
    cartInfo: any;

    constructor(
        public dialogRef: MatDialogRef<CartInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {
        this.romInfo = data.cart;

        this.cartInfo = data.info;
        if (this.data.info && this.data.info.cartridge) {
            this.cartridge = this.data.info.cartridge;
            if (this.cartridge.board) {
                this.board = this.cartridge.board;
                console.log(JSON.stringify(this.board));
            }
            if (this.cartridge.game) {
                this.game = this.cartridge.game;
            }
        }
    }

    ngAfterContentInit(): void {
        setTimeout(()=> {
        this.cd.detectChanges();
        },0);
    }

    apply() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
