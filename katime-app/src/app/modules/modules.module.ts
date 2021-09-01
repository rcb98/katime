import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { PopoverComponent } from '../components/popover/popover.component';
import { EventosComponent } from '../components/eventos/eventos.component';
import { TransportesComponent } from '../components/transportes/transportes.component';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    PageHeaderComponent,
    PopoverComponent,
    EventosComponent,
    TransportesComponent,
    ModalComponent
  ],
  exports: [
    PageHeaderComponent,
    PopoverComponent,
    EventosComponent,
    TransportesComponent,
    ModalComponent
  ]
})
export class ModulesModule { }
