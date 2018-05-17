import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

// Pages
import { HomePage } from '../home/home';

// Providers
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  inicioRoot = HomePage;
  marcasRoot = 'MarcasPage';
  carritoRoot = 'CarritoPage';
  clientesRoot = 'ClientesPage';
  ordenesRoot = 'OrdenesPage';
  buscarRoot = 'BuscarPage';
  carteraRoot = 'CarteraPage';

  constructor(
    private navCtrl: NavController,
    private authServ: AuthProvider,
  ) {
  }

}
