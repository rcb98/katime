import { Component, OnInit } from '@angular/core';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-modo-lista',
  templateUrl: './modo-lista.page.html',
  styleUrls: ['./modo-lista.page.scss'],
})
export class ModoListaPage implements OnInit {

  constructor(private fuenteService: FuenteService) { }

  ngOnInit() {
    this.fuenteService.getFuentes().subscribe( res => {
      alert(JSON.stringify(res));
    })
  }

}
