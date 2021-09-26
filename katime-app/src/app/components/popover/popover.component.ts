import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
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
  @Input() valor: any;
  @Input() detalle: any[];
  public nombreCat:string = "";

  constructor(private categoriaService: CategoriaService,
              private comunicadorService: ComunicadorService,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private modalController: ModalController,
              public popoverController: PopoverController,
              public router: Router) { }

  ngOnInit() {
  }

  doAction(titulo:string) {
    switch(titulo) {
      case "Editar transportes":
      case "Editar eventos":
        break;
      case "Editar categorías": this.router.navigateByUrl("editar-categorias");
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

  async dismiss() {
    await this.popoverController.dismiss();
  }

}
