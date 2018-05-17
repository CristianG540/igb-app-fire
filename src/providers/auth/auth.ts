import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/switchMap';

// AngularFire - Firebase
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

// Models
import { User } from './model/user';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthProvider {

  public userSession;
  private _userRef: AngularFireObject<User>;
  public userObservable: Observable<User>;
  public userData: User;
  public emailStatus: boolean = false; // Me indica si el usuario ya verifico la cuenta

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireDB: AngularFireDatabase,
    private evts: Events,
  ) {
    this.userObservable = this.angularFireAuth.authState.switchMap(
      user => {
        if (user) {
          this.userSession = user;
          this.emailStatus = user.emailVerified;
          this._userRef = this.angularFireDB.object(`users/${user.uid}`);
          /**
           * Hago el map aqui para evitar poner codigo fuera del provider
           * al momento de hacer el subscribe
           */
          return this._userRef.valueChanges().pipe(
            map((userDB: User) => {
              if (userDB && this.userSession) {
                this.userData = userDB;
                this.sendEmailVerification(this.userSession);
              }
              return userDB;
            }),
          );
        } else {
          return Observable.of(null)
        }
      },
    )

  }

  setUserData(data: User) {
    this._userRef.set(data);
  }

  updateUserData(data: any) {
    this._userRef.update(data);
  }

  /*public login(
    credentials: { username: string, password: string }
  ): Promise<any> {
    return superlogin.login(credentials)
  }

  public logout(): Promise<any>{
    let loading = this.util.showLoading();

    return new Promise((resolve, reject)=>{
      this.isOnline()
        .then(res=>{

          if( _.has(res, 'status') && res.status == 'ok' ){
            return superlogin.logout();
          }else{
            throw "El api de autenticacion no esta disponible";
          }
        })
        .then( () => {
          this.removeTokenJosefa().catch(err=>{
            console.error('error al eliminar el token de josefa',err);
            Raven.captureException( new Error(`error al eliminar el token de josefa: ${JSON.stringify(err)}`), {
              extra: err
            } );
          })
          Raven.setUserContext();
          loading.dismiss();
          resolve();
        })
        .catch(err=>{

          loading.dismiss();
          console.error('error en el logout',err);
          Raven.captureException( new Error(`error en el logout: ${JSON.stringify(err)}`), {
            extra: err
          } );
          //if(err.ok == false || err.message == "Network Error"){
            this.alertCtrl.create({
              title: "Ocurrio un error.",
              message: "Debe estar conectado a la red para desconectarse.",
              buttons: ['Ok']
            }).present();
          //}
          reject();
        })

    })
  }*/

  public register( d ): Promise<any> {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(d.email, d.password).then(user => {

      this._userRef = this.angularFireDB.object(`users/${user.uid}`);
      this.setUserData({
        uid: user.uid,
        name: d.name,
        username: d.username,
        email: user.email,
        idAsesor: d.asesor_id,
        nitCliente: d.nit_cliente,
        verificationEmailIsSend: false,
      })

    })
  }

  public sendEmailVerification(user): void {

    if (!this.userData.verificationEmailIsSend) {

      user.sendEmailVerification()
      .then(() => {
        console.log('email verification sent');
        this.updateUserData({
          verificationEmailIsSend: true,
        })
      }).catch(err => console.error('Error al enviar el correo de verificacion- AuthProvider', err))

    }

  }

  public login(email, password): Promise<any> {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public logout(): Promise<any> {
    this.evts.publish('auth:logout', '');
    return this.angularFireAuth.auth.signOut();
  }

}
