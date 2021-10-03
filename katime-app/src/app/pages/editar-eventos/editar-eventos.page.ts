import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { Fuente } from 'src/app/interfaces/fuente.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-editar-eventos',
  templateUrl: './editar-eventos.page.html',
  styleUrls: ['./editar-eventos.page.scss'],
})
export class EditarEventosPage implements OnInit {

  public eventos:any[] = [];
  public categorias: Categoria[] = [];
  public categoria:string;
  public idCategoriaActiva:number = 0;
  public seleccionados:boolean = false;
  public todos:boolean = false;


  constructor(private categoriaService: CategoriaService,
              private fuenteService: FuenteService,
              private modalController: ModalController,
              private popoverController: PopoverController) { }

  ngOnInit() {
    /*let a = {
      "nombre": "Hola"
    };
    let b = {
      "nombre": "Adios"
    }
    this.eventos.push(a, b);
    this.eventos.forEach(function (element) {
      element.isChecked = false;
    });*/
    this.getEventos();
    this.getCategorias();
  }

  getEventos() {
    this.idCategoriaActiva = 0;
    this.fuenteService.getEventos().subscribe(res => {
      this.eventos = [];
      res.forEach(ev => {
        this.eventos.push(ev);
      });
      this.eventos.forEach(function (element) {
        element.isChecked = false;
      });
    })
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe( res => {
      this.categorias = [];
      res.forEach(cat => {
        let categoria:Categoria = {
          "id_categoria": cat.id_categoria,
          "nombre": cat.nombre,
          "color": cat.color
        }
        this.categorias.push(categoria);
      });
    })
  }

  getCategoria(ev:any, evento:any) {
    this.categoriaService.loadCategoria(evento.id_categoria).then(res => {
      this.categoria = res.color;
    }).then(res => {this.presentPopover(ev, evento)})
  }

  getColorCategoria(id:number) {
    var color:string = '';
    this.categoriaService.getCategorias().subscribe( res => {
      res.forEach(cat => {
        if(cat.id_categoria == id) {
          color = "bg-" + cat.color;
        }
      });
    })
    return color;
  }

  getClasesCategoria(id:number) {
    var clases:any;
    this.categoriaService.getCategorias().subscribe( res => {
      res.forEach(cat => {
        if(cat.id_categoria == id) {
          if(this.idCategoriaActiva == id){ // Está seleccionada
            clases = ['bg-' + cat.color, 'border-' + cat.color, 'text-white'];
          } else { // No está seleccionada
            clases = ['bg-transparent', 'border-' + cat.color, 'text-' + cat.color];
          }
        }
      });
    })
    return clases;
  }

  filtrarPorCategoria(id:number) {
    if(id != this.idCategoriaActiva) {
      this.idCategoriaActiva = id;
      this.todos = false;
      this.seleccionados = false;
      this.fuenteService.loadEventosCategoria(id).then(res => {
        this.eventos = [];
        res.forEach(ev => {
          this.eventos.push(ev);
        });
      })
    }

  }

  allEventos() {
    if(this.idCategoriaActiva != 0) {
      this.idCategoriaActiva = 0;
      this.todos = false;
      this.seleccionados = false;
      this.fuenteService.loadEventos();
    }
  }

  seleccionarTodos() {
    this.eventos.forEach(ev => {
      ev.isChecked = true;
    });
    this.todos = true;
  }

  deseleccionarTodos() {
    this.eventos.forEach(ev => {
      ev.isChecked = false;
    });
    this.todos = false;
  }

  eliminarEventos() {
    var borrar = [];
    this.eventos.forEach(ev => {
      if(ev.isChecked == true) {
        borrar.push(ev);
      }
    });

    if(borrar.length > 0) this.modalBorrar('evento', borrar);
  }

  checkValue(ev:any) {
    this.seleccionados = false;
    this.eventos.forEach(ev => {
      if(ev.isChecked == true){
        this.seleccionados = true;
      }
    });

    if(this.seleccionados) this.todos = true;
    else this.todos = false;
  }

  async presentPopover(ev: any, evento:any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover_setting',
      event: ev,
      translucent: true,
      componentProps: {
        'titulos': ['Detalle evento', 'Editar evento'],
        'detalle': evento,
        'categoria': this.categoria
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async modalBorrar(tipo:string, eventos:any) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': 'eliminarMuchos',
        'tipo': tipo,
        'valores': eventos
      }
    });
    return await modal.present();
  }

}
