import { WishboneMachine } from '../../services/wishbone/wishbone';
import { Component, Inject, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'cartinfo-details',
  templateUrl: 'chichi.cartinfo.details.html'
})
export class CartInfoDetailsComponent {
    @Input('cart') cart: any;
    constructor() {
    }
}

@Component({
    selector: 'cartinfo-board',
    template: `<div *ngIf="board">
            <p>Type: {{ board.attributes?.type }}</p>
            <p>Pcb: {{ board.attributes?.pcb }}</p>
            <p>Mapper: {{ board.attributes?.mapper }}</p>
        </div>
        <cartinfo-board-rom *ngFor="let prg of board.prg" [rom]='prg' [heading]='"Prg Rom"' ></cartinfo-board-rom>
        <cartinfo-board-rom *ngFor="let chr of board.chr" [rom]='chr' [heading]='"Chr Rom"'></cartinfo-board-rom>
        <cartinfo-board-pad *ngFor="let pad of board.pad" [pad]='pad' [heading]='"Solder Pads"'></cartinfo-board-pad>
    `
})
export class CartInfoBoardComponent {
    @Input('board') board: any;
    constructor() {
    }
}
@Component({
    selector: 'cartinfo-board-rom',
    template: `<div *ngIf='rom'>
    <h4>{{heading}}</h4>
    <p>Name: {{ rom.attributes?.name }}</p>
    <p>Size: {{ rom.attributes?.size }}</p>
    <p>Crc: {{ rom.attributes?.crc }}</p>
    </div>
    `
})
export class CartInfoPrgComponent {
    @Input('rom') rom: any;
    @Input('heading') heading: string;
    constructor() {
    }
}

@Component({
    selector: 'cartinfo-board-pad',
    template: `<div *ngIf='pad'>
    <h4>{{heading}}</h4>
    <p>Vert: {{ pad.attributes?.v }}</p>
    <p>Horz: {{ pad.attributes?.h }}</p>
    </div>
    `
})
export class CartInfoPadComponent {
    @Input('pad') pad: any;
    @Input('heading') heading: string;
    constructor() {
    }
}
