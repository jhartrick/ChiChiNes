import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NESService } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialog } from '@angular/material';
import { GameGenieDialogComponent } from './gamegenie.dialog.component';

import { GameGenieCode } from 'chichi'
import { WishboneCheats } from './wishbone.cheats';
import { Http } from '@angular/http';

@Component({
  selector: 'cheating-gamegenie',
  templateUrl: './gamegenie.component.html',
  styleUrls: ['./gamegenie.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameGenieComponent {
    ggCodes: GameGenieCode[];
    constructor(
      public nesService: NESService, 
      private wishbone: WishboneMachine, 
      private cheater: WishboneCheats, 
      private dialog: MatDialog, 
      private http: Http) {
    }

    cheat() {
      let sub =  this.cheater.fetchCheats().subscribe((cheats)=>{
        this.ggCodes = cheats;

        const dialogRef = this.dialog.open(GameGenieDialogComponent, {
            height: '80%',
            width: '60%',
            data: { wishbone: this.wishbone, codes: this.ggCodes }
          });
        dialogRef.afterClosed().subscribe(() => {
            this.cheater.applyCheats(this.ggCodes);
          });
        sub.unsubscribe();
      });
    }
}
