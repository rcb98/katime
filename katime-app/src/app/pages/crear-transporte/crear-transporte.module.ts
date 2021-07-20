import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearTransportePageRoutingModule } from './crear-transporte-routing.module';

import { CrearTransportePage } from './crear-transporte.page';
import { ModulesModule } from 'src/app/modules/modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTransportePageRoutingModule,
    ModulesModule
  ],
  declarations: [CrearTransportePage]
})
export class CrearTransportePageModule {}
