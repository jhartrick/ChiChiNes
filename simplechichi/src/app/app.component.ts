import { Component, ChangeDetectionStrategy } from '@angular/core';
import { loadCartFromFileList, loadCartFromUrl } from '../chichi/wishbone/filehandler';

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
  mute: false;

  constructor() {

  }
  
  pause() {
    this.paused = !this.paused;
  }

  load() {
    loadCartFromUrl(this.url).subscribe(cart => this.cart = cart);
  }


  loadfile(e: Event) {
      loadCartFromFileList((<HTMLInputElement>e.target).files).subscribe(cart => this.cart = cart);
  }
}
