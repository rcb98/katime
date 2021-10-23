import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { CategoriaComponent } from '../categoria/categoria.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() titulos: string[];
  @Input() valores: any[];
  @Input() valor: any;
  @Input() detalle: any[];
  @Input() categoria: string;
  @Input() tiempoRestante: string;
  public nombreCat:string = "";

  constructor(private categoriaService: CategoriaService,
              private comunicadorService: ComunicadorService,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private loadingController: LoadingController,
              private modalController: ModalController,
              public popoverController: PopoverController,
              public router: Router) { }

  ngOnInit() {
  }

  async doAction(titulo:string) {
    switch(titulo) {
      case "Transportes":
        this.router.navigateByUrl("editar-transportes");
        break;
      case "Eventos":
        this.router.navigateByUrl("editar-eventos");
        break;
      case "Categorías": this.router.navigateByUrl("editar-categorias");
        break;
      case "Actualizar horarios": this.comunicadorService.ejecutarFuncion("reload");
        break;
      case "Eliminar horarios": this.deleteAll();
        break;
      case "Editar evento":
        this.modalController.dismiss();
        this.router.navigateByUrl("editar-evento/" + this.detalle['id_fuente']);
        break;
      case "Eliminar evento":
        this.modalController.dismiss();
        this.modalBorrar('evento');
        break;
      case "Editar categoría":
        this.modalController.dismiss();
        this.router.navigateByUrl("editar-categorias");
        this.comunicadorService.ejecutarFuncion("editar");
        this.comunicadorService.ejecutarFuncion("mostrar-categoria")
        break;
      case "Eliminar categoría":
        this.getInfo();
        break;
      case "Editar transporte":
        this.modalController.dismiss();
        this.router.navigateByUrl("editar-transporte/" + this.detalle['id_fuente']);
        break;
      case "Eliminar transporte":
        this.modalController.dismiss();
        this.modalBorrar('transporte')
        break;
      case "Detalle evento":
        await this.detalleEvento();
        break;
      case "Detalle transporte":
        await this.detalleTransporte();
        break;
    }
  }

  getInfo() {
    this.categoriaService.loadCategoria(this.valor).then(res => {
      this.nombreCat = res.nombre;
      this.checkCategoria();
    })
  }

  checkCategoria() {
    this.entradaService.getCantidadEventosCategoria(this.valor).then(res => {
      if(res > 0) this.modalBorrarCategoria();
      else this.categoriaService.deleteCategoria(this.valor);
    })
  }

  deleteAll(){
    this.fuenteService.deleteTable();
  }

  getTiempoRestante(hIni:any) {
    let hora = new Date(hIni),
        hoy = new Date(),
        diferencia = hora.getTime() - hoy.getTime(),
        resultado = Math.round(diferencia / 60000),
        horas = (resultado / 60),
        roundHoras = Math.floor(horas),
        minutos = Math.round((horas - roundHoras) * 60);

    if(roundHoras == 0) return minutos + "min";
    else if(roundHoras > 0 && minutos <= 0) return roundHoras + "h";
    else if(roundHoras > 0 && minutos > 0) return roundHoras + "h " + minutos + "min";
    else if(roundHoras == 0 && minutos <= 0) return "Ahora";
    else return "Ahora";
  }

  async detalleEvento() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': 'detalleEvento',
        'tipo': 'evento',
        'detalle': this.detalle,
        'categoria': this.categoria,
        'tiempoRestante': this.getTiempoRestante(this.detalle['hora_ini'])
      }
    });
    return await modal.present();
  }

  async detalleTransporte() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        "accion": "detalleTransporte",
        'tipo': 'transporte',
        "detalle": this.detalle,
        "valores": this.valores
      }
    });
    return await modal.present();
  }

  async modalBorrarCategoria() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': 'eliminarCat',
        'valor': this.valor,
        'titulo': this.nombreCat
      }
    });
    return await modal.present();
  }

  async modalBorrar(tipo:string) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': 'eliminar',
        'tipo': tipo,
        'detalle': this.detalle
      }
    });
    return await modal.present();
  }

  async dismiss() {
    await this.popoverController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      //duration: 5000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
