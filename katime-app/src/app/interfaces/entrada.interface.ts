export interface Entrada {
  // id_entrada:number,
  id_fuente:number,
  tipo:string,
  nombre:string,
  id_categoria?:number,
  descripcion?:string,
  fecha?:Date,
  hora_ini?:Date,
  hora_fin?:Date,
  recordatorio?:number,
  localidad?:string,
  direccion?:string,
  duracion?:number,
  icono?:string
}
