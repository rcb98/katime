import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';
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
              private modalController: ModalController,
              private popoverController: PopoverController,
              private router: Router,
              private toaster: ToastController) { }

  ngOnInit() {
    if(this.detalle) {
      this.fuenteService.getEventoId(this.detalle.id_fuente).then(res => {
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
      document.getElementById(this.actual).style.fontWeight = "bold";
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
        'titulos': ['Editar evento', 'Eliminar evento', 'Editar categoría'],
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

  deleteCategoria() {
    this.fuenteService.deleteFuentesCategoria(this.valor).then(() => {
      this.dismiss();
    })
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
