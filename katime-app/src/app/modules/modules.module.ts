import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { PopoverComponent } from '../components/popover/popover.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PageHeaderComponent,
    PopoverComponent,
  ],
  exports: [
    PageHeaderComponent,
    PopoverComponent,
  ]
})
export class ModulesModule { }
