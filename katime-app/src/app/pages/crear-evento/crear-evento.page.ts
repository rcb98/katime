import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
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
    hora_fin: [''], // Hay que ponerlo bien
    recordatorio: [''], // Hay que ponerlo bien
    repeticion: [''],
    dias: ['']
  });

  constructor(private fuenteService: FuenteService,
              private formBuilder: FormBuilder) {
                //this.fuenteService.databaseConn();
              }

  ngOnInit() {
  }

  createEvento() {

    console.log(this.eventoForm.value);
    /*let churro = this.eventoForm.value.hora_ini;
    let fecha = churro.split('T')[0] + " ";
    let hora = churro.split('T')[1].split('.')[0];

    this.eventoForm.value.hora_ini = fecha + hora;

    console.log("A ver: ", fecha+hora);*/



    this.fuenteService.createFuente(this.eventoForm.value).subscribe(res => {
      alert("Se ha creado, es verdad!");
    });
  }

  deleteEventos(){
    this.fuenteService.deleteTable();
  }
}
