import { ViewContainerRef, Component, Directive, Input } from '@angular/core';

@Directive({
  selector: 'chichi-ui-segment'
  
})
export class PopoverSegmentComponent {
  @Input() id: string;
  constructor(public viewContainerRef: ViewContainerRef) { }
}