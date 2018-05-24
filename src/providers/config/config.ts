import { Injectable } from '@angular/core';
import { LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class ConfigProvider {

  static readonly firebaseConfig = {
    apiKey: 'AIzaSyDvspmoR6kHwKFxabc2tMgMG9myJdwizNY',
    authDomain: 'firestore-test-1-todo.firebaseapp.com',
    databaseURL: 'https://firestore-test-1-todo.firebaseio.com',
    projectId: 'firestore-test-1-todo',
    storageBucket: 'firestore-test-1-todo.appspot.com',
    messagingSenderId: '227096854617',
  };

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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

}
