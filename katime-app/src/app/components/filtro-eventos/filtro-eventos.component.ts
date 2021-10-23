import { Component, Input, OnInit } from '@angular/core';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-filtro-eventos',
  templateUrl: './filtro-eventos.component.html',
  styleUrls: ['./filtro-eventos.component.scss'],
})
export class FiltroEventosComponent implements OnInit {

  public categorias: Categoria[] = [];
  public idCategoriaActiva:number = 0;

  constructor(private categoriaService: CategoriaService,
              private entradaService: EntradaService) { }

  async ngOnInit() {
    await this.getCategorias();
  }

  async getCategorias() {
    this.categoriaService.getCategorias().subscribe(async res => {
      this.categorias = [];
      res.forEach(async cat => {
        let categoria:Categoria = {
          "id_categoria": cat.id_categoria,
          "nombre": cat.nombre,
          "color": cat.color
        }
        this.categorias.push(categoria);
      });
    })
  }

  getClasesCategoria(id:number) {
    if(this.categoriaService.getCategoria() != undefined)
      this.idCategoriaActiva = this.categoriaService.getCategoria();

    var clases:any;
    this.categoriaService.getCategorias().subscribe( res => {
      res.forEach(cat => {
        if(cat.id_categoria == id) {
          if(this.idCategoriaActiva == id){ // Está seleccionada
            clases = ['bg-' + cat.color, 'border-' + cat.color, 'text-white'];
          } else { // No está seleccionada
            clases = ['bg-transparent', 'border-' + cat.color, 'text-' + cat.color];
          }
        }
      });
    })
    return clases;
  }

  getAllEntradas() {
    this.categoriaService.setCategoria(0);
    //this.idCategoriaActiva = 0;
    this.entradaService.loadEventos();
  }

  filtrarPorCategoria(id:number) {
    this.categoriaService.setCategoria(id);
    //this.idCategoriaActiva = id;
    this.entradaService.loadEventosCategoria(id);
  }

}
