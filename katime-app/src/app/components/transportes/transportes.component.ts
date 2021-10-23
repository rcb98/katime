import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { ModalComponent } from '../modal/modal.component';
import { PluginListenerHandle } from '@capacitor/core';
import { BackgroundTask } from '@robingenz/capacitor-background-task';
import { App } from '@capacitor/app';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-transportes',
  templateUrl: './transportes.component.html',
  styleUrls: ['./transportes.component.scss'],
  providers: [DatePipe]
})
export class TransportesComponent implements OnInit, OnDestroy, AfterViewInit {

  public entradas:Entrada[] = [];
  public entr:any[] = [];
  public transportes:any[] = [];
  public tiemposRestantes:any[] = [];
  public detalle: any [] = [];
  public valores: any [] = [];

  private appStateChangeListener: PluginListenerHandle | undefined;

  constructor(private comunicadorService: ComunicadorService,
              private datePipe: DatePipe,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private routerService: RouterService) {
              }

  async ngOnInit() {
    this.comunicadorService.subscripcion = this.comunicadorService.comunicador.subscribe( async res => {
      await this.getEntradas();
    });

    this.appStateChangeListener = App.addListener(
      'appStateChange',
      async ({ isActive }) => {
        if (isActive) {
          return;
        }
        const taskId = await BackgroundTask.beforeExit(async () => {
          this.entradaService.deleteTableTipo('transporte');
          this.entradaService.loadTransportes();
          if(this.routerService.getUrlActual() == "/modo-lista")
            await this.createEntradas();
          await this.getEntradas();
          BackgroundTask.finish({ taskId });
        });
      },
    );

    setInterval(() => {
      this.agruparTransportes();
    }, 1000 * 60);
  }

  ngOnDestroy() {
    this.comunicadorService.subscripcion.unsubscribe();
  }

  async ngAfterViewInit() {
    if(this.routerService.getUrlActual() == "/modo-lista")
      await this.createEntradas();
    await this.getEntradas();
  }

  async createEntradas() {
    var horas, horario, dias;
    this.entradas = [];

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

                  hora.setDate(hini.getDate());
                  hora.setFullYear(hini.getFullYear());
                  hora.setMonth(hini.getMonth());

              if(hora >= hini && hora <= hfin) {
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
    let maxDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7); // Tiene que ser 7
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

  async getTransporte(id:number) {
    this.presentLoading();
    await this.fuenteService.getFuenteId(id, 'transporte').then( async res => {
      this.detalle = res;
      this.valores = await this.getHorarios(res.direccion, res.origen, this.getDiaSTR(new Date().getDay()), res.alias);
    }).then(async () => await this.presentModal())
  }

  agruparTransportes() {
    let aux = this.entr.length;
    var agrupacion = this.entradas.reduce(function(obj, item) {
      var index = obj.reduce(function(n, array, id) {
        return (array.id_fuente === item.id_fuente) ? id : n;
      }, -1);
      if (index < 0) {
        var arrayFinal = {
          id_fuente: item.id_fuente,
          horas: [item.hora_ini],
          icono: item.icono,
          nombre: item.nombre,
          direccion: item.direccion
        };
        obj = obj.concat(arrayFinal);
      } else obj[index].horas = obj[index].horas.concat(item.hora_ini);
      return obj;
    }, []);

    this.entr = Object.values(agrupacion);

    if(this.entr.length != aux)
      this.comunicadorService.ejecutarFuncion('%' + this.entr.length.toString());
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
        numDias:number = 7,
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

  getDiaSTR(dia:number) {
    switch(dia){
      case 1: return 'Lun';
      case 2: return 'Mar';
      case 3: return 'Mie';
      case 4: return 'Jue';
      case 5: return 'Vie';
      case 6: return 'Sab';
      case 0: return 'Dom';
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
      "accion": "detalleTransporte",
      "detalle": this.detalle,
      "valores": this.valores,
      "actual": this.datePipe.transform(this.entr[0].horas[0], 'HH:mm')
    }
    });
    await this.loadingController.dismiss();
    return await modal.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'custom-loading'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
