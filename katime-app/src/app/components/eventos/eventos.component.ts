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
    this.createEntradas();
  }

  createEntradas() {
    //this.entradaService.deleteTable();

    this.fuenteService.getFuentes().subscribe( res => {
        res.forEach(data => {
        let entrada:Entrada = null;

        if(data.dias){
          let i = 0;
          while(data.dias.split(", ")[i]){
            var dia;

            switch(data.dias.split(", ")[i]){
              case 'Lun': dia = 1;
                break;
              case 'Mar': dia = 2;
                break;
              case 'Mie': dia = 3;
                break;
              case 'Jue': dia = 4;
                break;
              case 'Vie': dia = 5;
                break;
              case 'Sab': dia = 6;
                break;
              case 'Dom': dia = 0;
                break;
            }

            let fechaActual = new Date();
            let dias = this.daysInMonth(dia, fechaActual.getMonth(), fechaActual.getFullYear(), data.hora_ini, data.hora_fin);

            dias.forEach(fecha => {
              entrada = {
                "tipo": data.tipo,
                "nombre": data.nombre,
                "descripcion": data.descripcion,
                "hora_ini": fecha.fechaFormateadaIni,
                "hora_fin": fecha.fechaFormateadaFin,
                "recordatorio": data.recordatorio
              }
              //alert("Entrada: " + JSON.stringify(entrada));
              this.entradaService.createEntrada(entrada);
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
          this.entradaService.createEntrada(entrada);
        }
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

  daysInMonth(d, m, y, hini:Date, hfin:Date) {
    let numDays = new Date(y, m , 0).getDate(); // Cuántos días tiene el mes
    var dias:any[] = [];
    for(let i = 2; i <= numDays + 2; i++){
      let dia = new Date(y, m, i);
      let hoy = new Date();

      if((dia >= hoy) && dia.getDay() == d){
        let horaIni = new Date(y, m, i);
        let tiempoIni = new Date(hini);
        horaIni.setHours(tiempoIni.getHours());
        horaIni.setMinutes(tiempoIni.getMinutes());

        let horaFin = new Date(y, m, i);
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
