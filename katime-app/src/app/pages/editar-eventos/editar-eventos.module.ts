import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarEventosPageRoutingModule } from './editar-eventos-routing.module';

import { EditarEventosPage } from './editar-eventos.page';
import { ModulesModule } from 'src/app/modules/modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarEventosPageRoutingModule,
    ModulesModule
  ],
  declarations: [EditarEventosPage]
})
export class EditarEventosPageModule {}
