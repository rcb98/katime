import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarTransportesPageRoutingModule } from './editar-transportes-routing.module';

import { EditarTransportesPage } from './editar-transportes.page';
import { ModulesModule } from 'src/app/modules/modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarTransportesPageRoutingModule,
    ModulesModule
  ],
  declarations: [EditarTransportesPage]
})
export class EditarTransportesPageModule {}
