import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ComunicadorService } from 'src/app/services/comunicador.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit, OnDestroy {

  @Input() mostrarEditar:boolean;
  @Input() mostrarCrear:boolean;
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
              private formBuilder: FormBuilder,
              private toaster: ToastController) { }

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
    if(this.mostrarEditar)
      this.comunicadorService.ejecutarFuncion("editar")
    if(this.mostrarCrear)
      this.comunicadorService.ejecutarFuncion("crear")
  }

  crearCategoria() {
    if(!this.categoriaForm.value.nombre) return this.presentToast("El campo nombre es obligatorio.");
    if(!this.categoriaForm.value.color) return this.presentToast("Elige un color para la categoría.");

    if(this.categorias.length < 7){
      this.categoriaService.createCategoria(this.categoriaForm.value).then( res => {
        this.exitModalCategoria();
        this.getCategorias();
      });
    }
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

  async presentToast(msg:string) {
    const toast = await this.toaster.create({
      message: msg,
      duration: 2000,
      animated: true,
      color: "primary"
    });
    toast.present();
  }

  reRenderForm() {
    this.categoriaForm.patchValue(this.categoriaForm.value, {onlySelf: false, emitEvent: true}); // Rerender FormGroup
  }

}
