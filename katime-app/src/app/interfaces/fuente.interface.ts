export interface Fuente {
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
  tipo_trans?:string,
  duracion?:number,
  icono?:string
}
