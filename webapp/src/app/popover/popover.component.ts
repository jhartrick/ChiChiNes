import { ComponentFactoryResolver, AfterViewInit,  Input, ViewChild, Component, ComponentRef, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { PopoverDirective } from "./popover.directive";
import { PopoverContent } from "./popover.content";


@Component({
    selector: 'chichi-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.css']
        })
export class PopoverComponent implements AfterViewInit {
    componentRef: ComponentRef<any>;
    show = false;
    @Input('button') button: PopoverContent;
    @Input() icon: string;

    @Output()
    buttonclick = new EventEmitter(true);

    @ViewChild(PopoverDirective) popSpot: PopoverDirective;
    loaded = false;


    constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) {

    }

    floatClass = 'hidden';

    ngAfterViewInit() {
        if (this.button) {
            this.loadComponent();
            this.cd.detectChanges();
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
