import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header/page-header.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PageHeaderComponent
  ],
  exports: [
    PageHeaderComponent
  ]
})
export class ModulesModule { }
