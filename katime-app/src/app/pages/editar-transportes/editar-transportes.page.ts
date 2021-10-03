import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-editar-transportes',
  templateUrl: './editar-transportes.page.html',
  styleUrls: ['./editar-transportes.page.scss'],
})
export class EditarTransportesPage implements OnInit {

  public transportes:any[] = [];
  public valores:any[] = [];
  public seleccionados:boolean = false;
  public todos:boolean = false;

  constructor(private fuenteService: FuenteService,
              private modalController: ModalController,
              private popoverController: PopoverController) { }

  ngOnInit() {
  /*let a = {
    "nombre": "Hola",
    "direccion": "Pa alla",
    "icono": "L2.png"
  };
  let b = {
    "nombre": "Adios",
    "direccion": "Pa acá",
    "icono": "L3.png"
  }
  this.transportes.push(a, b);
  this.transportes.forEach(function (element) {
    element.isChecked = false;
  });*/
    this.getTransportes();
  }

  getTransportes() {
    this.fuenteService.getTransportes().subscribe(res => {
      this.transportes = [];
      res.forEach(tr => {
        this.transportes.push(tr);
      });
      this.transportes.forEach(function (element) {
        element.isChecked = false;
      });
    })
  }

  async getTransporte(ev:any, evento:any) {
    this.fuenteService.getFuenteId(evento.id_fuente, 'transporte').then( async res => {
      this.valores = await this.getHorarios(res.direccion, res.origen, this.getDiaSTR(new Date().getDay()), res.alias);
    }).then(() => this.presentPopover(ev, evento))
  }

  getDiaSTR(dia:number) {
    switch(dia){
      case 1: return 'Lun';
      case 2: return 'Mar';
      case 3: return 'Mie';
      case 4: return 'Jue';
      case 5: return 'Vie';
      case 6: return 'Sab';
      case 0: return 'Dom';
    }
  }

  async getHorarios(direccion:string, origen:string, dia, alias): Promise<Array<Date>> {
    return new Promise((resolve, reject) => {
      this.fuenteService.getTransporte(alias).subscribe(res => {
        res['direccion'].forEach(dir => {
          if(dir['nombre'] == direccion) {
              dir['paradas'].forEach(parada => {
                if(parada['nombre'] == origen) {
                  if(dia != "Sab" && dia != "Dom") {
                    resolve(parada['salidas'][0]['horas']);
                  } else {
                    resolve(parada['salidas'][1]['horas']);
                  }
                }
              });
            }
          });
        }, error => {
            reject("Ha habido un problema");
        }
     );
   });
 }

  eliminarTransportes() {
    var borrar = [];
    this.transportes.forEach(ev => {
      if(ev.isChecked == true) {
        borrar.push(ev);
      }
    });

    if(borrar.length > 0) this.modalBorrar('transporte', borrar);
  }

  checkValue(ev:any) {
    this.seleccionados = false;
    this.transportes.forEach(ev => {
      if(ev.isChecked == true){
        this.seleccionados = true;
      }
    });

    if(this.seleccionados) this.todos = true;
    else this.todos = false;
  }

  seleccionarTodos() {
    this.transportes.forEach(ev => {
      ev.isChecked = true;
    });
    this.todos = true;
  }

  deseleccionarTodos() {
    this.transportes.forEach(ev => {
      ev.isChecked = false;
    });
    this.todos = false;
  }

  async presentPopover(ev: any, evento:any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover_setting',
      event: ev,
      translucent: true,
      componentProps: {
        'titulos': ['Detalle transporte', 'Editar transporte'],
        'detalle': evento,
        'valores': this.valores
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async modalBorrar(tipo:string, eventos:any) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-modal-class',
      showBackdrop:true,
      backdropDismiss: true,
      componentProps: {
        'accion': 'eliminarMuchos',
        'tipo': tipo,
        'valores': eventos
      }
    });
    return await modal.present();
  }

}
