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
  ENTRADAS = new BehaviorSubject([]);

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
                id_fuente INTEGER PRIMARY KEY,
                tipo VARCHAR(255) NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                descripcion VARCHAR(255),
                hora_ini DATETIME,
                hora_fin DATETIME,
                recordatorio INT
              )`, [])
            .then((res) => {
              this.deleteTable(); // Puede que de problemas
              // alert(JSON.stringify(res));
            })
            .catch((error) => alert(JSON.stringify(error)));
        })
        .catch((error) => alert(JSON.stringify(error)));
    });
  }

  /* GET (all) */
  loadEntradas() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} ORDER BY hora_ini ASC`, []).then((res) => {
      let entradas: Entrada[] = [];

      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          entradas.push(res.rows.item(i));
      }
      this.ENTRADAS.next(entradas);
    },(e) => {
      alert(JSON.stringify(e));
    });
  }

  getEntradas():Observable<Entrada[]> {
    return this.ENTRADAS.asObservable();
  }

  /* POST */
  createEntrada(data:Entrada) {
    return this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (tipo, nombre, descripcion, hora_ini, hora_fin, recordatorio)
      VALUES ('${data.tipo}', '${data.nombre}', '${data.descripcion}', '${data.hora_ini}', '${data.hora_fin}', '${data.recordatorio}')`, [])
      .then(() => {
        this.loadEntradas();
      }, (e) => {
        alert(JSON.stringify("ESTOY DANDO PROBLEMA", e.err));
      });
  }

  /* DELETE (all) */
  deleteTable() {
    this.dbInstance
      .executeSql(`DELETE FROM ${this.dbTable}`, [])
        .then(() => {
          //alert(`Tabla ${this.dbTable} eliminada.`);
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
  }
}
