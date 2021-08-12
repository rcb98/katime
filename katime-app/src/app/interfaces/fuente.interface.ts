export interface Fuente {
  id_fuente:number,
  id_categoria:number,
  tipo:string,
  nombre:string,
  descripcion?:string,
  fecha?:Date,
  hora_ini?:Date,
  hora_fin?:Date,
  recordatorio?:number,
  repeticion?:string,
  dias?:string,
  origen?:string,
  destino?:string,
  direccion?:string,
  localidad?:string,
  ruta?:string,
  tipo_trans?:string,
  duracion?:number,
  icono?:string
}
