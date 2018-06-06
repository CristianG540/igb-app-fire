import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';

// libs terceros
import Raven from 'raven-js';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loginForm: FormGroup;
  private username: string;
  private password: string;

  private backgroundImage = 'assets/img/background/background-3.jpg';

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private authServ:  AuthProvider,
    private cgServ: ConfigProvider,
  ) {
    this.menuCtrl.enable(false);
  }

  // Runs when the page is about to enter and become the active page.
  ionViewWillLoad() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /*
  private login(): void {
    let loading = this.util.showLoading();
    let formModel = JSON.parse(JSON.stringify(this.loginForm.value));
    let credentials = {
      username: formModel.username,
      password: formModel.password
    };

    this.authService.login(credentials)
    .then(res=>{
      console.log(res);

      this.dbServ.init(res.userDBs.supertest, this.authService.userId).then( info => {
        console.warn('DbAverno- First Replication complete');
      }).catch( err => {
        console.error("DbAverno-totally unhandled error (shouldn't happen)", err);
        Raven.captureException( new Error(`DbAverno- Error en la bd local no deberia pasar 😫: ${JSON.stringify(err)}`), {
          extra: err
        } );
      });

      return this.authService.getTokenJosefa();
    })
    .then( () => {
      this.cartServ.initDB();
      Raven.setUserContext({
        username: this.authService.userId,
        email: this.authService.userEmail,
        id: this.authService.asesorId
      });
      // Creo un setinterval que verifica las ordenes cada X tiempo
      this.ordenServ.setIntervalOrdersSap();
      this.util.setTimerCheckJosefa();
      this.navCtrl.setRoot('TabsPage');
      loading.dismiss();

    } )
    .catch( err => this.util.errorHandler(err.message, err, loading) )
  }

  */

 private login(): void {
  const loading = this.cgServ.showLoading();
  const formModel = JSON.parse(JSON.stringify(this.loginForm.value));
  this.authServ.login(formModel.email, formModel.password).then(res => {
    return this.authServ.getTokenJosefa();
  }).then(res => {
    loading.dismiss();
  }).catch(err => {
    loading.dismiss();
    console.error('Error login - pages/login.ts', err);
    Raven.captureException( new Error(`Error login - pages/login.ts 🐛: ${JSON.stringify(err)}`), {
      extra: err,
    });
  });
 }

  private launchSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  private requestAccount(): void {
    this.navCtrl.push('FormNewAccountPage');
  }

}
