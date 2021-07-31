import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { FuenteService } from 'src/app/services/fuente.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
  providers: [DatePipe]
})
export class CrearEventoPage implements OnInit {

  // Formulario para crear un Evento
  public eventoForm:FormGroup = this.formBuilder.group({
    tipo: ['evento'],
    nombre: ['', Validators.required],
    descripcion: [''],
    hora_ini: ['', Validators.required],
    hora_fin: ['', Validators.required],
    recordatorio: [],
    repeticion: [''],
    dias: ['']
  });

  // Repetición
  public repeticionOptions:string[] = ["Sin repetición", "Diariamente", "Semanalmente", "Mensualmente", "Anualmente", "Personalizado"];
  public repeticionValues:string[] = [null, "diario", "semanal", "mensual", "anual", "personalizado"]
  public repeticionIndex:number = 0;
  public repeticion:any = this.repeticionOptions[0];
  public dias:string = '';

  // Recordatorio
  public recordatorioOptions:string[] = ["Sin recordatorio", "1 minuto antes", "5 minutos antes", "10 minutos antes", "30 minutos antes", "1 hora antes"];
  public recordatorioValues:number[] = [null, 1, 5, 10, 30, 60];
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

  constructor(private alertController: AlertController,
              private datePipe: DatePipe,
              private fuenteService: FuenteService,
              private formBuilder: FormBuilder,
              private router: Router,
              private toaster: ToastController) {
                //this.fuenteService.databaseConn();
              }

  ngOnInit() {
  }

  createEvento() {

    /* Validaciones */
    if(this.eventoForm.value.hora_ini > this.eventoForm.value.hora_fin){
      return this.presentToast("La fecha de fin debe ser más antigua que la de inicio.");
    }

    if(!this.eventoForm.value. nombre || !this.eventoForm.value.hora_ini || !this.eventoForm.value.hora_fin) {
      return this.presentToast("Los campos de nombre, fecha de inicio y fin son obligatorios.");
    }

    // Formateamos la fecha
    let hIni = this.datePipe.transform(this.eventoForm.value.hora_ini, 'yyyy-MM-dd HH:mm');
    let hFin = this.datePipe.transform(this.eventoForm.value.hora_fin, 'yyyy-MM-dd HH:mm');

    this.eventoForm.value.hora_ini = hIni;
    this.eventoForm.value.hora_fin = hFin;
    this.eventoForm.value.repeticion = this.repeticionValues[this.repeticionIndex];
    this.eventoForm.value.recordatorio = this.recordatorioValues[this.recordatorioIndex];
    this.eventoForm.value.dias = this.dias;

    // console.log(this.eventoForm.value);

    this.fuenteService.createFuente(this.eventoForm.value).then(res => {
      this.presentToast("¡Evento creado!");
      this.router.navigateByUrl("/modo-lista");
    });
  }

  deleteEventos(){
    this.fuenteService.deleteTable();
  }

  toggle() {
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

  async alertRepeticion() {
    const alert = await this.alertController.create({
      cssClass: 'radio-alert',
      header: 'Repetición',
      inputs: [
        {
          name: this.repeticionOptions[0],
          type: 'radio',
          label: this.repeticionOptions[0],
          value: 0,
          checked: true
        },
        {
          name: this.repeticionOptions[1],
          type: 'radio',
          label: this.repeticionOptions[1],
          value: 1
        },
        {
          name: this.repeticionOptions[2],
          type: 'radio',
          label: this.repeticionOptions[2],
          value: 2
        },
        {
          name: this.repeticionOptions[3],
          type: 'radio',
          label: this.repeticionOptions[3],
          value: 3
        },
        {
          name: this.repeticionOptions[4],
          type: 'radio',
          label: this.repeticionOptions[4],
          value: 4
        },
        {
          name: this.repeticionOptions[5],
          type: 'radio',
          label: this.repeticionOptions[5],
          value: 5
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'capitalize',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          cssClass: 'capitalize',
          handler: (data) => {
            var anteriorRepeticion = this.repeticion,
                anteriorIndex = this.repeticionIndex;
            this.repeticionIndex = data;
            this.repeticion = this.repeticionOptions[data];

            if(data === 5) {
              this.alertPersonalizado(anteriorRepeticion, anteriorIndex);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async alertPersonalizado(state:string, index:number) {
    const alert = await this.alertController.create({
      cssClass: 'radio-alert',
      header: 'Repetición personalizada',
      inputs: [
        {
          name: "Lunes",
          type: 'checkbox',
          label: "Lunes",
          value: "Lun"
        },
        {
          name: "Martes",
          type: 'checkbox',
          label: "Martes",
          value: "Mar"
        },
        {
          name: "Miércoles",
          type: 'checkbox',
          label: "Miércoles",
          value: "Mie"
        },
        {
          name: "Jueves",
          type: 'checkbox',
          label: "Jueves",
          value: "Jue"
        },
        {
          name: "Viernes",
          type: 'checkbox',
          label: "Viernes",
          value: "Vie"
        },
        {
          name: "Sábado",
          type: 'checkbox',
          label: "Sábado",
          value: "Sab"
        },
        {
          name: "Domingo",
          type: 'checkbox',
          label: "Domingo",
          value: "Dom"
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'capitalize',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          cssClass: 'capitalize',
          handler: (data) => {
            if(data && data.length > 0) {
              this.repeticion = '';
              data.forEach(element => {
                this.repeticion += element + ", "
              });
              // Borramos los dos últimos caracteres
              this.repeticion = this.repeticion.slice(0, -2);
              this.dias = this.repeticion;
              this.repeticion += " (Semanalmente)";
            } else {
              this.repeticion = state;
              this.repeticionIndex = index;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async alertRecordatorio() {
    const alert = await this.alertController.create({
      cssClass: 'radio-alert',
      header: 'Recordatorio',
      inputs: [
        {
          name: this.recordatorioOptions[0],
          type: 'radio',
          label: this.recordatorioOptions[0],
          value: 0,
          checked: true
        },
        {
          name: this.recordatorioOptions[1],
          type: 'radio',
          label: this.recordatorioOptions[1],
          value: 1
        },
        {
          name: this.recordatorioOptions[2],
          type: 'radio',
          label: this.recordatorioOptions[2],
          value: 2
        },
        {
          name: this.recordatorioOptions[3],
          type: 'radio',
          label: this.recordatorioOptions[3],
          value: 3
        },
        {
          name: this.recordatorioOptions[4],
          type: 'radio',
          label: this.recordatorioOptions[4],
          value: 4
        },
        {
          name: this.recordatorioOptions[5],
          type: 'radio',
          label: this.recordatorioOptions[5],
          value: 5
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'capitalize',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          cssClass: 'capitalize',
          handler: (data) => {
            this.recordatorioIndex = data;
          }
        }
      ]
    });

    await alert.present();
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
}
