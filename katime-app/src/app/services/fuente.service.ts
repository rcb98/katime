import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Fuente } from '../interfaces/fuente.interface';

@Injectable({
  providedIn: 'root'
})
export class FuenteService {

  private dbInstance:SQLiteObject;
  readonly dbName:string = "katime-db";
  readonly dbTable:string = "fuenteTable";
  FUENTES: Array<any>;

  constructor(private platform: Platform,
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
                  tipo varchar(255),
                  nombre varchar(255)
                )`, [])
              .then((res) => {
                // alert(JSON.stringify(res));
              })
              .catch((error) => alert(JSON.stringify(error)));
          })
          .catch((error) => alert(JSON.stringify(error)));
      });
  }

  /* GET (all) */
  /*getFuentes() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable}`, []).then((res) => {
      this.FUENTES = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          this.FUENTES.push(res.rows.item(i));
        return this.FUENTES;
      }
    },(e) => {
      alert(JSON.stringify(e));
    });
  }*/

  /* POST */
  /*createFuente(data:Fuente) {
    this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (tipo, nombre) VALUES ('${data.tipo}', '${data.nombre}')`, [])
      .then(() => {
        alert("Fuente creada!");
        this.getFuentes();
      }, (e) => {
        alert(JSON.stringify(e.err));
      });
  }*/

}
