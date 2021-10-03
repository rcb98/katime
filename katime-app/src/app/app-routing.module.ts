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
  },
  {
    path: 'crear-transporte',
    loadChildren: () => import('./pages/crear-transporte/crear-transporte.module').then( m => m.CrearTransportePageModule)
  },
  {
    path: 'editar-categorias',
    loadChildren: () => import('./pages/editar-categorias/editar-categorias.module').then( m => m.EditarCategoriasPageModule)
  },
  {
    path: 'editar-evento/:id',
    loadChildren: () => import('./pages/crear-evento/crear-evento.module').then( m => m.CrearEventoPageModule)
  },
  {
    path: 'editar-transporte/:id',
    loadChildren: () => import('./pages/crear-transporte/crear-transporte.module').then( m => m.CrearTransportePageModule)
  },  {
    path: 'editar-eventos',
    loadChildren: () => import('./pages/editar-eventos/editar-eventos.module').then( m => m.EditarEventosPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
