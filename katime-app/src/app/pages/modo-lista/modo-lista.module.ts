import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModoListaPageRoutingModule } from './modo-lista-routing.module';

import { ModoListaPage } from './modo-lista.page';
import { ModulesModule } from 'src/app/modules/modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModoListaPageRoutingModule,
    ModulesModule
  ],
  declarations: [ModoListaPage]
})
export class ModoListaPageModule {}
