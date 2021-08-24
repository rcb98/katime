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
  //FUENTES: Array<Fuente>;
  FUENTES = new BehaviorSubject([]);
  TRANSPORTES = new BehaviorSubject([]);

  constructor(private datePipe: DatePipe,
              private categoriaService: CategoriaService,
              private entradaService: EntradaService,
              private http: HttpClient,
              private platform: Platform,
              private sqlite: SQLite) {
                //this.databaseConn();
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
                  direccion VARCHAR(255),
                  origen VARCHAR(255),
                  destino VARCHAR(255),
                  tipo_trans VARCHAR(255),
                  icono VARCHAR(255),
                  duracion INT
                )`, [])
              .then((res) => {
                this.loadAllFuentes();
                this.loadTransportes();
                // alert(JSON.stringify(res));
              })
              .catch((error) => alert(JSON.stringify(error)));
          })
          .catch((error) => alert(JSON.stringify(error)));
      });
  }

  /* GET (all) */
  loadAllFuentes() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} where tipo='evento'`, []).then(res => {
      let fuentes: Fuente[] = [];

      if(res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          fuentes.push(res.rows.item(i));
      }
      this.FUENTES.next(fuentes);
    }, (e) => {
      alert(JSON.stringify("Ha habido un error: ", e.err));
    })
  }

  /* GET (fuentes de los próximos 7 días) */
  loadFuentes() {
    var hoy = new Date(),
        fin = new Date(),
        max = fin.setDate(fin.getDate() + 7);

    hoy.setHours(0, 0);

    let fechaHoy = this.datePipe.transform(hoy, 'yyyy-MM-dd HH:mm');
    let fechaMax = this.datePipe.transform(max, 'yyyy-MM-dd HH:mm');

    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE hora_ini >= '${fechaHoy}' AND hora_fin <= '${fechaMax}'`, []).then(res => {
      let fuentes: Fuente[] = [];

      if(res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          fuentes.push(res.rows.item(i));
      }
      this.FUENTES.next(fuentes);
    }, (e) => {
      alert(JSON.stringify("Ha habido un error: ", e.err));
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
      alert(JSON.stringify("Ha habido un error: ", e.err));
    })
  }

  getFuentes():Observable<Fuente[]> {
    return this.FUENTES.asObservable();
  }

  getTransporte():Observable<any> {
    return this.http.get(`./assets/json/L2.json`);
  }

  getTransportes():Observable<Fuente[]> {
    return this.TRANSPORTES.asObservable();
  }

  /* POST */
  createEvento(data:Fuente) {
    return this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (id_categoria, tipo, nombre, descripcion, hora_ini, hora_fin, recordatorio, repeticion, dias)
      VALUES ('${data.id_categoria}', '${data.tipo}', '${data.nombre}', '${data.descripcion}', '${data.hora_ini}', '${data.hora_fin}', '${data.recordatorio}', '${data.repeticion}', '${data.dias}')`, [])
      .then(() => {
        this.loadAllFuentes();
        this.entradaService.deleteTable(); // Puede que de problemas
      }, (e) => {
        alert(JSON.stringify(e.err));
      });
  }

  createTransporte(data:Fuente) {
    alert(JSON.stringify(data));
    return this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (tipo, nombre, hora_ini, hora_fin, dias, localidad, ruta, direccion, origen, destino, tipo_trans, icono, duracion)
      VALUES ('${data.tipo}', '${data.nombre}', '${data.hora_ini}', '${data.hora_fin}', '${data.dias}', '${data.localidad}', '${data.ruta}', '${data.direccion}', '${data.origen}', '${data.destino}', '${data.tipo_trans}', '${data.icono}', '${data.duracion}')`, [])
      .then(() => {
        this.loadTransportes();
        this.entradaService.deleteTable(); // Puede que de problemas
      }, (e) => {
        alert(JSON.stringify(e.err));
      });
  }

  /* DELETE (all) */
  deleteTable() {
    this.dbInstance
      .executeSql(`DROP TABLE ${this.dbTable}`, [])
        .then(() => {
          this.entradaService.dropTable();
          this.categoriaService.dropTable();
          //alert(`Tabla ${this.dbTable} eliminada.`);
          //this.getFuentes();
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
  }

}
