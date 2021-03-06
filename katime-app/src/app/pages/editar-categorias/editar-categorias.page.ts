import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ComunicadorService } from 'src/app/services/comunicador.service';

@Component({
  selector: 'app-editar-categorias',
  templateUrl: './editar-categorias.page.html',
  styleUrls: ['./editar-categorias.page.scss'],
})
export class EditarCategoriasPage implements OnInit, OnDestroy {

  public categorias:any [] = [];
  public showModalEditar:boolean = false;
  public showModalCrear:boolean = false;
  public categoria:string;

  constructor(private categoriaService: CategoriaService,
              private comunicadorService: ComunicadorService,
              private popoverController: PopoverController) { }

  ngOnInit() {
    this.comunicadorService.subscripcion = this.comunicadorService.comunicador.subscribe(res => {
      if(res == "editar")
        this.showModalEditar = !this.showModalEditar;

      if(res == "crear")
        this.showModalCrear = !this.showModalCrear;

    });
    this.getCategorias();
  }

  ngOnDestroy() {
    this.comunicadorService.subscripcion.unsubscribe();
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe(res => {
      this.categorias = [];
      res.forEach(cat => {
        let categoria:Categoria = null;

        categoria = {
          "id_categoria": cat.id_categoria,
          "nombre": cat.nombre,
          "color": cat.color
        }

        this.categorias.push(categoria);
      });
    })
  }

  openModalCrear() {
    this.showModalCrear = true;
    this.comunicadorService.ejecutarFuncion("crear-categoria");
  }

  async presentPopover(ev: any) {
    this.categoria = ev.target.id;
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover_setting',
      event: ev,
      translucent: true,
      componentProps: {
        'titulos': ['Editar categor??a', 'Eliminar categor??a'],
        'valor': this.categoria
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

}
