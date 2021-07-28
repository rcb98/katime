import { Component, OnInit } from '@angular/core';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {

  public entradas: Entrada[] = [];

  constructor(private fuenteService: FuenteService,
              private entradaService: EntradaService) {
                this.fuenteService.databaseConn();
                this.entradaService.databaseConn();
  }

  ngOnInit() {
    this.createEntradas();
  }

  createEntradas() {

    //this.entradaService.deleteTable();

    this.fuenteService.getFuentes().subscribe( res => {
        res.forEach(data => {
        let entrada:Entrada = null;

        entrada = {
          "tipo": data.tipo,
          "nombre": data.nombre,
          "descripcion": data.descripcion,
          "hora_ini": data.hora_ini,
          "hora_fin": data.hora_fin,
          "recordatorio": data.recordatorio
        }
        this.entradaService.createEntrada(entrada);
      });
      this.getEntradas();
    })
  }

  getEntradas() {
    this.entradaService.getEntradas().subscribe( res => {
      this.entradas = [];
      res.forEach(entrada => {
        this.entradas.push(entrada);
      });
    })
  }

}
