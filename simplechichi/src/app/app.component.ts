import { Component } from '@angular/core';
import { loadCartFromFileList, loadCartFromUrl } from '../chichi/wishbone/filehandler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cart: any;
  title = 'app';
  url='assets/metroid.nes';
  

  constructor() {

  }
  
  load() {
    loadCartFromUrl(this.url).subscribe(cart => this.cart = cart);
  }


  loadfile(e: Event) {
      loadCartFromFileList((<HTMLInputElement>e.target).files).subscribe(cart => this.cart = cart);
  }
}
