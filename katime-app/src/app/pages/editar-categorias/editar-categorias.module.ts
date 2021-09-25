import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarCategoriasPageRoutingModule } from './editar-categorias-routing.module';

import { EditarCategoriasPage } from './editar-categorias.page';
import { ModulesModule } from 'src/app/modules/modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarCategoriasPageRoutingModule,
    ModulesModule
  ],
  declarations: [EditarCategoriasPage]
})
export class EditarCategoriasPageModule {}
