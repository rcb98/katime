import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModoDiarioPageRoutingModule } from './modo-diario-routing.module';

import { ModoDiarioPage } from './modo-diario.page';
import { ModulesModule } from 'src/app/modules/modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModoDiarioPageRoutingModule,
    ModulesModule
  ],
  declarations: [ModoDiarioPage]
})
export class ModoDiarioPageModule {}
