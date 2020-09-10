import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameboyComponent } from './components/gameboy/gameboy.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'game',
    component: GameboyComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
