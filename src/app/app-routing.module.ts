import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameboyComponent } from './components/gameboy/gameboy.component';

const routes: Routes = [
  {
    path: '**',
    component: GameboyComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
