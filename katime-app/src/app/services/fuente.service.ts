import { Component, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Fuente } from '../interfaces/fuente.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { EntradaService } from './entrada.service';
import { CategoriaService } from './categoria.service';
import { HttpClient } from '@angular/common/http';
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class FuenteService {

  private dbInstance:SQLiteObject;
  readonly dbName:string = "katime-db";
  readonly dbTable:string = "fuenteTable";
  EVENTOS = new BehaviorSubject([]);
  TRANSPORTES = new BehaviorSubject([]);

  constructor(private datePipe: DatePipe,
              private categoriaService: CategoriaService,
              private entradaService: EntradaService,
              private http: HttpClient,
              private platform: Platform,
              private sqlite: SQLite) {
                this.databaseConn();
              }

  databaseConn() {
      this.platform.ready().then(() => {
        this.sqlite.create({
            name: this.dbName,
            location: 'default'
          }).then((sqLite: SQLiteObject) => {
            this.dbInstance = sqLite;
            sqLite.executeSql(`
                CREATE TABLE IF NOT EXISTS ${this.dbTable} (
                  id_fuente INTEGER PRIMARY KEY,
                  id_categoria INTEGER,
                  tipo VARCHAR(255) NOT NULL,
                  nombre VARCHAR(255) NOT NULL,
                  descripcion VARCHAR(255),
                  hora_ini DATETIME,
                  hora_fin DATETIME,
                  recordatorio INT,
                  repeticion VARCHAR(255),
                  dias VARCHAR(255),
                  localidad VARCHAR(255),
                  ruta VARCHAR(255),
                  alias VARCHAR(255),
                  direccion VARCHAR(255),
                  origen VARCHAR(255),
                  destino VARCHAR(255),
                  tipo_trans VARCHAR(255),
                  icono VARCHAR(255),
                  duracion INT
                )`, [])
              .then((res) => {
                this.loadEventos();
                this.loadTransportes();
              })
              .catch((error) => alert(JSON.stringify(error)));
          })
          .catch((error) => alert(JSON.stringify(error)));
      });
  }

  /* GET methods */
  loadEventos() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} where tipo='evento'`, []).then(res => {
      let eventos: Fuente[] = [];

      if(res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          eventos.push(res.rows.item(i));
      }
      this.EVENTOS.next(eventos);
    }, (e) => {
      alert(JSON.stringify("Ha habido un error cargando eventos: ", e.err));
    })
  }

  loadTransportes() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} where tipo='transporte'`, []).then(res => {
      let transportes: Fuente[] = [];

      if(res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          transportes.push(res.rows.item(i));
      }
      this.TRANSPORTES.next(transportes);
    }, (e) => {
      alert(JSON.stringify("Ha habido un error cargando transportes: ", e.err));
    })
  }

  getEventos():Observable<Fuente[]> {
    return this.EVENTOS.asObservable();
  }

  getTransportes():Observable<Fuente[]> {
    return this.TRANSPORTES.asObservable();
  }

  getTransporte(linea:string):Observable<any> {
    return this.http.get(`./assets/json/${linea}.json`);
  }

  getTransporteId(id): Promise<any> {
    return this.dbInstance.executeSql(`SELECT nombre, direccion FROM ${this.dbTable} WHERE tipo='transporte' AND id_fuente = ?`, [id])
    .then((res) => {
      return {
        nombre: res.rows.item(0).nombre,
        direccion: res.rows.item(0).direccion
      }
    });
  }

  /* POST */
  createFuente(data:Fuente) {
    return this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (id_categoria, tipo, nombre, descripcion, hora_ini, hora_fin, recordatorio, repeticion, dias, localidad, ruta, alias, direccion, origen, destino, tipo_trans, icono, duracion)
      VALUES ('${data.id_categoria}', '${data.tipo}', '${data.nombre}', '${data.descripcion}', '${data.hora_ini}', '${data.hora_fin}', '${data.recordatorio}', '${data.repeticion}', '${data.dias}', '${data.localidad}', '${data.ruta}', '${data.alias}', '${data.direccion}', '${data.origen}', '${data.destino}', '${data.tipo_trans}', '${data.icono}', '${data.duracion}')`, [])
      .then(() => {
        this.loadEventos();
        this.loadTransportes();
        this.entradaService.deleteTable(); // Puede que de problemas
      }, (e) => {
        alert(JSON.stringify(e.err));
      });
  }

  deleteFuente(id:number): Promise<any> {
    return this.dbInstance.executeSql(`
    DELETE FROM ${this.dbTable} WHERE id_fuente = ${id}`, [])
      .then(() => {
        this.entradaService.deleteTable();
        this.loadEventos();
        this.loadTransportes();
      })
      .catch(e => {
        alert(JSON.stringify(e))
      });
  }

  /* DELETE (all) */
  deleteTable() {
    this.dbInstance
      .executeSql(`DROP TABLE ${this.dbTable}`, [])
        .then(() => {
          this.entradaService.dropTable();
          this.categoriaService.dropTable();
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
  }

}
