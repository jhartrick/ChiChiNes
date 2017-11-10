import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Emulator } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialog } from '@angular/material';
import { GameGenieDialogComponent } from './chichi.gamegenie.dialog';

import { GameGenieCode } from 'chichi'
import { WishboneCheats } from '../../services/wishbone/wishbone.cheats';
import { Http } from '@angular/http';

@Component({
  selector: 'chichi-gamegenie',
  templateUrl: './chichi.gamegenie.html',
  styleUrls: ['./chichi.gamegenie.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameGenieComponent {
    ggCodes: GameGenieCode[];
    wishbone: WishboneMachine;
    private cheatCodeLoader: WishboneCheats;
    constructor(public nesService: Emulator, private dialog: MatDialog, private http: Http) {
      this.wishbone = nesService.wishbone;
      this.cheatCodeLoader = new WishboneCheats(http);
    }
    
    cheat() {
      // debugger;
      this.cheatCodeLoader.getCheatsForGame(this.wishbone.Cart.ROMHashFunction).subscribe((cheats)=>{
        this.ggCodes = cheats;
        const lastcheats = this.wishbone.cheats;
        if (lastcheats) {
           this.ggCodes = this.ggCodes.map((ggCode) => {
           const existingCode = lastcheats.find((cheat) => cheat.code === ggCode.code);
            if (existingCode) {
              ggCode.active = existingCode.active;
            }
            return ggCode;
          });
        }
        const dialogRef = this.dialog.open(GameGenieDialogComponent, {
            height: '80%',
            width: '60%',
            data: { wishbone: this.wishbone, codes: this.ggCodes }
          });
        dialogRef.afterClosed().subscribe(() => {
            this.wishbone.applyCheats(this.ggCodes);
            console.log(this.ggCodes[0].active);
          });
      });
    }
}
