import { ViewContainerRef, Component, Directive, Input } from '@angular/core';

@Component({
  selector: 'chichi-ui-segment',
  template: `<div [ngClass]='cssClass'><ng-content></ng-content></div>`,
  styleUrls:['./popover.segment.css']
})
export class PopoverSegmentComponent {
  @Input() id: string;
  @Input() width: string = '0px';
  @Input() left: string = '0px';
  @Input() cssClass: string = '';
  constructor(public viewContainerRef: ViewContainerRef) { }
}