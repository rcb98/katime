import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  providers: [DatePipe]
})
export class EventosComponent implements OnInit {

  public detalle:Entrada;
  public categoria:any;
  public entradasHoy: Entrada[] = [];
  public entradasProximas: Entrada[] = [];
  public categorias: Categoria[] = [];
  public tiemposRestantes:any[] = [];
  public hoy:Date = new Date();
  public idCategoriaActiva:number = 0;
  public color:string = 'bg-pink';
  public num:number = 1;
  public modalDetalle:boolean = false;
  public modalBorrar:boolean = false;

  constructor(private datePipe: DatePipe,
              private categoriaService: CategoriaService,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private toaster: ToastController) {
                this.fuenteService.databaseConn();
                this.entradaService.databaseConn();
                this.categoriaService.databaseConn();
              }

  ngOnInit() {
    this.filtrarEntradas();
    this.getEntradas();
    this.getCategorias();
    setInterval(() => {
      this.recalcularTiempo();
    }, 1000 * 60)
  }

  filtrarEntradas() {
    this.fuenteService.getEventos().subscribe( res => {
        res.forEach(data => {
        let entrada:Entrada = null;

        if(data.dias){ // Repetición personalizada
          let i = 0;
          while(data.dias.split(",")[i]){
            var dia = this.getDia(data.dias.split(",")[i]);
            let dias = this.getDiasRepeticion(data.repeticion, new Date(), data.hora_ini, data.hora_fin, dia);

            dias.forEach(fecha => {
              entrada = {
                "id_fuente": data.id_fuente,
                "id_categoria": data.id_categoria,
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
              "id_categoria": data.id_categoria,
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
            "id_categoria": data.id_categoria,
            "tipo": data.tipo,
            "nombre": data.nombre,
            "descripcion": data.descripcion,
            "hora_ini": data.hora_ini,
            "hora_fin": data.hora_fin,
            "recordatorio": data.recordatorio
          }
          this.createEntrada(entrada);
        }
      });
    })
  }

  createEntrada(entrada: Entrada) {
    let hoy = new Date();
    let fecha = new Date(entrada.hora_fin);
    let maxDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 14); // Tiene que ser 7
    if((fecha >= hoy) && (fecha <= maxDate))
      return this.entradaService.createEntrada(entrada);
  }

  filtrarPorCategoria(id:number) {
    this.idCategoriaActiva = id;
    this.entradaService.loadEventosCategoria(id).then(() => {
      this.entradaService.getEventos().subscribe(res => {
        if(res.length <= 0) {
          //this.entradaService.loadEntradas();
          //this.presentToast("No tienes eventos con esa categoría.");
        }
      })
    })
  }

  recalcularTiempo() {
    if(this.entradasHoy.length > 0) {
      this.tiemposRestantes = [];
      this.entradasHoy.forEach(entrada => {
        let tiempo = this.tiempoRestante(entrada.hora_ini);
        this.tiemposRestantes.push(tiempo);
      });
    }
  }

  tiempoRestante(hIni:any) {
    let hora = new Date(hIni),
        hoy = new Date(),
        diferencia = hora.getTime() - hoy.getTime(),
        resultado = Math.round(diferencia / 60000),
        horas = (resultado / 60),
        roundHoras = Math.floor(horas),
        minutos = Math.round((horas - roundHoras) * 60);

    if(roundHoras == 0) return minutos + "min";
    else if(roundHoras > 0 && minutos <= 0) return roundHoras + "h";
    else if(roundHoras > 0 && minutos > 0) return roundHoras + "h " + minutos + "min";
    else if(roundHoras == 0 && minutos <= 0) return "Ahora";
    else return "Ahora";
  }

  getEntrada(id:number) {
    this.entradaService.getEntrada(id).then(res => {
      this.detalle = res;
      this.categoriaService.loadCategoria(res['id_categoria']).then(cat => {
        this.categoria = cat['color'];
      })
      this.toggleModalDetalle();
    })
  }

  getEntradas() {
    this.entradaService.getEventos().subscribe( res => {
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
      this.recalcularTiempo();
    });
  }

  getAllEntradas() {
    this.idCategoriaActiva = 0;
    this.entradaService.loadEventos();
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe( res => {
      this.categorias = [];
      res.forEach(cat => {
        let categoria:Categoria = {
          "id_categoria": cat.id_categoria,
          "nombre": cat.nombre,
          "color": cat.color
        }
        this.categorias.push(categoria);
      });
    })
  }

  getClasesCategoria(id:number) {
    var clases:any;
    this.categoriaService.getCategorias().subscribe( res => {
      res.forEach(cat => {
        if(cat.id_categoria == id) {
          if(this.idCategoriaActiva == id){ // Está seleccionada
            clases = ['bg-' + cat.color, 'border-' + cat.color, 'text-white'];
          } else { // No está seleccionada
            clases = ['bg-transparent', 'border-' + cat.color, 'text-' + cat.color];
          }
        }
      });
    })
    return clases;
  }

  getColorCategoria(id:number) {
    var color:string = '';
    this.categoriaService.getCategorias().subscribe( res => {
      res.forEach(cat => {
        if(cat.id_categoria == id) {
          color = "bg-" + cat.color;
        }
      });
    })
    return color;
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

  deleteEntrada(id:number) {
    this.entradaService.deleteEntrada(id).then(() => {
      this.toggleModalBorrar();
      this.presentToast(`Evento de '${this.detalle.nombre}' eliminad0.`);
    })
  }

  deleteEntradas(id:number) {
    this.entradaService.deleteEntradas(id).then(() => {
      this.fuenteService.deleteFuente(id).then(() => {
        this.toggleModalBorrar();
        this.presentToast(`Eventos de '${this.detalle.nombre}' eliminados.`);
      })
    })
  }

  toggleModalDetalle() {
    this.modalDetalle = !this.modalDetalle;
  }

  toggleModalBorrar() {
    this.modalBorrar = !this.modalBorrar;
  }

  clickOut($event) {
    if($event.target.classList.contains("detalle")) this.toggleModalDetalle();
    if($event.target.classList.contains("borrar")) this.toggleModalDetalle();
  }

  async presentToast(msg:string) {
    const toast = await this.toaster.create({
      message: msg,
      duration: 3000,
      animated: true,
      color: "primary"
    });
    toast.present();
  }

}


