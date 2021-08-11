import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuenteService } from 'src/app/services/fuente.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-transporte',
  templateUrl: './crear-transporte.page.html',
  styleUrls: ['./crear-transporte.page.scss'],
})
export class CrearTransportePage implements OnInit {

  // Formulario para crear un Transporte
  public transporteForm:FormGroup = this.formBuilder.group({
    tipo: ['transporte'],
    nombre: ['', Validators.required],
    localidad: ['', Validators.required],
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    tipo_trans: ['', Validators.required],
    duracion: ['', Validators.required],
    hora_ini: ['', Validators.required],
    hora_fin: ['', Validators.required],
    icono: ['', Validators.required],
    dias: ['', Validators.required]
  });

  // Localidad
  public modalLocalidad:boolean = false;
  public localidades:string[] = [];

  // Origen
  public modalOrigen:boolean = false;
  public origenes:string[] = [];

  // Destino
  public modalDestino:boolean = false;
  public destinos:string[] = [];

  constructor(private formBuilder: FormBuilder,
              private fuenteService: FuenteService) {
                this.fuenteService.databaseConn();
              }

  ngOnInit() {
  }

  getLocalidades() {
    let ciudades = environment.ciudades;
    this.localidades = [];
    ciudades.forEach(ciu => {
      this.localidades.push(ciu);
    });
  }

  getOrigenes() {
    this.fuenteService.getTransporte().subscribe(res => {
      console.log(res);

    })
  }

  setLocalidad(localidad:string){
    this.transporteForm.value.localidad = localidad;
    this.transporteForm.patchValue(this.transporteForm.value, {onlySelf: false, emitEvent: true}); // Rerender FormGroup
  }

  toggleModalLocalidad(){
    this.modalLocalidad = !this.modalLocalidad;
    this.getLocalidades();
  }

  toggleModalOrigen(){
    this.modalOrigen = !this.modalOrigen;
    this.getOrigenes();
  }

  toggleModalDestino(){
    this.modalDestino = !this.modalDestino;
  }
}
