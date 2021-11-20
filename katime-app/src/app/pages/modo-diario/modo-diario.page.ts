import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { Step } from 'ionic2-calendar/calendar';
import { EntradaService } from 'src/app/services/entrada.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { DatePipe } from '@angular/common';
import { Entrada } from 'src/app/interfaces/entrada.interface';
import { RouterService } from 'src/app/services/router.service';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { Fuente } from 'src/app/interfaces/fuente.interface';

@Component({
  selector: 'app-modo-diario',
  templateUrl: './modo-diario.page.html',
  styleUrls: ['./modo-diario.page.scss'],
  providers: [DatePipe]
})
export class ModoDiarioPage implements OnInit, OnDestroy {

  public eventSource = [];
  public detalle:Entrada;
  public fuentes:Fuente[] = [];
  public categoria:any;
  public viewTitle:string = '';
  public now:number;
  public currentHour:number;
  public lockSwipeToPrev:boolean;
  public isToday:boolean;
  public toggleTrans:boolean = false;
  public mostrar:string = "+ Mostrar más";
  public showMostrar:boolean = false;
  public hayFuentes:boolean = false;
  public calendar = {
    locale: 'es-ES',
    mode: 'day',
    step: 15 as Step,
    currentDate: new Date(),
    scrollToHour: new Date().getHours()
  };

  @ViewChild(CalendarComponent) myCal:CalendarComponent;

  constructor(private categoriaService: CategoriaService,
              private comunicadorService: ComunicadorService,
              private datePipe: DatePipe,
              private entradaService: EntradaService,
              private fuenteService: FuenteService,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private routerService: RouterService) { }

  ngOnInit() {
    this.comunicadorService.subscripcion = this.comunicadorService.comunicador.subscribe(res => {
      if(res[0] == "%") {
        this.fuenteService.getTransportes().subscribe(res => {
          if(res.length <= 0) this.hayFuentes = false;
          else this.hayFuentes = true;
        })

        let tam = parseInt(res.slice(1));
        if(tam >= 2) this.showMostrar = true;
        else this.showMostrar = false;
      }
    })

    this.now = new Date().getHours();
    //this.setEvents();
    this.getEventos();
    this.getFuentes();
  }

  ngOnDestroy() {
    this.comunicadorService.subscripcion.unsubscribe();
  }

  toggleTransportes() {
    this.toggleTrans = !this.toggleTrans;
    if(!this.toggleTrans) this.mostrar = "+ Mostrar más";
    else this.mostrar = "- Mostrar menos";
  }

  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }

  goToday() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onCurrentDateChanged(event:Date) {
    let hoy = new Date();
    if(event.getDate() != hoy.getDate()) this.isToday = false;
    else this.isToday = true;

    if(event.getDate() <= hoy.getDate()) this.lockSwipeToPrev = true;
    else this.lockSwipeToPrev = false;
  }

  onEventSelected = async(event) => {
    this.presentLoading();
    await this.entradaService.getEntrada(event.id_entrada).then(async res => {
      this.detalle = res;
      await this.categoriaService.loadCategoria(res['id_categoria']).then(async cat => {
        this.categoria = cat['color'];
      })
    }).then(async () => {await this.detalleEvento();})
  };

  setEvents() {
    var events = [];
    let e1 = {
      title: "Cumpleaños Paula",
      startTime: new Date("2021-10-23 00:00"),
      endTime: new Date("2021-10-23 23:59"),
      short: false,
      allDay: true
    }

    let e2 = {
      title: "Eventito",
      startTime: new Date("2021-10-23 01:00"),
      endTime: new Date("2021-10-23 05:00"),
      short: false,
      allDay: false
    }

    let e3 = {
      title: "Tomar pastilla",
      startTime: new Date("2021-10-23 01:00"),
      endTime: new Date("2021-10-23 01:05"),
      short: true,
      allDay: false
    }

    let e4 = {
      title: "Pasear",
      startTime: new Date("2021-10-23 01:00"),
      endTime: new Date("2021-10-23 02:00"),
      short: true,
      allDay: false
    }

    events.push(e1, e2, e3, e4);
    this.eventSource = events;
  }

  getFuentes() {
    this.fuenteService.getEventos().subscribe(res => {
      this.fuentes = [];
      res.forEach(f => {
        this.fuentes.push(f);
      });
    })
  }

  getEventos() {
    this.entradaService.getEventos().subscribe(res => {
      this.eventSource = [];
      res.forEach(entrada => {
        let hini = new Date(entrada.hora_ini),
            hfin = new Date(entrada.hora_fin),
            allDay = false,
            short = false;
        if(hini.getHours() == 0 && hini.getMinutes() == 0 && hfin.getHours() == 23 && hfin.getMinutes() == 59) allDay = true;
        if((hfin.getTime() - hini.getTime()) / 60000 <= 60) short = true;
        let e = {
          title: entrada.nombre,
          id_entrada: entrada.id_entrada,
          id_categoria: entrada.id_categoria,
          startTime: new Date(entrada.hora_ini),
          endTime: new Date(entrada.hora_fin),
          short: short,
          allDay: allDay
        }
        this.eventSource.push(e);
      });
    })
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

  getTextColorCategoria(id:number) {
    var color:string = '';
    this.categoriaService.getCategorias().subscribe( res => {
      res.forEach(cat => {
        if(cat.id_categoria == id) {
          color = "text-" + cat.color;
        }
      });
    })
    return color;
  }

  tiempoRestante(hIni:any) {
    let hora = new Date(hIni),
        hoy = new Date(),
        diferencia = hora.getTime() - hoy.getTime(),
        resultado = Math.round(diferencia / 60000),
        horas = (resultado / 60),
        roundHoras = Math.floor(horas),
        minutos = Math.round((horas - roundHoras) * 60);

    if(roundHoras >= 24) return this.datePipe.transform(hIni, 'dd/MM');
    else if(roundHoras == 0) return minutos + "min";
    else if(roundHoras > 0 && minutos <= 0) return roundHoras + "h";
    else if(roundHoras > 0 && minutos > 0) return roundHoras + "h " + minutos + "min";
    else if(roundHoras == 0 && minutos <= 0) return "Ahora";
    else return "Ahora";
  }

  async detalleEvento() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': 'detalleEvento',
        "tipo": "evento",
        'detalle': this.detalle,
        'categoria': this.categoria,
        'tiempoRestante': this.tiempoRestante(this.detalle.hora_ini)
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
