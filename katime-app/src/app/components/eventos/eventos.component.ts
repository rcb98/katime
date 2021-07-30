import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  providers: [DatePipe]
})
export class EventosComponent implements OnInit {

  public entradas: Entrada[] = [];

  constructor(private datePipe: DatePipe,
              private entradaService: EntradaService,
              private fuenteService: FuenteService) {
                this.fuenteService.databaseConn();
                this.entradaService.databaseConn();
  }

  ngOnInit() {
    this.filtrarEntradas();
  }

  filtrarEntradas() {
    this.fuenteService.getFuentes().subscribe( res => {
        res.forEach(data => {
        let entrada:Entrada = null;

        if(data.dias){
          let i = 0;
          while(data.dias.split(", ")[i]){
            var dia = this.getDia(data.dias.split(", ")[i]);
            let dias = this.getProximosDias(dia, new Date(), data.hora_ini, data.hora_fin);

            dias.forEach(fecha => {
              entrada = {
                "tipo": data.tipo,
                "nombre": data.nombre,
                "descripcion": data.descripcion,
                "hora_ini": fecha.fechaFormateadaIni,
                "hora_fin": fecha.fechaFormateadaFin,
                "recordatorio": data.recordatorio
              }
          });

            i++;
          }
        } else{
          entrada = {
            "tipo": data.tipo,
            "nombre": data.nombre,
            "descripcion": data.descripcion,
            "hora_ini": data.hora_ini,
            "hora_fin": data.hora_fin,
            "recordatorio": data.recordatorio
          }
        }
        // alert("Entrada: " + JSON.stringify(entrada));
        this.createEntradas(entrada);
      });
      this.getEntradas();
    })
  }

  createEntradas(entrada: Entrada) {
    let hoy = new Date();
    let fecha = new Date(entrada.hora_ini);
    let maxDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7);
    if((fecha > hoy) && (fecha <= maxDate))
      return this.entradaService.createEntrada(entrada);
  }

  getEntradas() {
    this.entradaService.getEntradas().subscribe( res => {
      this.entradas = [];
      res.forEach(entrada => {
        this.entradas.push(entrada);
      });
    })
  }

  getDia(diaSTR:string) {
    switch(diaSTR){
      case 'Lun': return 1;
      case 'Mar': return 2;
      case 'Mie': return 3;
      case 'Jue': return 4;
      case 'Vie': return 5;
      case 'Sab': return 6;
      case 'Dom': return 0;
    }
  }

  getProximosDias(d:number, fecha:Date, hini:Date, hfin:Date) {
    let numDays = 7;
    var dias:any[] = [];

    for(let i = -1; i < numDays - 1; i++) {
      let dia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, i);
      if(dia.getDay() == d){
        let horaIni = new Date(fecha.getFullYear(), fecha.getMonth() + 1, i);
        let tiempoIni = new Date(hini);
        horaIni.setHours(tiempoIni.getHours());
        horaIni.setMinutes(tiempoIni.getMinutes());

        let horaFin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, i);
        let tiempoFin = new Date(hfin);
        horaFin.setHours(tiempoFin.getHours());
        horaFin.setMinutes(tiempoFin.getMinutes());

        dias.push({
          "fechaFormateadaIni": this.datePipe.transform(horaIni, 'yyyy-MM-dd HH:mm'),
          "fechaFormateadaFin": this.datePipe.transform(horaFin, 'yyyy-MM-dd HH:mm')
        });
      }
    }
    return dias;
  }

}
