import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { PopoverComponent } from '../components/popover/popover.component';
import { EventosComponent } from '../components/eventos/eventos.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PageHeaderComponent,
    PopoverComponent,
    EventosComponent
  ],
  exports: [
    PageHeaderComponent,
    PopoverComponent,
    EventosComponent
  ]
})
export class ModulesModule { }
