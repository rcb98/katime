import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { RouterService } from 'src/app/services/router.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-transporte',
  templateUrl: './crear-transporte.page.html',
  styleUrls: ['./crear-transporte.page.scss'],
  providers: [DatePipe]
})
export class CrearTransportePage implements OnInit {

  // Formulario para crear un Transporte
  public transporteForm:FormGroup = this.formBuilder.group({
    tipo: ['transporte'],
    nombre: ['', Validators.required],
    localidad: ['', Validators.required],
    ruta: ['', Validators.required],
    alias: ['', Validators.required],
    direccion: ['', Validators.required],
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    tipo_trans: ['', Validators.required],
    duracion: [''],
    hora_ini: ['', Validators.required],
    hora_fin: ['', Validators.required],
    icono: [''],
    dias: ['', Validators.required]
  });

  // Localidad
  public modalLocalidad:boolean = false;
  public localidades:string[] = [];

  // Ruta
  public modalRuta:boolean = false;
  public rutas:any[] = [];

  // Origen
  public paradas:string[] = [];
  public modalOrigen:boolean = false;
  public origenes:string[] = [];

  // Destino
  public modalDestino:boolean = false;
  public destinos:string[] = [];

  // Dias
  public dias:string[] = [];

  // Franja
  public toggleCheck:boolean = false;

  // Editar
  public idFuente:number;
  public edicion:boolean = false;
  public rutaInicial:string;


  constructor(private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,
              private entradaService: EntradaService,
              private formBuilder: FormBuilder,
              private fuenteService: FuenteService,
              private router: Router,
              private routerService: RouterService,
              private toaster: ToastController) {
              }

  ngOnInit() {
    if(this.activatedRoute.snapshot.params['id']) {
      this.edicion = true;
      this.idFuente = this.activatedRoute.snapshot.params['id'];
      this.infoEditarTransporte();
    } else {
      this.edicion = false;
    }
  }

  createTransporte() {
    /* Validaciones */
    if(this.transporteForm.value.hora_ini > this.transporteForm.value.hora_fin){
      return this.presentToast("La hora de fin debe ser más antigua que la de inicio.");
    }

    if(!this.transporteForm.value.localidad) {
      return this.presentToast("Introduce la localidad para poder rellenar los campos de línea, origen y destino.");
    }

    if(!this.transporteForm.value.ruta) {
      return this.presentToast("Introduce la línea para poder rellenar los campos de origen y destino.");
    }

    if(!this.transporteForm.value.localidad || !this.transporteForm.value.ruta || !this.transporteForm.value.origen ||
      !this.transporteForm.value.destino || !this.dias || !this.transporteForm.value.hora_ini ||
      !this.transporteForm.value.hora_fin) {
      return this.presentToast("Los campos de localidad, línea, origen, destino, días y franja horaria son obligatorios.");
    }

    this.setValores();

    var origen = -1,
        destino = -1;

    this.fuenteService.getTransporte(this.transporteForm.value.alias).subscribe(res => {
      this.transporteForm.value.nombre = this.transporteForm.value.origen + " - " + this.transporteForm.value.destino;
      this.transporteForm.value.icono = res['icono'];
      res['direccion'][0]['paradas'].forEach((parada, index) => {
        if(parada['nombre'] == this.transporteForm.value.origen) origen = index;
        if(parada['nombre'] == this.transporteForm.value.destino) destino = index;
      });

      if(origen < destino) this.transporteForm.value.direccion = res['direccion'][0]['nombre'];
      else this.transporteForm.value.direccion = res['direccion'][1]['nombre'];

      this.fuenteService.createFuente(this.transporteForm.value).then( res => {
        this.presentToast("¡Transporte añadido!");
        this.router.navigateByUrl(this.routerService.getUrlAnterior());
      });

    });
  }

  async editarTransporte() {

    this.setValores();

    /* Validaciones */
    if(this.transporteForm.value.hora_ini > this.transporteForm.value.hora_fin){
      alert(JSON.stringify(this.transporteForm.value.hora_ini + ", " + this.transporteForm.value.hora_fin));
      return this.presentToast("La hora de fin debe ser más antigua que la de inicio.");
    }

    if(!this.transporteForm.value.localidad) {
      return this.presentToast("Introduce la localidad para poder rellenar los campos de línea, origen y destino.");
    }

    if(!this.transporteForm.value.ruta) {
      return this.presentToast("Introduce la línea para poder rellenar los campos de origen y destino.");
    }

    if(!this.transporteForm.value.localidad || !this.transporteForm.value.ruta || !this.transporteForm.value.origen ||
      !this.transporteForm.value.destino || !this.dias || !this.transporteForm.value.hora_ini ||
      !this.transporteForm.value.hora_fin) {
      return this.presentToast("Los campos de localidad, línea, origen, destino, días y franja horaria son obligatorios.");
    }

    var origen = -1,
        destino = -1;

    this.fuenteService.getTransporte(this.transporteForm.value.alias).subscribe(async res => {
      //this.transporteForm.value.nombre = this.transporteForm.value.origen + " - " + this.transporteForm.value.destino;
      this.transporteForm.value.icono = res['icono'];
      res['direccion'][0]['paradas'].forEach((parada, index) => {
        if(parada['nombre'] == this.transporteForm.value.origen) origen = index;
        if(parada['nombre'] == this.transporteForm.value.destino) destino = index;
      });

      if(origen < destino) this.transporteForm.value.direccion = res['direccion'][0]['nombre'];
      else this.transporteForm.value.direccion = res['direccion'][1]['nombre'];

      await this.fuenteService.editTransporte(this.idFuente, this.transporteForm.value).then(async res => {
        await this.fuenteService.loadTransportes().then(async() => {
          this.presentToast("¡Transporte editado!");
          this.router.navigateByUrl(this.routerService.getUrlAnterior());
        })

      });

    });
  }

  getOriginalName() {
    this.transporteForm.value.nombre = this.transporteForm.value.origen + " - " + this.transporteForm.value.destino;
    this.reRenderForm();
  }

  setValores() {
    // Formateamos la fecha
    let hIni = this.datePipe.transform(this.transporteForm.value.hora_ini, 'yyyy-MM-dd HH:mm');
    let hFin = this.datePipe.transform(this.transporteForm.value.hora_fin, 'yyyy-MM-dd HH:mm');

    this.transporteForm.value.hora_ini = hIni;
    this.transporteForm.value.hora_fin = hFin;
    // this.transporteForm.value.nombre = this.transporteForm.value.ruta;
    this.transporteForm.value.dias = this.dias.toString();
  }

  infoEditarTransporte() {
    this.fuenteService.getFuenteId(this.idFuente, 'transporte').then(res => {
      this.transporteForm.value.localidad = res.localidad;
      this.transporteForm.value.nombre = res.nombre;
      this.transporteForm.value.ruta = res.ruta;
      this.transporteForm.value.origen = res.origen;
      this.transporteForm.value.destino = res.destino;
      this.transporteForm.value.alias = res.alias;
      this.transporteForm.value.dias = res.dias;
      this.transporteForm.value.hora_ini = res.hora_ini;
      this.transporteForm.value.hora_fin = res.hora_fin;
      let dias = res.dias.split(",");
      dias.forEach(d => {
        this.toggleDia(d);
      });
      let hini = new Date(res.hora_ini),
          hfin = new Date(res.hora_fin);
      if(hini.getHours() == 0 && hini.getMinutes() == 0 && hfin.getHours() == 23 && hfin.getMinutes() == 59)
        this.toggleCheck = !this.toggleCheck;
      this.reRenderForm();
    })
  }

  checkDireccion() {
    var origen = -1,
        destino = -1;

    this.fuenteService.getTransporte(this.transporteForm.value.alias).subscribe(res => {
      res['direccion'][0]['paradas'].forEach((parada, index) => {
        if(parada['nombre'] == this.transporteForm.value.origen) origen = index;
        if(parada['nombre'] == this.transporteForm.value.destino) destino = index;
      });

      if(origen < destino) this.transporteForm.value.direccion = res['direccion'][0]['nombre'];
      else this.transporteForm.value.direccion = res['direccion'][1]['nombre'];
    });
  }

  checkTodoElDia() {
    if(this.toggleCheck){
      // (!) ES POSIBLE QUE ESTO DE PROBLEMAS A NIVEL DE FORMATO DENTRO DE LA BD
      var newHIni = new Date(),
          newHFin = new Date();

      // Controlar si existe una hora de inicio o fin introducidas, dándole prioridad siempre a la hora de inicio
      if((this.transporteForm.value.hora_ini && !this.transporteForm.value.hora_fin) ||
        (this.transporteForm.value.hora_ini && this.transporteForm.value.hora_fin)){
        newHIni = new Date(this.transporteForm.value.hora_ini);
        newHFin = new Date(this.transporteForm.value.hora_ini);
      } else if(!this.transporteForm.value.hora_ini && this.transporteForm.value.hora_fin){
        newHIni = new Date(this.transporteForm.value.hora_fin);
        newHFin = new Date(this.transporteForm.value.hora_fin);
      }

      newHIni.setHours(0, 0, 0);
      newHFin.setHours(23, 59, 59);

      this.transporteForm.value.hora_ini = newHIni.toString();
      this.transporteForm.value.hora_fin = newHFin.toString();
      this.reRenderForm();
    }
  }

  checkOrDes() {
    this.transporteForm.value.origen = "";
    this.transporteForm.value.destino = "";
  }

  toggleTodoElDia() {
    this.toggleCheck = !this.toggleCheck;
    this.checkTodoElDia();
  }

  getLocalidades() {
    let ciudades = environment.transportes;
    this.localidades = [];
    ciudades.forEach(ciu => {
      this.localidades.push(ciu.ciudad);
    });
  }

  getRutas() {
    this.rutas = [];
    environment.transportes.forEach(ciu => {
      ciu.lineas.forEach(lin => {
        this.rutas.push(lin);
      });
    });
  }

  getParadas() {
    this.fuenteService.getTransporte(this.transporteForm.value.alias).subscribe(res => {
      this.paradas = [];
      res['direccion'][0]['paradas'].forEach(parada => {
        this.paradas.push(parada['nombre']);
      });
    })
  }

  setLocalidad(localidad:string){
    this.transporteForm.value.localidad = localidad;
    this.reRenderForm();
    this.toggleModalLocalidad();
  }

  setRuta(ruta:any) {
    if(ruta.ruta != this.transporteForm.value.ruta) this.checkOrDes();
    this.transporteForm.value.ruta = ruta.ruta;
    this.transporteForm.value.alias = ruta.alias;
    this.reRenderForm();
    this.toggleModalRuta();
  }

  setOrigen(origen:string) {
    this.transporteForm.value.origen = origen;
    this.reRenderForm();
    this.toggleModalOrigen();
  }

  setDestino(destino:string) {
    this.transporteForm.value.destino = destino;
    this.reRenderForm();
    this.toggleModalDestino();
  }

  toggleModalLocalidad(){
    this.modalLocalidad = !this.modalLocalidad;
    this.getLocalidades();
  }

  toggleModalRuta(){
    this.modalRuta = !this.modalRuta;
    this.getRutas();
  }

  toggleModalOrigen(){
    this.modalOrigen = !this.modalOrigen;
    this.getParadas();
  }

  toggleModalDestino(){
    this.modalDestino = !this.modalDestino;
    this.getParadas();
  }

  toggleDia(dia:string) {
    if(!this.checkDia(dia)) {
      this.dias.push(dia);
    } else {
      this.dias.forEach((d, index) => {
        if(dia == d) this.dias.splice(index, 1);
      });
    }
  }

  checkDia(dia:string) {
    if(this.dias.includes(dia)) return true;
    return false;
  }

  swapDireccion() {
    if(this.transporteForm.value.origen || this.transporteForm.value.destino) {
      let aux = this.transporteForm.value.origen;
      this.transporteForm.value.origen = this.transporteForm.value.destino;
      this.transporteForm.value.destino = aux;
      this.reRenderForm();
    }
  }

  reRenderForm() {
    this.transporteForm.patchValue(this.transporteForm.value, {onlySelf: false, emitEvent: true}); // Rerender FormGroup
  }

  clickOut($event) {
    if($event.target.classList.contains("localidad")) this.toggleModalLocalidad();
    if($event.target.classList.contains("ruta")) this.toggleModalRuta();
    if($event.target.classList.contains("origen")) this.toggleModalOrigen();
    if($event.target.classList.contains("destino")) this.toggleModalDestino();
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
