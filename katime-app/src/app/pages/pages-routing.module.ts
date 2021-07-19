import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModoDiarioComponent } from './modo-diario/modo-diario.component';
import { ModoListaComponent } from './modo-lista/modo-lista.component';

/* Pages Modules Routes */
const routes: Routes = [
  {
    path: 'modo-lista',
    component: ModoListaComponent,
  },
  {
    path: 'modo-diario',
    component: ModoDiarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
