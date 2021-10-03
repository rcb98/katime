import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarTransportesPage } from './editar-transportes.page';

const routes: Routes = [
  {
    path: '',
    component: EditarTransportesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarTransportesPageRoutingModule {}
