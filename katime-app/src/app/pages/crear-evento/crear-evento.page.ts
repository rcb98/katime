import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { FuenteService } from 'src/app/services/fuente.service';
import { DatePipe } from '@angular/common';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ComunicadorService } from 'src/app/services/comunicador.service';

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


  constructor(private categoriaService: CategoriaService,
              private comunicadorService: ComunicadorService,
              private datePipe: DatePipe,
              private fuenteService: FuenteService,
              private formBuilder: FormBuilder,
              private modalController: ModalController,
              private router: Router,
              private toaster: ToastController) {
              }

  ngOnInit() {
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

  createEvento() {
    /* Validaciones */
    if(this.eventoForm.value.hora_ini > this.eventoForm.value.hora_fin){
      return this.presentToast("La fecha de fin debe ser más antigua que la de inicio.");
    }

    if(!this.eventoForm.value.nombre || !this.eventoForm.value.id_categoria || !this.eventoForm.value.hora_ini || !this.eventoForm.value.hora_fin) {
      return this.presentToast("Los campos de nombre, categoría, fecha de inicio y fin son obligatorios.");
    }

    // Formateamos la fecha
    let hIni = this.datePipe.transform(this.eventoForm.value.hora_ini, 'yyyy-MM-dd HH:mm');
    let hFin = this.datePipe.transform(this.eventoForm.value.hora_fin, 'yyyy-MM-dd HH:mm');

    this.eventoForm.value.hora_ini = hIni;
    this.eventoForm.value.hora_fin = hFin;
    this.eventoForm.value.repeticion = this.repeticionValues[this.repeticionIndex];
    this.eventoForm.value.recordatorio = this.recordatorioValues[this.recordatorioIndex];
    this.eventoForm.value.dias = this.dias;

    // alert(JSON.stringify(this.eventoForm.value));

    this.fuenteService.createFuente(this.eventoForm.value).then( res => {
      this.presentToast("¡Evento creado!");
      this.router.navigateByUrl("/modo-lista");
    });
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

  openModalCrear() {
    this.showModalCrear = true;
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
      this.eventoForm.patchValue(this.eventoForm.value, {onlySelf: false, emitEvent: true}); // Rerender FormGroup
    }
  }

  async presentToast(msg:string) {
    const toast = await this.toaster.create({
      message: msg,
      duration: 2000,
      animated: true,
      color: "primary"
    });
    toast.present();
  }

  async abrirModal(tipo:string, opciones:string[], valores:any[], index:number) {
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
}
