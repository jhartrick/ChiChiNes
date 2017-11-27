import { ComponentFactoryResolver, AfterViewInit,  Input, ViewChild, Component, ComponentRef, EventEmitter, Output, ChangeDetectorRef, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { PopoverContent } from './popover.content';
import { ContentChild } from '@angular/core/src/metadata/di';
import { PopoverSegmentComponent } from './popover.segment';

@Component({
    selector: 'chichi-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.css']
})
export class PopoverComponent implements AfterViewInit {
    @Input('button') button: PopoverContent;
    @Input() icon: string;

    @Output()

    @ViewChild(PopoverDirective) popSpot: PopoverDirective;
    @ContentChildren(PopoverSegmentComponent) segments: QueryList<PopoverSegmentComponent>;
    @ViewChildren(PopoverSegmentComponent) viewsegs: QueryList<PopoverSegmentComponent>;

    componentRef: ComponentRef<any>;
    show = false;
    loaded = false;
    floatClass = 'floater';

    floaters: PopoverSegmentComponent[];

    buttonclick = new EventEmitter(true);

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {

    }

    ngAfterViewInit() {
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

    clickHandler(event: any) {
        this.buttonclick.emit(event);

    }

    float(floating: boolean) {
        this.floatClass = floating ? 'floater' : 'hidden';
        this.floaters.forEach((v, i) => {
            if (i > 0) {
                setTimeout(() => {
                    v.cssClass = floating ? 'floater' : 'hidden';
                    v.left = floating ? ((i + 1 ) * 64).toString() + 'px' : '0px';
                }, i * 200);
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
