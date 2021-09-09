import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-transportes',
  templateUrl: './transportes.component.html',
  styleUrls: ['./transportes.component.scss'],
  providers: [DatePipe]
})
export class TransportesComponent implements OnInit {

  public entradas:Entrada[] = [];
  public entr:any[] = [];
  public transportes:any[] = [];
  public tiemposRestantes:any[] = [];

  constructor(private datePipe: DatePipe,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private modalController: ModalController) {
              }

  async ngOnInit() {
    await this.createEntradas();
    await this.getEntradas();
    setInterval(() => {
      this.agruparTransportes();
    }, 1000 * 60);
  }

  async createEntradas() {
    var horas, horario, dias;

    this.fuenteService.getTransportes().subscribe(async res => {
      this.transportes = [];
      this.transportes = res;

      if(this.transportes.length > 0) {
        for(let i = 0; i < this.transportes.length; i++) {
          dias = [];

          dias = this.transportes[i]['dias'].split(",");
          let alias = this.transportes[i]['alias'];
          for(let j = 0; j < dias.length; j++) {
            horas = await this.getHorarios(this.transportes[i]['direccion'], this.transportes[i]['origen'], dias[j], alias);
            horario = [];
            for(let k = 0; k < horas.length; k++) {
              let hora = new Date(horas[k]),
                  hini = new Date(this.transportes[i]['hora_ini']),
                  hfin = new Date(this.transportes[i]['hora_fin']);
              if((hora.getHours() >= hini.getHours() && hora.getMinutes() >= hini.getMinutes())
              && (hora.getHours() <= hfin.getHours())) { // (!) ESTO ESTÁ MAL, HAY QUE TENER EN CUENTA QUE SE PERMANEZCA EN LA FRANJA
                horario.push(horas[k]);
              }
            }

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
                  "icono": this.transportes[i].icono,
                  "hora_ini": d
                }
                this.createEntrada(entrada);
              });
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

  async getEntradas() {
    this.entradaService.getTransportes().subscribe(async res => {
      this.entradas = [];
      var hoy:Date = new Date();
      res.forEach(async entrada => {
        var fecha = new Date(entrada.hora_ini);
        if(fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear()) {
          this.entradas.push(entrada);
        }
      });

      this.agruparTransportes();
    });
  }

  agruparTransportes() {
    let hoy = new Date();
    let entrSucio = [];
      this.entradas.forEach(e => {
        if(new Date(e.hora_ini) >= hoy){
          let en:any = {
            "id_fuente": e.id_fuente,
            "icono": e.icono,
            "nombre": e.nombre,
            "direccion": e.direccion,
            "horas": [e.hora_ini]
          }
          entrSucio.push(en);
        }
      });

      const arrayHashmap = entrSucio.reduce((obj, item) => {
        obj[item.id_fuente] ? obj[item.id_fuente].horas.push(...item.horas) : (obj[item.id_fuente] = { ...item });
        return obj;
      }, {});

      this.entr = Object.values(arrayHashmap);
  }

  tiempoRestante(hIni:any) {
    let hora = new Date(hIni),
        hoy = new Date(),
        diferencia = hora.getTime() - hoy.getTime(),
        resultado = Math.round(diferencia / 60000),
        horas = (resultado / 60),
        roundHoras = Math.floor(horas),
        minutos = Math.round((horas - roundHoras) * 60);

    if(roundHoras == 0 && minutos > 0) return minutos + "min";
    else if(roundHoras > 0 && minutos <= 0) return roundHoras + "h";
    else if(roundHoras > 0 && minutos > 0) return roundHoras + "h " + minutos + "min";
    else if(roundHoras == 0 && minutos <= 0) return "Ahora";
    else return "Ahora";
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

  async getHorarios(direccion:string, origen:string, dia, alias): Promise<Array<Date>> {
    return new Promise((resolve, reject) => {
      this.fuenteService.getTransporte(alias).subscribe(res => {
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

 async presentModal() {
  const modal = await this.modalController.create({
    component: ModalComponent,
    cssClass: 'my-modal-class',
    componentProps: {
      'firstName': 'Douglas',
      'lastName': 'Adams',
      'middleInitial': 'N'
    }
  });
  return await modal.present();
}

}
