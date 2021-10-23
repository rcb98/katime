import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, AfterViewInit {

  @Input() detalle: Entrada;
  @Input() accion: string;
  @Input() tipo: string;
  @Input() categoria: string;
  @Input() tiempoRestante: string;
  @Input() titulos: string[];
  @Input() titulo: string;
  @Input() diasSeleccionados: any;
  @Input() valores: any[];
  @Input() valor: any;
  @Input() actual: any;
  @Input() selected: any;
  public checkCustom:boolean = false;
  public checkedOption:any;
  public dias:string[] = [];
  public keepDias:any;
  public diasRep:string;
  public repeticion:string;

  constructor(private comunicadorService: ComunicadorService,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private popoverController: PopoverController,
              private router: Router,
              private toaster: ToastController) { }

  ngOnInit() {
    if(this.detalle) {
      this.fuenteService.getFuenteId(this.detalle.id_fuente, this.tipo).then(res => {
        this.repeticion = res.repeticion;
        this.diasRep = res.dias;
      })
    }

    if(this.selected == "personalizado") {
      this.checkCustom = true;
      this.checkedOption = this.selected;
    }

    var dias = this.diasSeleccionados.split(',');
    dias.forEach(dia => {
      if(dia != "") this.toggleDia(dia);
    });
  }

  ngAfterViewInit() {
    if(this.accion == "detalleTransporte"){
      document.getElementById(this.actual).style.color = "#9889C2";
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  checkValue(event) {
    this.checkedOption = event.detail.value;
    if(this.checkedOption == "personalizado") this.checkCustom = true;
    else this.checkCustom = false;
  }

  toggleDia(dia:string) {
    if(!this.checkDia(dia)) {
      this.dias.push(dia);
    } else {
      this.dias.forEach((d, index) => {
        if(dia == d) this.dias.splice(index, 1);
      });
    }
  }

  checkDia(dia:string) {
    if(this.dias.includes(dia)) return true;
    return false;
  }

  terminar() {
    if(this.checkedOption == "personalizado" && this.dias.length <= 0) return this.presentToast("Tienes que seleccionar al menos un día.")

    if(this.checkedOption == undefined && this.accion == "repeticion") this.checkedOption = null;
    else if(this.checkedOption == undefined && this.accion == "recordatorio") this.checkedOption = 0;

    this.dismiss();

    this.comunicadorService.ejecutarFuncion(this.checkedOption);
    if((this.checkedOption == "personalizado" || this.accion == "recordatorio") && this.dias.length > 0) {
      this.comunicadorService.ejecutarFuncion("#" + this.dias.toString());
    }
  }

  async presentPopoverEvento(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover_setting',
      event: ev,
      translucent: true,
      componentProps: {
        'titulos': ['Editar evento', 'Eliminar evento'],
        // 'titulos': ['Editar evento', 'Eliminar evento', 'Editar categoría'],
        'valor': this.categoria,
        'detalle': this.detalle
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async presentPopoverTransporte(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover_setting',
      event: ev,
      translucent: true,
      componentProps: {
        'titulos': ['Editar transporte', 'Eliminar transporte'],
        'detalle': this.detalle
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async presentToast(msg:string) {
    const toast = await this.toaster.create({
      message: msg,
      duration: 2000,
      animated: true,
      color: "primary"
    });
    toast.present();
  }

  async deleteCategoria() {
    this.presentLoading();
    this.fuenteService.deleteFuentesCategoria(this.valor).then(async() => {
      this.dismiss();
    }).then(async() => {await this.loadingController.dismiss();})
  }

  async deleteEntrada(id:number) {
    this.presentLoading();
    await this.entradaService.deleteEntrada(id).then(async(res) => {
        this.dismiss();
        this.presentToast(`Evento de '${this.detalle.nombre}' eliminado.`);
    }).then(async() => await this.loadingController.dismiss())
  }

  async deleteEntradas(id:number) {
    this.presentLoading();
    let mensaje = `Eventos de '${this.detalle.nombre}' eliminados.`;
    if(this.tipo == "transporte") mensaje =`Ruta '${this.detalle.nombre}' eliminada.`;

    this.entradaService.deleteEntradas(id).then(async() => {
      await this.fuenteService.deleteFuente(id, this.tipo).then(async() => {
        this.dismiss();
        this.presentToast(mensaje);
      })
    }).then(async() => {await this.loadingController.dismiss()})
  }

  async deleteEventos() {
    this.presentLoading();
    this.valores.forEach(async ev => {
      await this.entradaService.deleteEntradas(ev.id_fuente).then(async() => {
        await this.fuenteService.deleteFuente(ev.id_fuente, this.tipo).then(async() => {
          this.dismiss();
          this.presentToast(`${this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1)}s eliminados`);
        })
      }).then(async() => {await this.loadingController.dismiss()})
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'custom-loading',
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
}
