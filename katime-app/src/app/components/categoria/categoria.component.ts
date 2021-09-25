import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ComunicadorService } from 'src/app/services/comunicador.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit, OnDestroy {

  @Input() mostrar:boolean;
  @Input() categoria:any;
  public categorias:Categoria[] = [];
  public originalColor:string;

  // Formulario para crear una Categoría
  public categoriaForm:FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    color: ['', Validators.required]
  });

  constructor(private categoriaService: CategoriaService,
              private comunicadorService: ComunicadorService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.comunicadorService.subscripcion = this.comunicadorService.comunicador.subscribe(res => {
      if(res == "mostrar-categoria") this.getCategoria();
    })
    this.getCategorias();
  }

  ngOnDestroy() {
    this.comunicadorService.subscripcion.unsubscribe();
  }

  exitModalCategoria() {
    this.comunicadorService.ejecutarFuncion("editar")
  }

  editarCategoria() {
    this.categoriaService.editCategoria(this.categoria, this.categoriaForm.value).then(res => {
      this.exitModalCategoria();
    })
  }

  getCategoria() {
    this.categoriaService.loadCategoria(this.categoria).then(res => {
      this.categoriaForm.value.nombre = res.nombre;
      this.categoriaForm.value.color = res.color;
      this.originalColor = res.color;
      this.reRenderForm();
    })
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe(res => {
      this.categorias = [];
      res.forEach(cat => {
        let categoria:Categoria = null;

        categoria = {
          "id_categoria": cat.id_categoria,
          "nombre": cat.nombre,
          "color": cat.color
        }

        this.categorias.push(categoria);
      });
    })
  }

  isCategoria(color:string){
    let existe = false;

    if(color == this.originalColor) return false;

    this.categorias.forEach(cat => {
      if(cat.color == color) {
        existe = true;
      }
    });
    return existe;
  }

  reRenderForm() {
    this.categoriaForm.patchValue(this.categoriaForm.value, {onlySelf: false, emitEvent: true}); // Rerender FormGroup
  }

}
