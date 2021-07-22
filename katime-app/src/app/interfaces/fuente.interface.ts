import { Time } from "@angular/common";

export interface Fuente {
  tipo:string,
  nombre:string,
  descripcion:string,
  fecha:Date,
  hora_ini:Time,
  hora_fin:Time,
  recordatorio:Time,
  repeticion:string,
  dias:string,
  origen:string,
  destino:string,
  direccion:string,
  localidad:string,
  tipo_trans:string,
  duracion:number,
  icono:string
}
