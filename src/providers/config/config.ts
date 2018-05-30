import { Injectable } from '@angular/core';
import { LoadingController, Loading, AlertController, ToastController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operator/map';

@Injectable()
export class ConfigProvider {

  static readonly APP_VER: string = '1.0.0';
  static readonly firebaseConfig = {
    apiKey: 'AIzaSyDvspmoR6kHwKFxabc2tMgMG9myJdwizNY',
    authDomain: 'firestore-test-1-todo.firebaseapp.com',
    databaseURL: 'https://firestore-test-1-todo.firebaseio.com',
    projectId: 'firestore-test-1-todo',
    storageBucket: 'firestore-test-1-todo.appspot.com',
    messagingSenderId: '227096854617',
  };
  static readonly ELASTIC_URL: string = `https://www.gatortyres.com:9209/couchdb1`;
  static readonly JOSEFA_URL: string = 'https://gatortyres.com';

  public onlineOffline: boolean = navigator.onLine;
  public timerCheckTokenJose: NodeJS.Timer;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private storage: Storage,
    private evts: Events,
  ) {
  }

  public showLoading(): Loading {
    const loading: Loading = this.loadingCtrl.create({
      content: 'Espere por favor...',
    });
    loading.present();
    return loading;
  }

  /**
   * Esta funcion me crea una alerta con un input para preguntarle al
   * usuario cuantas unidades del producto va a agregar al carrito
   *
   * @param {*} handler este parametro recibe una funcion con un parametro data que recibe
   * la cantidad que el usuario ingreso en el input
   * @memberof Config
   */
  public promptAlertCant(handler: any): void {
    this.alertCtrl.create({
      title: 'Agregar cantidad',
      enableBackdropDismiss: false,
      inputs: [{
        name: 'txtCantidad',
        id: 'idTxtCant',
        type: 'number',
        placeholder: 'Cantidad',
      }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: handler,
        },
      ],
    })
    .present()
    .then( () => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });
  }

  public showToast(msg: string): void {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      showCloseButton: false,
      closeButtonText: 'cerrar',
    }).present();
  }

  public async checkToken(): Promise<any> {
    let token: string = '';
    try {
      token = await this.storage.get('josefa-token');
    } catch (e) {
      console.error('Error al recuperal el token de josefa del storage: ', e);
      e.statusText = 'Unauthorized';
      throw new Error(e.statusText);
    }

    const url: string = ConfigProvider.JOSEFA_URL + '/sap';
    const options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + token,
      }),
    };

    try {
      const res = await this.http.get( url, options ).pipe(
      ).toPromise();
      return res;
    } catch (e) {
      console.error('Error al checkear el token de josefa: ', e);
      throw new Error(e.statusText);
    }

  }

  public setTimerCheckJosefa(): void {
    this.timerCheckTokenJose = setInterval( () => {

      if (this.onlineOffline) {

        this.checkToken().then(res => {
          console.log('estado del api josefa', res);
        }).catch( (e: Error) => {
          if (e.message === 'Unauthorized') {
            this.evts.publish('timer:checkTokenJosefa');
          }
        });

      }

    }, 60000 );
  }

  // Esta es una version mas rapida del "_.find" de lodash :3
  // Gracias a https://pouchdb.com/2015/02/28/efficiently-managing-ui-state-in-pouchdb.html
  static binarySearch(arr: any, property: string, search: any): number {
    let low: number = 0;
    let high: number = arr.length;
    let mid: number;
    while (low < high) {
      mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
      arr[mid][property] < search ? low = mid + 1 : high = mid;
    }
    return low;
  }

}
