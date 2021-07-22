import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

  public eventoForm:FormGroup = this.formBuilder.group({
    tipo: 'evento',
    nombre: ['', Validators.required],
    descripcion: [''],
    fecha: [''], // Hay que ponerlo bien
    hora_ini: [''], // Hay que ponerlo bien
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
    //this.fuenteService.createFuente(this.eventoForm.value);
  }
}
