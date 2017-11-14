import { Component } from '@angular/core';

@Component({
    selector: 'chihi-progress',
    template: `<h4>Rom Load In Progress</h4>
    <mat-progress-spinner [mode]='indeterminate'></mat-progress-spinner>
    `
})
export class ProgressComponent {
    constructor() {
    }
}
