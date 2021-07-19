import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModoDiarioPageRoutingModule } from './modo-diario-routing.module';

import { ModoDiarioPage } from './modo-diario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModoDiarioPageRoutingModule
  ],
  declarations: [ModoDiarioPage]
})
export class ModoDiarioPageModule {}
