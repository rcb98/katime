import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {

  @Input() titulo:string = '';
  @Input() goBack:boolean = false;

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover_setting',
      event: ev,
      translucent: true,
      componentProps: {
        'titulos': ['Editar transportes', 'Editar eventos', 'Editar categorías', 'Actualizar horarios', 'Eliminar horarios']
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

}
