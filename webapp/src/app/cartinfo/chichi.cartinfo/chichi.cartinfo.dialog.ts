import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'chichi-cartinfo-dialog',
  templateUrl: './chichi.cartinfo.dialog.html',
  styleUrls: ['./chichi.cartinfo.dialog.css']
})
export class CartInfoDialogComponent {
    wishbone: WishboneMachine;
    cartInfo: any;

    constructor(
        public dialogRef: MatDialogRef<CartInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef
    ) {
        this.wishbone = data.wishbone;
        this.cartInfo = data.wishbone.Cart.cartInfo;
    }

    apply() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
