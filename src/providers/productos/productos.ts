import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

// Libs terceros
import * as _ from 'lodash';

// AngularFire - Firebase
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

// Models
import { Producto } from './models/producto';
import { CarItem } from '../carrito/models/carItem';

// Providers
import { ConfigProvider as cg } from '../config/config';

@Injectable()
export class ProductosProvider {

  public productos: Producto[];
  public sku$: BehaviorSubject<string|null>;

  constructor(
    private angularFireDB: AngularFireDatabase,
    private evts: Events,
  ) {
  }

  public init (): void {
    this.sku$ = new BehaviorSubject(null);
    const prodsObserv: Observable<any> = this.sku$.switchMap(sku => {

      return this.angularFireDB.list(`products/`, ref => {
        return sku ? ref.orderByKey().startAt(sku).endAt(sku + '\uffff').limitToFirst(100) : ref.limitToFirst(100);
      }).valueChanges();

    });

    const prodsSub: Subscription = prodsObserv.subscribe(
      prods => {
        this.productos = prods;
      },
      err => console.error('error subscripcion productos.ts', err),
    );
    this.evts.subscribe('auth:logout', () => {
      prodsSub.unsubscribe();
    });
  }

  public async fetchProdsByids( ids: string[] ): Promise<Producto[]> {

    const prodPromises: Promise<any>[] = _.map(ids, (v, k, l) => {
      return firebase.database().ref(`products/${v}`).once('value');
    });

    const prodsSnapshots = await Promise.all(prodPromises);

    return _.map(prodsSnapshots, (snapshot: any) => {

      const producto: Producto = snapshot.val();

      /**
       * esta validacion la hago por si se elimina un producto de la bd
       * por falta de existencias, a veces pasaba que si habia un producto
       * en el carrito y casualmente se elimina, ocurria un error donde
       * no se encontraba el _id
       */
      if ( _.has(producto, '_id')) {
        return producto;
      } else {
        return new Producto(
          snapshot.key,
          'producto agotado',
          'producto agotado',
          'https://www.igbcolombia.com/app/www/assets/img/logo/logo_igb_small.png',
          null,
          '',
          'UND',
          0,
          0,
          '',
        );
      }

    });
  }

  public updateQuantity(carItems: CarItem[] ): Promise<any> {

    const prodsId = _.map(carItems, '_id');
    return this.fetchProdsByids(prodsId)
    .then((prods: Producto[]) => {

      const prodsToUpdate = _.map(prods, (prod: Producto) => {
        const itemId = cg.binarySearch(carItems, '_id', prod._id);
        prod.existencias -= carItems[itemId].cantidad;
        prod.origen = 'app';
        prod.updated_at = Date.now();
        return prod;
      });
      return prodsToUpdate;
    })
    .then( prodsToUpdate => {
      debugger
      return new Promise(null);
    });

  }

}
