import { ComponentFactoryResolver, AfterViewInit, Input, ViewChild, Component,
    ComponentRef, EventEmitter, Output, ChangeDetectorRef, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { PopoverContent } from './popover.content';
import { ContentChild } from '@angular/core/src/metadata/di';
import { PopoverSegmentComponent } from './popover.segment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime'
import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
  } from '@angular/animations';

@Component({
    selector: 'chichi-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.css'],
    animations: [
        trigger('hoverAnimation', [
        state('*',   style({
            transform: 'translateX(-32px)'
        })),
        state('hover',   style({
            transform: 'translateX(0%)'
        })),
          transition('* => hover', animate('180ms 2ms ease-in', keyframes ([
              style({ transform: 'translateX(-32px)', offset: 0 }),
              style({ transform: 'translateX(16px)', offset: 0.7 }),
              style({ transform: 'translateX(0%)', offset: 1.0 })
            ])
          )),
          transition('hover => *', animate('200ms 100ms ease-out'))
        ])
      ]
})
export class PopoverComponent implements AfterViewInit {
    @Input('button') button: PopoverContent;
    @Input() icon: string;

   

    @ViewChild(PopoverDirective) popSpot: PopoverDirective;
    @ContentChildren(PopoverSegmentComponent) segments: QueryList<PopoverSegmentComponent>;
    @ViewChildren(PopoverSegmentComponent) viewsegs: QueryList<PopoverSegmentComponent>;
    componentRef: ComponentRef<any>;

    show = false;
    loaded = false;

    hoverState = '';

    floaters: PopoverSegmentComponent[];

    buttonclick = new EventEmitter(true);

    showToolStrip = new EventEmitter<boolean>(true);

    hideToolStrip = new EventEmitter<boolean>(true);

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        this.showToolStrip.debounceTime(10).subscribe((f) => {
            this.float(true);
        });

        this.hideToolStrip.debounceTime(2000).subscribe((f) => {
            this.float(false);
        });

        this.floaters = new Array<PopoverSegmentComponent>();
        this.viewsegs.forEach((seg, index) => {
            this.floaters.push(seg);
        });

        this.segments.forEach((seg, index) => {
            this.floaters.push(seg);
        });

        if (this.button) {
            this.loadComponent();
            this.cd.detectChanges();
        }
    }

    // clickHandler(event: any) {
    //     this.buttonclick.emit(event);
    // }
    float(floating: boolean) {

        this.floaters.forEach((v, i) => {
            if (i > 0) {
                setTimeout(() => {
                    v.cssClass = floating ? 'floater' : 'hidden';
                    v.left = floating ? ((i + 1) * 64).toString() + 'px' : '0px';
                }, i * 150);
            } else {
                v.cssClass = 'floater';
                v.left = '0px';
            }
        });
    }

    loadComponent() {
        if (!this.loaded && this.button) {
            const viewContainerRef = this.popSpot.viewContainerRef;
            viewContainerRef.clear();
            const popover = this.button;
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(popover.component);
            this.componentRef = viewContainerRef.createComponent(componentFactory);
            (this.componentRef.instance).data = popover.data;
            this.loaded = true;
        }
    }

}
