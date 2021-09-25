import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarCategoriasPage } from './editar-categorias.page';

const routes: Routes = [
  {
    path: '',
    component: EditarCategoriasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarCategoriasPageRoutingModule {}
