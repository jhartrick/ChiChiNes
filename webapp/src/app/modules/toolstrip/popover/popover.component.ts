import { ComponentFactoryResolver, AfterViewInit,  Input, ViewChild, Component, ComponentRef, EventEmitter, Output, ChangeDetectorRef, ContentChildren, QueryList, ViewChildren } from "@angular/core";
import { PopoverDirective } from "./popover.directive";
import { PopoverContent } from "./popover.content";
import { ContentChild } from "@angular/core/src/metadata/di";
import { PopoverSegmentComponent } from "./popover.segment";


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
    floatClass = 'hidden';
    

    buttonclick = new EventEmitter(true);
    
    constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {
        
    }


    ngAfterViewInit() {
        if (this.button) {
            this.loadComponent();
            this.cd.detectChanges();
            console.log("segments " + this.segments.length)
            console.log("vsegments " + this.viewsegs.length)
        }
    }

    clickHandler(event: any) {
        this.buttonclick.emit(event);

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
