import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModoDiarioPageRoutingModule } from './modo-diario-routing.module';

import { ModoDiarioPage } from './modo-diario.page';
import { ModulesModule } from 'src/app/modules/modules.module';
import { NgCalendarModule } from 'ionic2-calendar';

import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es';
registerLocaleData(localEs);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModoDiarioPageRoutingModule,
    ModulesModule,
    NgCalendarModule
  ],
  declarations: [ModoDiarioPage],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES'}
  ]
})
export class ModoDiarioPageModule {}
