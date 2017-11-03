import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Emulator } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialog } from '@angular/material';
import { GameGenieDialogComponent } from './chichi.gamegenie.dialog';

import { GameGenieCode, ChiChiCheats } from 'chichi'

@Component({
  selector: 'chichi-gamegenie',
  templateUrl: './chichi.gamegenie.html',
  styleUrls: ['./chichi.gamegenie.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameGenieComponent {
    ggCodes: GameGenieCode[];
    wishbone: WishboneMachine;
    constructor(public nesService: Emulator, private dialog: MatDialog ) {
      this.wishbone = nesService.wishbone;
    }

    cheat() {
      this.ggCodes = this.wishbone.cheats;
      const dialogRef = this.dialog.open(GameGenieDialogComponent, {
          height: '80%',
          width: '60%',
          data: { wishbone: this.wishbone, codes: this.ggCodes }
        });
      dialogRef.afterClosed().subscribe(() => {
          this.wishbone.applyCheats(this.ggCodes);
          console.log(this.ggCodes[0].active);
        });
    }
}
