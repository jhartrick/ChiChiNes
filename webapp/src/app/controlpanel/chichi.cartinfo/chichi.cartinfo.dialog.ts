import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, ChangeDetectorRef, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'chichi-cartinfo-dialog',
  templateUrl: './chichi.cartinfo.dialog.html',
  styleUrls: ['./chichi.cartinfo.dialog.css']
})
export class CartInfoDialogComponent implements AfterContentInit {
    wishbone: WishboneMachine;
    info: any;
    constructor(
        public dialogRef: MatDialogRef<CartInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef, 
        private elementRef: ElementRef
    ) {
        this.wishbone = data.wishbone;
        this.info = data.info ? data.info : undefined;

    }

    get cartInfo(): string {
      return  JSON.stringify(this.info);
    }

    apply() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngAfterContentInit(): void {
        // this.elementRef.nativeElement.appendChild(this.info.documentElement)
    }

}
