import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarEventosPage } from './editar-eventos.page';

const routes: Routes = [
  {
    path: '',
    component: EditarEventosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarEventosPageRoutingModule {}
