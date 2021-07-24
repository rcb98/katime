import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { PopoverComponent } from '../components/popover/popover.component';
import { PopoverRadioComponent } from '../components/popover-radio/popover-radio.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PageHeaderComponent,
    PopoverComponent,
    PopoverRadioComponent
  ],
  exports: [
    PageHeaderComponent,
    PopoverComponent,
    PopoverRadioComponent
  ]
})
export class ModulesModule { }
