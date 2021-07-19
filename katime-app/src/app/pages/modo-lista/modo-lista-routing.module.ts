import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModoListaPage } from './modo-lista.page';

const routes: Routes = [
  {
    path: '',
    component: ModoListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModoListaPageRoutingModule {}
