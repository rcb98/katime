import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private urlAnterior: string = undefined;
  private urlActual: string = undefined;

  constructor(private router : Router) {
    this.urlActual = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.urlAnterior = this.urlActual;
        this.urlActual = event.url;
      };
    });
  }

  getUrlAnterior() {
    return this.urlAnterior;
  }

  getUrlActual() {
    return this.urlActual;
  }
}
