import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { CategoriaComponent } from '../categoria/categoria.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() titulos: string[];
  @Input() valor: any;

  constructor(private comunicadorService: ComunicadorService,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
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
      case "Editar categoría":
        this.comunicadorService.ejecutarFuncion("editar");
        this.comunicadorService.ejecutarFuncion("mostrar-categoria")
        break;
    }
  }

  deleteAll(){
    this.fuenteService.deleteTable();
  }

  async dismiss() {
    await this.popoverController.dismiss();
  }

}
