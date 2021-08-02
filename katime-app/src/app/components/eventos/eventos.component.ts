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

  public entradasHoy: Entrada[] = [];
  public entradasProximas: Entrada[] = [];
  public hoy:Date = new Date();

  constructor(private datePipe: DatePipe,
              private entradaService: EntradaService,
              private fuenteService: FuenteService) {
                this.fuenteService.databaseConn();
                this.entradaService.databaseConn();
  }

  ngOnInit() {
    this.filtrarEntradas();
    this.getEntradas();
  }

  filtrarEntradas() {
    this.fuenteService.getFuentes().subscribe( res => {
        res.forEach(data => {
        let entrada:Entrada = null;

        if(data.dias){ // Repetición personalizada
          let i = 0;
          while(data.dias.split(", ")[i]){
            var dia = this.getDia(data.dias.split(", ")[i]);
            let dias = this.getDiasRepeticion(data.repeticion, new Date(), data.hora_ini, data.hora_fin, dia);

            dias.forEach(fecha => {
              entrada = {
                "id_fuente": data.id_fuente,
                "tipo": data.tipo,
                "nombre": data.nombre,
                "descripcion": data.descripcion,
                "hora_ini": fecha.fechaFormateadaIni,
                "hora_fin": fecha.fechaFormateadaFin,
                "recordatorio": data.recordatorio
              }
              this.createEntrada(entrada);
            });

            i++;
          }
        } else if(data.repeticion != 'null' && data.repeticion != 'personalizado') { // Resto de repeticiones
          let dias = this.getDiasRepeticion(data.repeticion, new Date(), data.hora_ini, data.hora_fin);
          dias.forEach(fecha => {
            entrada = {
              "id_fuente": data.id_fuente,
              "tipo": data.tipo,
              "nombre": data.nombre,
              "descripcion": data.descripcion,
              "hora_ini": fecha.fechaFormateadaIni,
              "hora_fin": fecha.fechaFormateadaFin,
              "recordatorio": data.recordatorio
            }
            this.createEntrada(entrada);
          });
        } else { // Sin repetición
          entrada = {
            "id_fuente": data.id_fuente,
            "tipo": data.tipo,
            "nombre": data.nombre,
            "descripcion": data.descripcion,
            "hora_ini": data.hora_ini,
            "hora_fin": data.hora_fin,
            "recordatorio": data.recordatorio
          }
          this.createEntrada(entrada);
        }
        //alert("Entrada: " + JSON.stringify(entrada));
      });
      //this.getEntradas();
    })
  }

  createEntrada(entrada: Entrada) {
    let hoy = new Date();
    let fecha = new Date(entrada.hora_fin);
    let maxDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 14); // Tiene que ser 7
    if((fecha >= hoy) && (fecha <= maxDate))
      return this.entradaService.createEntrada(entrada);
  }

  getEntradas() {
    this.entradaService.getEntradas().subscribe( res => {
      this.entradasHoy = [];
      this.entradasProximas = [];
      var hoy:Date = new Date();
      res.forEach(entrada => {
        var fecha = new Date(entrada.hora_ini);
        if(fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear()){
          this.entradasHoy.push(entrada);
        } else {
          this.entradasProximas.push(entrada);
        }
      });
    });
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

  getDiasRepeticion(tipo:string, fecha:Date, hini:Date, hfin:Date, numDia?:number) {
    var fechaIni:Date = new Date(hini),
        fechaFin:Date = new Date(hfin),
        numDias:number = 14,
        dias:any[] = [];

    for(let i = 0; i < numDias; i++) {
      var diaIni = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + i, fechaIni.getHours(), fechaIni.getMinutes()),
          diaFin = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + i, fechaFin.getHours(), fechaFin.getMinutes());

      switch(tipo) {
        case 'diario':
          dias.push({
            "fechaFormateadaIni": this.datePipe.transform(diaIni, 'yyyy-MM-dd HH:mm'),
            "fechaFormateadaFin": this.datePipe.transform(diaFin, 'yyyy-MM-dd HH:mm')
          });
          break;
        case 'semanal':
          if(diaIni.getDay() == fechaIni.getDay()){
            dias.push({
              "fechaFormateadaIni": this.datePipe.transform(diaIni, 'yyyy-MM-dd HH:mm'),
              "fechaFormateadaFin": this.datePipe.transform(diaFin, 'yyyy-MM-dd HH:mm')
            });
          }
          break;
        case 'mensual':
          if(diaIni.getDate() == fechaIni.getDate()){
            dias.push({
              "fechaFormateadaIni": this.datePipe.transform(diaIni, 'yyyy-MM-dd HH:mm'),
              "fechaFormateadaFin": this.datePipe.transform(diaFin, 'yyyy-MM-dd HH:mm')
            });
          }
          break;
        case 'anual':
          if(diaIni.getDate() == fechaIni.getDate() && diaIni.getMonth() == fechaIni.getMonth()){
            dias.push({
              "fechaFormateadaIni": this.datePipe.transform(diaIni, 'yyyy-MM-dd HH:mm'),
              "fechaFormateadaFin": this.datePipe.transform(diaFin, 'yyyy-MM-dd HH:mm')
            });
          }
          break;
        case 'personalizado':
          if(diaIni.getDay() == numDia) {
            dias.push({
              "fechaFormateadaIni": this.datePipe.transform(diaIni, 'yyyy-MM-dd HH:mm'),
              "fechaFormateadaFin": this.datePipe.transform(diaFin, 'yyyy-MM-dd HH:mm')
            });
          }
          break;
        default: break;
      }
    }
    return dias
  }

}
