import { WishboneMachine } from '../../services/wishbone/wishbone';
import { Component, Inject, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'cartinfo-details',
  templateUrl: 'cartinfo-details.component.html'
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


@Component({
    selector: 'cartinfo-game',
    template: `<table>
        <tr><td>alt name</td><td> {{ game.attributes?.altName }}</td>
        <tr><td>class</td><td> {{ game.attributes?.class }} </td>
        <tr><td>subclass</td><td> {{ game.attributes?.subclass }} </td>
        <tr><td>catalog</td><td> {{ game.attributes?.catalog }} </td>
        <tr><td>publisher</td><td> {{ game.attributes?.publisher }} </td>
        <tr><td>developer</td><td>  {{ game.attributes?.developer }} </td>
        <tr><td>region</td><td>  {{ game.attributes?.region }} </td>
        <tr><td>players</td><td>  {{ game.attributes?.players }} </td>
        <tr><td>date</td><td> {{ game.attributes?.date }} </td>
    </table>
    `
})
export class CartInfoGameComponent {
    @Input('game') game: any;
    constructor() {
    }
}
