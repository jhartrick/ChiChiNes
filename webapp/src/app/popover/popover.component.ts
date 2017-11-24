import { ComponentFactoryResolver, AfterViewInit,  Input, ViewChild, Component, ComponentRef } from "@angular/core";
import { PopoverDirective } from "./popover.directive";
import { PopoverContent } from "./popover.content";
import { EILSEQ } from "constants";


@Component({
    selector: 'chichi-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.css']
        })
export class PopoverComponent implements AfterViewInit {
    componentRef: ComponentRef<any>;
    show = false;

    @Input() popover: PopoverContent;
    @Input() icon: string;
    @ViewChild(PopoverDirective) popSpot: PopoverDirective;
    loaded = false;
  
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { 

    }

    floatClass = 'hidden';
    ngAfterViewInit() {
       //this.loadComponent();
    }

    clickHandler(event: any) {
        if (this.componentRef.instance.onclick) {
            this.componentRef.instance.onclick();
        } else if (this.popover.data.onclick) {
            this.popover.data.onclick();
        }
    }

    loadComponent() {
        if (!this.loaded) {
            let viewContainerRef = this.popSpot.viewContainerRef;
            viewContainerRef.clear();
            let popover = this.popover;
            let componentFactory = this.componentFactoryResolver.resolveComponentFactory(popover.component);
            this.componentRef = viewContainerRef.createComponent(componentFactory);
            (this.componentRef.instance).data = popover.data;
            this.loaded = true;
        }
    }
  

  }