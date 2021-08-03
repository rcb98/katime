import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private dbInstance:SQLiteObject;
  readonly dbName:string = "katime-db";
  readonly dbTable:string = "categoriaTable";
  CATEGORIAS = new BehaviorSubject([]);

  constructor(private platform: Platform,
              private sqlite: SQLite) { }

  async databaseConn() {
    await this.platform.ready().then(() => {
      this.sqlite.create({
          name: this.dbName,
          location: 'default'
        }).then((sqLite: SQLiteObject) => {
          this.dbInstance = sqLite;
          sqLite.executeSql(`
              CREATE TABLE IF NOT EXISTS ${this.dbTable} (
                id_categoria INTEGER PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                color VARCHAR(255) NOT NULL
              )`, [])
            .then((res) => {
              // this.dropTable();
              this.loadCategorias();
            })
            .catch((error) => alert(JSON.stringify(error)));
        })
        .catch((error) => alert(JSON.stringify(error)));
    });
  }

  /* GET (all) */
  loadCategorias() {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} ORDER BY nombre ASC`, []).then((res) => {
      let categorias: Categoria[] = [];

      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++)
          categorias.push(res.rows.item(i));
      }
      this.CATEGORIAS.next(categorias);
    },(e) => {
      alert(JSON.stringify(e));
    });
  }

  /* GET (by Id) */
  loadCategoria(id:number):Promise<Categoria> {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE id_categoria = ?`, [id])
      .then((res) => {
        return {
          id_categoria: res.rows.item(0).id_categoria,
          nombre: res.rows.item(0).nombre,
          color: res.rows.item(0).color
        }
      });
  }

  getCategorias():Observable<Categoria[]> {
    return this.CATEGORIAS.asObservable();
  }

  /* POST */
  createCategoria(data:Categoria) {
    return this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (nombre, color)
      VALUES ('${data.nombre}', '${data.color}')`, [])
      .then(() => {
        this.loadCategorias();
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
