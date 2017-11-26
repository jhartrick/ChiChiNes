import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[chichi-segment]',
})
export class PopoverDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}