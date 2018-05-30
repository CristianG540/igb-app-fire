import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Storage } from '@ionic/storage';

// Libs terceros
import * as _ from 'lodash';
import * as moment from 'moment';

// AngularFire - Firebase
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

// Models
import { Orden } from './models/orden';
import { CarItem } from '../carrito/models/carItem';

// Providers
import { AuthProvider } from '../auth/auth';
import { ConfigProvider as cg } from '../config/config';

@Injectable()
export class OrdenProvider {

  private ordenesRef: AngularFireList<any>;
  public ordenes: Orden[] = [];

  constructor(
    private authServ: AuthProvider,
    private util: cg,
    private angularFireDB: AngularFireDatabase,
    private evts: Events,
    private storage: Storage,
  ) {
    console.log('Hello OrdenProvider Provider');
  }

  public init (): void {
    this.ordenesRef = this.angularFireDB.list(`orders/${this.authServ.userData.uid}/`);
    const ordenesObserv = this.ordenesRef.valueChanges().subscribe(
      ordenes => {
        this.ordenes = ordenes;
      },
      err => console.error('error al subs a las ordenes init orden.ts', err),
    );
    this.evts.subscribe('auth:logout', () => {
      ordenesObserv.unsubscribe();
    });
  }

  public pushItem(orden: Orden): Promise<any> {
    debugger;
    orden.updated_at = Date.now().toString();
    return this.ordenesRef.set(orden._id, orden);
  }

  public async sendOrdersSap(): Promise<any> {

    if (!this.util.onlineOffline) {
      return Promise.reject({
        message: 'No hay conexión, su pedido no puede ser procesado.',
      });
    }

    const token = await this.storage.get('josefa-token');
    const url: string = cg.JOSEFA_URL + '/sap/order';

    const ordenesCalls: Observable<any>[] = _.map(this.ordenesPendientes, (orden: Orden) => {

      // mapeo los productos de la orden segun el formato del api
      const items: any = _.map( orden.items, (item: CarItem) => {
        return {
          referencia : item._id,
          cantidad   : item.cantidad,
          titulo     : item.titulo,
          total      : item.totalPrice,
          descuento  : 0,
        };
      });

      const body: string = JSON.stringify({
        id             : orden._id,
        fecha_creacion : moment(parseInt(orden._id, 10)).format('YYYY-MM-DD'),
        nit_cliente    : orden.nitCliente,
        trasportadora  : orden.transp,
        comentarios    : orden.observaciones + ` ##${this.authServ.userData.idAsesor}## ++${cg.APP_VER}++`,
        productos      : items,
        asesor         : this.authServ.userData.username,
        asesor_id      : this.authServ.userData.idAsesor,
        user_email     : this.authServ.userData.email,
        total          : orden.total,
      });

    });

  }

  /**
   * Getter que me trae las ordenes pendientes
   *
   * @readonly
   * @type {Orden[]}
   * @memberof OrdenProvider
   */
  public get ordenesPendientes(): Orden[] {
    const ordenesPendientes: Orden[] = _.filter(this.ordenes, ['estado', false]);
    return JSON.parse( JSON.stringify(ordenesPendientes) );
  }

}
