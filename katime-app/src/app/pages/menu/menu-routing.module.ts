import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  // Para que cargue el Modo Lista como pantalla inicial
  {
    path: '',
    redirectTo: 'modo-lista',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'modo-lista',
        loadChildren: () => import('../modo-lista/modo-lista.module').then(m => m.ModoListaPageModule)
      },
      {
        path: 'modo-diario',
        loadChildren: () => import('../modo-diario/modo-diario.module').then(m => m.ModoDiarioPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
