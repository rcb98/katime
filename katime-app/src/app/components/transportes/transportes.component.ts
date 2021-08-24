import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-transportes',
  templateUrl: './transportes.component.html',
  styleUrls: ['./transportes.component.scss'],
  providers: [DatePipe]
})
export class TransportesComponent implements OnInit {

  public transportes:any[] = [];
  public entradas:Entrada[] = [];

  constructor(private datePipe: DatePipe,
              private entradaService: EntradaService,
              private fuenteService: FuenteService) {
              }

  async ngOnInit() {
    await this.createEntradas();
    this.getEntradas();
  }

  async createEntradas() {
    var horas,
        horario = [];
    //this.transportes = await this.getTransportes();
    this.fuenteService.getTransportes().subscribe(async res => {
      this.transportes = res;

      if(this.transportes.length > 0) {
        for(let i = 0; i < this.transportes.length; i++) {
          let dias = this.transportes[i]['dias'].split(",");
          for(let j = 0; j < dias.length; j++) {
            horas = await this.getHorarios(this.transportes[i]['direccion'], this.transportes[i]['origen'], dias[j]);
            // alert(JSON.stringify(horas[0]));
            for(let k = 0; k < horas.length; k++) {
              let hora = new Date(horas[k]),
                  hini = new Date(this.transportes[i]['hora_ini']),
                  hfin = new Date(this.transportes[i]['hora_fin']);
              if((hora.getHours() >= hini.getHours() && hora.getMinutes() >= hini.getMinutes())
              && (hora.getHours() <= hfin.getHours())) { // (!) ESTO ESTÁ MAL, HAY QUE TENER EN CUENTA QUE SE PERMANEZCA EN LA FRANJA
                horario.push(horas[k]);
              }
            }
            // alert(JSON.stringify(dias[j]));
            //alert(JSON.stringify(horario));

            horario.forEach(data => {
              var listaDias = this.getDiasRepeticion(new Date(), data, this.getDia(dias[j]));
              listaDias.forEach(d => {
                let entrada:Entrada;
                entrada = {
                  "id_fuente": this.transportes[i].id_fuente,
                  "tipo": this.transportes[i].tipo,
                  "nombre": this.transportes[i].nombre,
                  "localidad": this.transportes[i].localidad,
                  "direccion": this.transportes[i].direccion,
                  "hora_ini": d
                }
                //alert(JSON.stringify(entrada));
                this.createEntrada(entrada);
              });
              //this.entradaService.createEntrada(entrada);
            });
          }
        }
      }
    });
  }

  createEntrada(entrada: Entrada) {
    let hoy = new Date();
    let fecha = new Date(entrada.hora_ini);
    let maxDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 14); // Tiene que ser 7
    if((fecha >= hoy) && (fecha <= maxDate))
      return this.entradaService.createEntrada(entrada);
  }

  getEntradas() {
    this.entradaService.getEntradas().subscribe(res => {
      this.entradas = [];
      res.forEach(entrada => {
        if(entrada.tipo == 'transporte') {
            this.entradas.push(entrada);
        }
      });
    })
    /*this.entradaService.loadEntradas();
    this.entradaService.getEntradas().subscribe( res => {
      var hoy:Date = new Date();
      res.forEach(entrada => {
        if(entrada.tipo == 'transporte') {
          var fecha = new Date(entrada.hora_ini);
          if(fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear()){
            this.entradas.push(entrada);
          }
        }
      });
      alert(JSON.stringify(this.entradas));
    });*/

  }

  getDiasRepeticion(fecha:Date, hini:any, numDia?:number) {
    var fechaIni:Date = new Date(hini),
        numDias:number = 14,
        dias:any[] = [];

    for(let i = 0; i < numDias; i++) {
      var diaIni = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + i, fechaIni.getHours(), fechaIni.getMinutes());

      if(diaIni.getDay() == numDia) {
        dias.push(this.datePipe.transform(diaIni, 'yyyy-MM-dd HH:mm'));
      }
    }
    return dias
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

  async getHorarios(direccion:string, origen:string, dia): Promise<Array<Date>> {
    return new Promise((resolve, reject) => {

      this.fuenteService.getTransporte().subscribe(res => {
        res['direccion'].forEach(dir => {
          if(dir['nombre'] == direccion) {
              dir['paradas'].forEach(parada => {
                if(parada['nombre'] == origen) {
                  if(dia != "Sab" && dia != "Dom") {
                    resolve(parada['salidas'][0]['horas']);
                  } else {
                    resolve(parada['salidas'][1]['horas']);
                  }
                }
              });
            }
          });
        }, error => {
            reject("Ha habido un problema");
        }
     );
   });
 }

}
