import { ViewContainerRef, Component, Directive, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'chichi-ui-segment',
  template: `<div class='segment' [@floatAnimation]='cssClass'><ng-content></ng-content></div>`,
  styleUrls: ['./popover.segment.css'],
  // tslint:disable-next-line:use-host-property-decorator

animations: [
  trigger('floatAnimation', [
    state('hidden', style({
      transform: 'translateX(-500%)'
    })),
    state('floater',   style({
      transform: 'translateX(0%)'
    })),
    transition('hidden => floater', animate('800ms ease-in')),
    transition('floater => hidden', animate('200ms ease-out'))
  ])
]
})
export class PopoverSegmentComponent {
  @Input() id: string;
  @Input() width = '0px';
  @Input() left = '0px';
  @Input() cssClass = 'hidden';

  constructor(public viewContainerRef: ViewContainerRef) { }

  floatStart(e: any) {
  }

  floatEnd(e: any) {
  }

}
