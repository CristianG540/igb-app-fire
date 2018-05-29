import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

// Providers
import { AuthProvider } from '../auth/auth';

@Injectable()
export class SongProvider {

  private songsRef: AngularFireList<any>;
  private _songs: any[];

  constructor(
    private angularFireDB: AngularFireDatabase,
    private authServ:  AuthProvider,
    private evts: Events,
  ) {
    console.log('Hello SongProvider Provider');
  }

  getAll() {
    this.songsRef = this.angularFireDB.list(`songs/${this.authServ.userData.uid}/`);
    const songsObserv = this.songsRef.snapshotChanges().subscribe(
      changes => {
        this._songs = changes.map( d => ({ id: d.payload.key, ...d.payload.val() }) );
      },
      err => console.error('error al subs a las canciones', err),
    );
    this.evts.subscribe('auth:logout', () => {
      songsObserv.unsubscribe();
    });
  }

  add(data) {
    this.songsRef.push({
      title: data.title,
    });
  }

  update(id, data) {
    this.songsRef.update(id, {
      title: data.title,
    });
  }

  remove(id) {
    this.songsRef.remove(id);
  }

  public get songs(): any[] {
    return this._songs;
  }


}
