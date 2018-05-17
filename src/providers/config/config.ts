import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

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
  ) {
  }

  public showLoading(): Loading {
    const loading: Loading = this.loadingCtrl.create({
      content: 'Espere por favor...',
    });
    loading.present();
    return loading;
  }

}
