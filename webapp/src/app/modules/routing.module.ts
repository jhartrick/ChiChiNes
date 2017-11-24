import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DebugLayoutComponent} from '../layouts/debuglayout.component';
import {PlayLayoutComponent} from '../layouts/playlayout.component';

const appRoutes: Routes = [
    { path: 'play', component: PlayLayoutComponent },
    { path: 'debug', component: DebugLayoutComponent },
    { path: '',
      redirectTo: '/play',
      pathMatch: 'full'
    },
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {}
