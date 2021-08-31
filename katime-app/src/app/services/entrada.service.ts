import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Entrada } from '../interfaces/entrada.interface';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private dbInstance:SQLiteObject;
  readonly dbName:string = "katime-db";
  readonly dbTable:string = "entradaTable";
  EVENTOS = new BehaviorSubject([]);
  TRANSPORTES = new BehaviorSubject([]);

  constructor(private platform: Platform,
              private sqlite: SQLite) {
                //this.databaseConn();
              }

  async databaseConn() {
    await this.platform.ready().then(() => {
      this.sqlite.create({
          name: this.dbName,
          location: 'default'
        }).then((sqLite: SQLiteObject) => {
          this.dbInstance = sqLite;
          sqLite.executeSql(`
              CREATE TABLE IF NOT EXISTS ${this.dbTable} (
                id_entrada INTEGER PRIMARY KEY,
                id_fuente INTEGER,
                id_categoria INTEGER,
                tipo VARCHAR(255) NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                descripcion VARCHAR(255),
                localidad VARCHAR(255),
                icono VARCHAR(255),
                direccion VARCHAR(255),
                hora_ini DATETIME,
                hora_fin DATETIME,
                recordatorio INT,
                duracion INT
              )`, [])
            .then((res) => {
              this.deleteTable(); // Puede que de problemas
              this.loadEventos();
              this.loadTransportes();
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));
        })
        .catch((error) => alert(JSON.stringify(error)));
    });
  }

  /* GET (all) */
  loadEventos() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE tipo = 'evento' ORDER BY hora_ini ASC`, []).then((res) => {
      let eventos: Entrada[] = [];

      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          eventos.push(res.rows.item(i));
      }
      this.EVENTOS.next(eventos);
    },(e) => {
      alert(JSON.stringify(e));
    });
  }

  loadTransportes() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE tipo = 'transporte' ORDER BY hora_ini ASC`, []).then((res) => {
      let transportes: Entrada[] = [];

      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          transportes.push(res.rows.item(i));
      }
      this.TRANSPORTES.next(transportes);
    },(e) => {
      alert(JSON.stringify(e));
    });
  }

  loadEventosCategoria(id:number) {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE id_categoria = ? AND tipo = 'evento' ORDER BY hora_ini ASC`, [id])
    .then((res) => {
      let eventos: Entrada[] = [];

      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          eventos.push(res.rows.item(i));
      }
      this.EVENTOS.next(eventos);
    },(e) => {
      alert(JSON.stringify(e));
    });
  }

  getEventos():Observable<Entrada[]> {
    return this.EVENTOS.asObservable();
  }

  getTransportes():Observable<Entrada[]> {
    return this.TRANSPORTES.asObservable();
  }

  /* POST */
  createEntrada(data:Entrada) {
    return this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (id_fuente, id_categoria, tipo, nombre, descripcion, direccion, localidad, icono, hora_ini, hora_fin, recordatorio, duracion)
      VALUES ('${data.id_fuente}', '${data.id_categoria}', '${data.tipo}', '${data.nombre}', '${data.descripcion}', '${data.direccion}', '${data.localidad}', '${data.icono}', '${data.hora_ini}', '${data.hora_fin}', '${data.recordatorio}', '${data.duracion}')`, [])
      .then(() => {
        this.loadEventos();
        this.loadTransportes();
      }, (e) => {
        alert(JSON.stringify("ESTOY DANDO PROBLEMA", e.err));
      });
  }

  /* DELETE (all) */
  deleteTable() {
    this.dbInstance
      .executeSql(`DELETE FROM ${this.dbTable}`, [])
        .then(() => {
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
  }

  dropTable() {
    this.dbInstance
      .executeSql(`DROP TABLE ${this.dbTable}`, [])
        .then(() => {
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
  }
}
