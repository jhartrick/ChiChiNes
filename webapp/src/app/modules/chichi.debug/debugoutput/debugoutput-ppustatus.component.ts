import { Component, Input } from '@angular/core';

@Component({
    selector: 'debug-ppustatus',
    template: `<span>X: {{ ppuStatus?.X }} Y: {{ ppuStatus?.Y }} Name Table: {{ ppuStatus?.nameTableStart }} Tile: {{ ppuStatus?.currentTile }} Status: {{ ppuStatus?.status }} </span>
    <p>locked hscroll: {{ ppuStatus?.lockedHScroll }} locked vscroll: {{ ppuStatus?.lockedVScroll }}</p>`
})
export class PpuStatusComponent {
    @Input('ppuStatus') ppuStatus: any;
}

