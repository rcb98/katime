import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { PopoverComponent } from '../components/popover/popover.component';
import { EventosComponent } from '../components/eventos/eventos.component';
import { TransportesComponent } from '../components/transportes/transportes.component';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal.component';
import { CategoriaComponent } from '../components/categoria/categoria.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PageHeaderComponent,
    PopoverComponent,
    EventosComponent,
    TransportesComponent,
    ModalComponent,
    CategoriaComponent
  ],
  exports: [
    PageHeaderComponent,
    PopoverComponent,
    EventosComponent,
    TransportesComponent,
    ModalComponent,
    CategoriaComponent
  ]
})
export class ModulesModule { }
