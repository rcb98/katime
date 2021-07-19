import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../components/menu/menu.component';
import { RouterModule } from '@angular/router';
import { ModoListaComponent } from './modo-lista/modo-lista.component';
import { ModoDiarioComponent } from './modo-diario/modo-diario.component';
import { HeaderComponent } from '../components/header/header.component';



@NgModule({
  declarations: [
    ModoListaComponent,
    ModoDiarioComponent,
    MenuComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule,
    PagesRoutingModule,

  ]
})
export class PagesModule { }
