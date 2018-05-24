import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

// AngularFire - Firebase
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

// Models
import { Producto } from './models/producto';

@Injectable()
export class ProductosProvider {

  private _prodsRef: AngularFireList<Producto>;
  public productos: Producto[];
  public sku$: BehaviorSubject<string|null>;

  constructor(
    private angularFireDB: AngularFireDatabase,
    private evts: Events,
  ) {
    this._prodsRef = this.angularFireDB.list(`products/`, ref => ref.orderByKey());
  }

  public init (): void {
    this.sku$ = new BehaviorSubject(null);
    const prodsObserv: Observable<any> = this.sku$.switchMap(sku => {
      return this.angularFireDB.list(`products/`, ref => {
        return sku ? ref.orderByKey().startAt(sku).endAt(sku + '\uffff').limitToFirst(100) : ref.limitToFirst(100);
      }).valueChanges();
    })

    const prodsSub: Subscription = prodsObserv.subscribe(
      prods => {
        this.productos = prods;
      },
      err => console.error('error subscripcion productos.ts', err),
    )
    this.evts.subscribe('auth:logout', () => {
      prodsSub.unsubscribe();
    });
  }

  /**
   *
   * este metodo es el encargado de hacer funcionar la busqueda de los productos
   * mediante el sku
   *
   * @param {string} query
   * @memberof ProductosProvider
   */
  public searchAutocomplete(query: string): void {
    query = (query) ? query.toUpperCase() : '';

  }

}
