export interface Entrada {
  // id_entrada:number,
  id_fuente:number,
  tipo:string,
  nombre:string,
  descripcion?:string,
  fecha?:Date,
  hora_ini?:Date,
  hora_fin?:Date,
  recordatorio?:number,
  direccion?:string,
  duracion?:number,
  icono?:string
}
