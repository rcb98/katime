import { Component, OnInit } from '@angular/core';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-transportes',
  templateUrl: './transportes.component.html',
  styleUrls: ['./transportes.component.scss'],
})
export class TransportesComponent implements OnInit {

  public transportes:any[] = [];

  constructor(private entradaService: EntradaService,
              private fuenteService: FuenteService) { }

  async ngOnInit() {
    this.transportes = await this.getTransportes();
    this.createEntradas();
  }

  async createEntradas() {
    var horas,
        horario = [];
    alert(JSON.stringify(this.transportes));

    for(let i = 0; i < this.transportes.length; i++) {
      let dias = this.transportes[i]['dias'].split(",");
      for(let j = 0; j < dias.length; j++) {
        horas = await this.getHorarios(this.transportes[i]['direccion'], this.transportes[i]['origen'], dias[j]);
        for(let k = 0; k < horas.length; k++) {
          let hora = new Date(horas[k]),
              hini = new Date(this.transportes[i]['hora_ini']),
              hfin = new Date(this.transportes[i]['hora_fin']);
          if((hora.getHours() >= hini.getHours() && hora.getMinutes() >= hini.getMinutes())
          && (hora.getHours() <= hfin.getHours())) { // (!) ESTO ESTÁ MAL, HAY QUE TENER EN CUENTA QUE SE PERMANEZCA EN LA FRANJA
            horario.push(horas[j]);
          }
        }

      }
      // alert(JSON.stringify(horario));

    }

  }

  async getTransportes(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.fuenteService.getTransportes().subscribe(res => {
        resolve(res);
        }, error => {
            reject("Ha habido un problema");
        }
     );
   });

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
