import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'crear-evento',
    loadChildren: () => import('./pages/crear-evento/crear-evento.module').then( m => m.CrearEventoPageModule)
  },  {
    path: 'crear-transporte',
    loadChildren: () => import('./pages/crear-transporte/crear-transporte.module').then( m => m.CrearTransportePageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
