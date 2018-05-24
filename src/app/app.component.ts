import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from '../pages/splash/splash';

import { Subscription } from 'rxjs/Subscription';

// Providers
import { AuthProvider } from '../providers/auth/auth';
import { ConfigProvider } from '../providers/config/config';

// Models
import { User } from '../providers/auth/model/user';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  // como pagina principal asigno una pagina vacia para hacer una funcion
  // parecida a un splas screen mientras el servicio de autenticacion inicia y escoge
  // la pagina adecuada
  private rootPage: any = SplashPage;
  private authObserver: Subscription;
  @ViewChild('content') private content: NavController;


  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCrl: MenuController,
    private authServ:  AuthProvider,
    private cgServ: ConfigProvider,
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.authObserver = authServ.userObservable.subscribe(
      (user: User) => {
        // debugger;
        if (user && authServ.userSession) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = LoginPage;
        }
      },
      err => console.error('Error subscribe data user- app.component', err),
    )

  }

  private cargarPagina(pagina: any): void {
    this.content.setRoot(pagina);
    this.menuCrl.close();
  }

  private logout(): void {
    const loading = this.cgServ.showLoading();
    this.authServ.logout().then((d) => {
      this.cargarPagina(LoginPage);
      loading.dismiss();
      // clearInterval(this.ordenServ.intervalValOrders); // Paro el timer que verifica las ordenes
      // clearInterval(this.util.timerCheckTokenJose); // Paro el timer que verifica el token de josefa no este vencido
    }).catch(err => {
      loading.dismiss();
      console.error('Error cerrando sesion - app.component', err)
    })

  }

}

