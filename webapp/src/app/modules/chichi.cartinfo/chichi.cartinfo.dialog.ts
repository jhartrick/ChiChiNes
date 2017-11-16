import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, ChangeDetectorRef, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'chichi-cartinfo-dialog',
  templateUrl: './chichi.cartinfo.dialog.html',
  styleUrls: ['./chichi.cartinfo.dialog.css']
})
export class CartInfoDialogComponent {
    board: any;
    game: any;
    cartridge: any;
    wishbone: WishboneMachine;
    cartInfo: any;
    
    constructor(
        public dialogRef: MatDialogRef<CartInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {
        this.wishbone = data.wishbone;
        this.cartInfo = data.info;
        if (this.data.info && this.data.info.cartridge) {
            this.cartridge = this.data.info.cartridge;
            if (this.cartridge.board) {
                this.board = this.cartridge.board;
            }
            if (this.cartridge.game) {
                this.game = this.cartridge.game;
            }
        }
        debugger;
    }

    apply() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
