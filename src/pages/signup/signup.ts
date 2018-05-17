import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, Config } from 'ionic-angular';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ConfigProvider } from '../../providers/config/config';

// Pages
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  private name: string;
  private username: string;
  private asesor_id: number;
  private nitCliente: string = '';
  private email: string;
  private password: string;
  private confirmPassword: string;

  private loading: Loading;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private cgServ: ConfigProvider,
    private authServ:  AuthProvider,
  ) {
  }

  private register(): void {

    const loading = this.cgServ.showLoading();
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      profile: {
        asesor_id: this.asesor_id,
        email: this.email,
        nit_cliente: this.nitCliente,
      },
      asesor_id: this.asesor_id,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.authServ.register(user).then(() => {
      loading.dismiss();
      // this.navCtrl.setRoot(HomePage);
    }).catch(err => {
      loading.dismiss();
      console.error('error al crear la cuenta- SignupPage', err);
    })

  }

  /*private register(): void {
    this.showLoading();
    let user = {
      name: this.name,
      username: this.username,
      email: this.email,
      profile: {
        asesor_id: this.asesor_id,
        email: this.email,
        nit_cliente: this.nitCliente
      },
      asesor_id: this.asesor_id,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.authService.register(user)
    .then(res=>{
      console.log(res);
      this.loading.dismiss();

      this.dbServ.init(res.userDBs.supertest, this.authService.userId).then( info => {
        console.warn('DbAverno- First Replication complete');
      }).catch( err => {
        console.error("DbAverno-totally unhandled error (shouldn't happen)", err);
        Raven.captureException( new Error(`DbAverno- Error en la bd local no deberia pasar 😫: ${JSON.stringify(err)}`), {
          extra: err
        } );
      });;

      this.navCtrl.setRoot('TabsPage');
    }).catch(err=>{
      console.log(err);
      this.loading.dismiss();
    })

  }

  private showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  } */

}
