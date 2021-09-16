import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicadorService {

  comunicador = new EventEmitter();
  subscripcion:Subscription;

  constructor() { }

  ejecutarFuncion(destinatario:string){
    this.comunicador.emit(destinatario);
  }
}
