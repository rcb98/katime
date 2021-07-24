import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

  public eventoForm:FormGroup = this.formBuilder.group({
    tipo: ['evento'],
    nombre: ['', Validators.required],
    descripcion: [''],
    //fecha: [''], // Hay que ponerlo bien
    hora_ini: [Date], // Hay que ponerlo bien
    hora_fin: [Date], // Hay que ponerlo bien
    recordatorio: [], // Hay que ponerlo bien
    repeticion: [''],
    dias: ['']
  });

  public repeticionOptions: string[] = ["Sin repetición", "Diariamente", "Semanalmente", "Mensualmente", "Anualmente", "Personalizado"];

  constructor(private alertController: AlertController,
              private fuenteService: FuenteService,
              private formBuilder: FormBuilder) {
                //this.fuenteService.databaseConn();
              }

  ngOnInit() {
  }

  createEvento() {
    // console.log(this.eventoForm.value);

    this.fuenteService.createFuente(this.eventoForm.value).subscribe(res => {
      alert("Se ha creado, es verdad!");
    });
  }

  deleteEventos(){
    this.fuenteService.deleteTable();
  }

  async alertRepeticion() {
    const alert = await this.alertController.create({
      cssClass: 'radio-alert',
      header: 'Repetición',
      inputs: [
        {
          name: 'Sin repetición',
          type: 'radio',
          label: 'Sin repetición',
          value: null,
          checked: true
        },
        {
          name: 'Diariamente',
          type: 'radio',
          label: 'Diariamente',
          value: 'diario'
        },
        {
          name: 'Semanalmente',
          type: 'radio',
          label: 'Semanalmente',
          value: 'semanal'
        },
        {
          name: 'Mensualmente',
          type: 'radio',
          label: 'Mensualmente',
          value: 'mensual'
        },
        {
          name: 'Anualmente',
          type: 'radio',
          label: 'Anualmente',
          value: 'anual'
        },
        {
          name: 'Personalizado',
          type: 'radio',
          label: 'Personalizado',
          value: 'personal'
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
            this.eventoForm.value.repeticion = data;
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
          name: 'Sin recordatorio',
          type: 'radio',
          label: 'Sin recordatorio',
          value: null,
          checked: true
        },
        {
          name: '1 minuto antes',
          type: 'radio',
          label: '1 minuto antes',
          value: 1
        },
        {
          name: '5 minutos antes',
          type: 'radio',
          label: '5 minutos antes',
          value: 5
        },
        {
          name: '10 minutos antes',
          type: 'radio',
          label: '10 minutos antes',
          value: 10
        },
        {
          name: '30 minutos antes',
          type: 'radio',
          label: '30 minutos antes',
          value: 30
        },
        {
          name: '1 hora antes',
          type: 'radio',
          label: '1 hora antes',
          value: 60
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
            this.eventoForm.value.recordatorio = data;
          }
        }
      ]
    });

    await alert.present();
  }
}
