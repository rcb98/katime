import { Component, Input, OnInit } from '@angular/core';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() titulos: string[];

  constructor(private entradaService: EntradaService,
              private fuenteService: FuenteService) { }

  ngOnInit() {
  }

  doAction(titulo:string) {
    switch(titulo) {
      case "Editar transportes":
      case "Editar eventos":
      case "Editar categorías":
        break;
      case "Actualizar horarios":

        break;
      case "Eliminar horarios": this.deleteAll();
        break;
    }
  }

  deleteAll(){
    this.fuenteService.deleteTable();
  }

}
