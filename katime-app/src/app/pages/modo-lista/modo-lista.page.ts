import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicadorService } from 'src/app/services/comunicador.service';
import { FuenteService } from 'src/app/services/fuente.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-modo-lista',
  templateUrl: './modo-lista.page.html',
  styleUrls: ['./modo-lista.page.scss'],
})
export class ModoListaPage implements OnInit, OnDestroy {

  public toggleTrans:boolean = false;
  public mostrar:string = "+ Mostrar más";
  public showMostrar:boolean = false;
  public hayFuentes:boolean = false;

  constructor(private comunicadorService: ComunicadorService,
              private fuenteService: FuenteService,
              private routerService: RouterService) {
  }

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
  }

  ngOnDestroy() {
    this.comunicadorService.subscripcion.unsubscribe();
  }

  toggleTransportes() {
    this.toggleTrans = !this.toggleTrans;
    if(!this.toggleTrans) this.mostrar = "+ Mostrar más";
    else this.mostrar = "- Mostrar menos";
  }
}
