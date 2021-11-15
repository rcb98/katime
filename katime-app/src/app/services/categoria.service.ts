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
  public categoriaId:number;
  CATEGORIAS = new BehaviorSubject([]);

  constructor(private platform: Platform,
              private sqlite: SQLite) {
                this.databaseConn();
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
  async loadCategoria(id:number):Promise<Categoria> {
    return await this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE id_categoria = ?`, [id])
      .then(async(res) => {
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
  async createCategoria(data:Categoria) {
    return await this.dbInstance
      .executeSql(`INSERT INTO ${this.dbTable} (nombre, color)
      VALUES ('${data.nombre}', '${data.color}')`, [])
      .then(async() => {
        await this.loadCategorias();
      }, (e) => {
        alert(JSON.stringify("ESTOY DANDO PROBLEMA", e.err));
      });
  }

  /* PUT */
  async editCategoria(id:number, data:any) {
    return await this.dbInstance.executeSql(`UPDATE ${this.dbTable} SET nombre = '${data.nombre}', color = '${data.color}' WHERE id_categoria = ${id}`, data)
    .then(async () => {
      await this.loadCategorias();
    }, (e) => {
      alert(JSON.stringify(e.err));
    });
  }

  /* DELETE (all) */
  deleteCategoria(id:number) {
    this.dbInstance
    .executeSql(`DELETE FROM ${this.dbTable} WHERE id_categoria = ${id}`, [])
      .then(() => {
        this.loadCategorias();
      })
      .catch(e => {
        alert(JSON.stringify(e))
      });
  }

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

  setCategoria(id:number) {
    this.categoriaId = id;
  }

  getCategoria() {
    return this.categoriaId;
  }
}
