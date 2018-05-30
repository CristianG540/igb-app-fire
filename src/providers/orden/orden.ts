import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// Libs terceros
import * as _ from 'lodash';

// AngularFire - Firebase
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

// Models
import { Orden } from './models/orden';

// Providers
import { AuthProvider } from '../auth/auth';

@Injectable()
export class OrdenProvider {

  private ordenesRef: AngularFireList<any>;
  public ordenes: Orden[] = [];

  constructor(
    private authServ: AuthProvider,
    private angularFireDB: AngularFireDatabase,
    private evts: Events,
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

}
