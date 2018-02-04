import { Component, ChangeDetectionStrategy } from '@angular/core';
import {  loadCartFromUrl, loadCartFromFile } from '../chichi/wishbone/filehandler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  paused: boolean = false;
  cart: any;
  title = 'app';
  url='assets/metroid.nes';
  mute = false;

  constructor() {

  }
  
  load() {
    loadCartFromUrl(this.url).then(cart => this.cart = cart);
  }

  loadfile(e: Event) {
    loadCartFromFile((<HTMLInputElement>e.target).files[0]).then(cart => this.cart = cart);
  }
}
