import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modo-lista',
  templateUrl: './modo-lista.page.html',
  styleUrls: ['./modo-lista.page.scss'],
})
export class ModoListaPage implements OnInit {

  public toggleTrans:boolean = false;
  public mostrar:string = "+ Mostrar más";

  constructor() {
  }

  ngOnInit() {
  }

  toggleTransportes() {
    this.toggleTrans = !this.toggleTrans;
    if(!this.toggleTrans) this.mostrar = "+ Mostrar más";
    else this.mostrar = "- Mostrar menos";
  }
}
