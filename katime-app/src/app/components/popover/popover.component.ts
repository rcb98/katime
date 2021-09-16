import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() titulos: string[];

  constructor(private comunicadorService: ComunicadorService,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              public popoverController: PopoverController) { }

  ngOnInit() {
  }

  doAction(titulo:string) {
    switch(titulo) {
      case "Editar transportes":
      case "Editar eventos":
      case "Editar categorías":
        break;
      case "Actualizar horarios": this.comunicadorService.ejecutarFuncion("reload");
        break;
      case "Eliminar horarios": this.deleteAll();
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
