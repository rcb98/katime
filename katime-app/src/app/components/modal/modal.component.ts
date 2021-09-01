import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() detalle: Entrada;
  @Input() accion: string;
  @Input() tipo: string;
  @Input() categoria: string;
  @Input() tiempoRestante: string;

  constructor(private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private modalController: ModalController,
              private toaster: ToastController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  async eliminarEvento() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': 'eliminar',
        'tipo': 'evento',
        'detalle': this.detalle
      }
    });
    return await modal.present();
  }

  async presentToast(msg:string) {
    const toast = await this.toaster.create({
      message: msg,
      duration: 3000,
      animated: true,
      color: "primary"
    });
    toast.present();
  }

  deleteEntrada(id:number) {
    this.entradaService.deleteEntrada(id).then((res) => {
        this.dismiss();
        this.presentToast(`Evento de '${this.detalle.nombre}' eliminado.`);
    })
  }

  deleteEntradas(id:number) {
    this.entradaService.deleteEntradas(id).then(() => {
      this.fuenteService.deleteFuente(id).then(() => {
        this.dismiss();
        this.presentToast(`Eventos de '${this.detalle.nombre}' eliminados.`);
      })
    })
  }

}
