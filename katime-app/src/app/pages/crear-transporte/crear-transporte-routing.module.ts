import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearTransportePage } from './crear-transporte.page';

const routes: Routes = [
  {
    path: '',
    component: CrearTransportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearTransportePageRoutingModule {}
