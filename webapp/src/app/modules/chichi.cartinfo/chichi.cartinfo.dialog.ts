import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, ChangeDetectorRef, ElementRef, AfterContentInit } from '@angular/core';

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
        private cd: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {
        this.wishbone = data.wishbone;
        this.cartInfo = data.info;
        debugger;
    }

    apply() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
