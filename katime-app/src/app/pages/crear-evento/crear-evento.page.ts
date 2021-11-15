import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FuenteService } from 'src/app/services/fuente.service';
import { DatePipe } from '@angular/common';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
  providers: [DatePipe]
})
export class CrearEventoPage implements OnInit, OnDestroy {

  // Formulario para crear un Evento
  public eventoForm:FormGroup = this.formBuilder.group({
    id_categoria: ['', Validators.required],
    tipo: ['evento'],
    nombre: ['', Validators.required],
    descripcion: [''],
    hora_ini: ['', Validators.required],
    hora_fin: ['', Validators.required],
    recordatorio: [],
    repeticion: [''],
    dias: ['']
  });

  // Categoría
  public categorias:Categoria[] = [];
  public showModalCrear:boolean = false;

  // Repetición
  public repeticionOptions:string[] = ["Sin repetición", "Diariamente", "Semanalmente", "Mensualmente", "Anualmente", "Personalizado"];
  public repeticionValues:string[] = ['null', "diario", "semanal", "mensual", "anual", "personalizado"]
  public repeticionIndex:number = 0;
  public repeticion:any = this.repeticionOptions[0];
  public dias:string = '';

  // Recordatorio
  public recordatorioOptions:string[] = ["Sin recordatorio", "1 minuto antes", "5 minutos antes", "10 minutos antes", "30 minutos antes", "1 hora antes"];
  public recordatorioValues:number[] = [0, 1, 5, 10, 30, 60];
  public recordatorioIndex:number = 0;

  // Toggle
  public toggleCheck:boolean = false;

  // DateTime
  fecha = new Date();
  public currentYear:number = this.fecha.getFullYear();
  public currentMonth:number = this.fecha.getMonth() + 1;
  public currentDay:number = this.fecha.getDate();
  public currentMonthSTR:string = ("0" + this.currentMonth).slice(-2);
  public minDate:string = this.currentYear.toString() + "-" + this.currentMonthSTR + "-" + this.currentDay.toString();
  public maxDate:string = (this.currentYear + 10).toString() + "-" + this.currentMonthSTR + "-" + this.currentDay.toString();

  // Editar
  public idFuente:number;
  public edicion:boolean = false;

  public goTo:string;
  public hayCat:boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private categoriaService: CategoriaService,
              private comunicadorService: ComunicadorService,
              private datePipe: DatePipe,
              private fuenteService: FuenteService,
              private formBuilder: FormBuilder,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private router: Router,
              private routerService: RouterService,
              private toaster: ToastController) {

              }

  ngOnInit() {
    if(this.activatedRoute.snapshot.params['id']) {
      this.edicion = true;
      this.idFuente = this.activatedRoute.snapshot.params['id'];
      this.infoEditarEvento();
      this.hayCat = true;
    } else {
      this.edicion = false;
      this.hayCat = false;
    }

    this.comunicadorService.subscripcion = this.comunicadorService.comunicador.subscribe(res => {
      if(res == "crear") this.showModalCrear = !this.showModalCrear;

      if(res[0] == "#"){
        this.dias = res.substr(1);
        this.repeticion = this.dias + " (Semanalmente)";
      }

      for(let i = 0; i < this.repeticionValues.length; i++) {
        if(this.repeticionValues[i] == res) {
          this.dias = null;
          this.repeticionIndex = i;
          this.repeticion = this.repeticionOptions[i];
          break;
        }
      }

      for(let i = 0; i < this.recordatorioValues.length; i++) {
        if(this.recordatorioValues[i] == res) {
          this.dias = null;
          this.recordatorioIndex = i;
          break;
        }
      }

    })

    this.getCategorias();
  }

  ngOnDestroy() {
    this.comunicadorService.subscripcion.unsubscribe();
  }

  async createEvento() {
    /* Validaciones */
    if(this.eventoForm.value.hora_ini > this.eventoForm.value.hora_fin){
      return this.presentToast("La fecha de fin debe ser más antigua que la de inicio.");
    }

    if(!this.eventoForm.value.nombre || !this.eventoForm.value.id_categoria || !this.eventoForm.value.hora_ini || !this.eventoForm.value.hora_fin) {
      return this.presentToast("Los campos de nombre, categoría, fecha de inicio y fin son obligatorios.");
    }

    this.presentLoading();

    this.setValores();

    // alert(JSON.stringify(this.eventoForm.value));

    await this.fuenteService.createFuente(this.eventoForm.value).then(async res => {
      await this.loadingController.dismiss();
      this.presentToast("¡Evento creado!", 2000);
      this.router.navigateByUrl(this.routerService.getUrlAnterior());
    }).then(async() => await this.loadingController.dismiss());
  }

  async editarEvento() {
    this.setValores();
    /* Validaciones */
    if(this.eventoForm.value.hora_ini > this.eventoForm.value.hora_fin){
      return this.presentToast("La fecha de fin debe ser más antigua que la de inicio.");
    }

    if(!this.eventoForm.value.nombre || !this.eventoForm.value.id_categoria || !this.eventoForm.value.hora_ini || !this.eventoForm.value.hora_fin) {
      return this.presentToast("Los campos de nombre, categoría, fecha de inicio y fin son obligatorios.");
    }

    this.presentLoading();

    await this.fuenteService.editEvento(this.idFuente, this.eventoForm.value).then(async res => {
      await this.fuenteService.loadEventos().then(async() => {
      await this.loadingController.dismiss();
      this.presentToast("¡Evento editado!", 2000);
        this.router.navigateByUrl(this.routerService.getUrlAnterior());
      }).then(async() => await this.loadingController.dismiss());
    });
  }

  infoEditarEvento() {
    this.fuenteService.getFuenteId(this.idFuente, 'evento').then(res => {
      this.eventoForm.value.nombre = res.nombre;
      this.eventoForm.value.descripcion = res.descripcion;
      this.eventoForm.value.id_categoria = res.id_categoria;
      this.eventoForm.value.hora_ini = res.hora_ini;
      this.eventoForm.value.hora_fin = res.hora_fin;
      this.eventoForm.value.dias = res.dias;
      this.eventoForm.value.repeticion = res.repeticion;
      this.eventoForm.value.recordatorio = res.recordatorio;
      if(res.repeticion != null && res.repeticion != "null" && res.repeticion != "") this.comunicadorService.ejecutarFuncion(res.repeticion);
      if(res.recordatorio != null && res.recordatorio != "") this.comunicadorService.ejecutarFuncion(res.recordatorio);
      if(res.dias != null && res.dias != "null" && res.dias != "") this.comunicadorService.ejecutarFuncion("#" + res.dias);
      else this.eventoForm.value.dias = "";
      let hini = new Date(res.hora_ini),
          hfin = new Date(res.hora_fin);
      if(hini.getHours() == 0 && hini.getMinutes() == 0 && hfin.getHours() == 23 && hfin.getMinutes() == 59)
        this.toggleCheck = !this.toggleCheck;
      this.reRenderForm();
    })
  }

  deleteEventos(){
    this.fuenteService.deleteTable();
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe(res => {
      this.categorias = [];
      res.forEach(cat => {
        let categoria:Categoria = null;

        categoria = {
          "id_categoria": cat.id_categoria,
          "nombre": cat.nombre,
          "color": cat.color
        }

        this.categorias.push(categoria);
      });
    })
  }

  setValores() {
    // Formateamos la fecha
    let hIni = this.datePipe.transform(this.eventoForm.value.hora_ini, 'yyyy-MM-dd HH:mm');
    let hFin = this.datePipe.transform(this.eventoForm.value.hora_fin, 'yyyy-MM-dd HH:mm');

    this.eventoForm.value.hora_ini = hIni;
    this.eventoForm.value.hora_fin = hFin;
    this.eventoForm.value.repeticion = this.repeticionValues[this.repeticionIndex];
    this.eventoForm.value.recordatorio = this.recordatorioValues[this.recordatorioIndex];
    this.eventoForm.value.dias = this.dias;
  }

  openModalCrear() {
    this.showModalCrear = true;
    this.comunicadorService.ejecutarFuncion("crear-categoria");
  }

  toggleTodoElDia() {
    this.toggleCheck = !this.toggleCheck;
    this.checkTodoElDia();
  }

  checkTodoElDia() {
    if(this.toggleCheck){
      // (!) ES POSIBLE QUE ESTO DE PROBLEMAS A NIVEL DE FORMATO DENTRO DE LA BD
      var newHIni = new Date(),
          newHFin = new Date();

      // Controlar si existe una hora de inicio o fin introducidas, dándole prioridad siempre a la hora de inicio
      if((this.eventoForm.value.hora_ini && !this.eventoForm.value.hora_fin) ||
        (this.eventoForm.value.hora_ini && this.eventoForm.value.hora_fin)){
        newHIni = new Date(this.eventoForm.value.hora_ini);
        newHFin = new Date(this.eventoForm.value.hora_ini);
      } else if(!this.eventoForm.value.hora_ini && this.eventoForm.value.hora_fin){
        newHIni = new Date(this.eventoForm.value.hora_fin);
        newHFin = new Date(this.eventoForm.value.hora_fin);
      }

      newHIni.setHours(0, 0, 0);
      newHFin.setHours(23, 59, 59);

      this.eventoForm.value.hora_ini = newHIni.toString();
      this.eventoForm.value.hora_fin = newHFin.toString();
      this.reRenderForm(); // Rerender FormGroup
    }
  }

  checkCategoria() {
    this.hayCat = true;
  }

  async presentToast(msg:string, time?:number) {
    if(!time) time = 5000;
    const toast = await this.toaster.create({
      message: msg,
      duration: time,
      animated: true,
      color: "primary"
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'custom-loading'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async abrirModal(tipo:string, opciones:string[], valores:any[], index:number) {
    if(this.edicion) this.dias = this.eventoForm.value.dias;
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': tipo,
        'titulos': opciones,
        'valores': valores,
        'selected': valores[index],
        'diasSeleccionados': this.dias
      }
    });
    return await modal.present();
  }

  reRenderForm() {
    this.eventoForm.patchValue(this.eventoForm.value, {onlySelf: false, emitEvent: true});
  }
}
