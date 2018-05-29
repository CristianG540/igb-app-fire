import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

// Libs terceros
import _ from 'lodash';

// Providers
import { ConfigProvider as cg } from '../../providers/config/config';
import { ClientesProvider } from '../../providers/clientes/clientes';

@IonicPage()
@Component({
  selector: 'page-cliente-modal',
  templateUrl: 'cliente-modal.html',
})
export class ClienteModalPage {

  private autocompleteItems = [];
  private clienteInfoPage = 'ClienteInfoPage';

  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private clienteServ: ClientesProvider,
    private util: cg,
  ) {
  }

  private dismiss(): void {
    this.viewCtrl.dismiss();
  }

  private chooseItem(item: any): void {
    if (this.navParams.get('type') === 'page') {
      this.navCtrl.push(this.clienteInfoPage, item.data);
    } else {
      this.viewCtrl.dismiss(item);
    }
  }

  private updateSearch(ev: any): void {
    const loading = this.util.showLoading();
    // set val to the value of the searchbar
    const  val = ev.target.value;
    if (val === '') {
      loading.dismiss();
      this.autocompleteItems = [];
      return;
    }
    this.clienteServ.searchCliente(val)
      .then( res => {
        loading.dismiss();
        console.log('Resultados busqueda clientes', res);
        this.autocompleteItems = _.map(res.rows, (row: any) => {
          const name: string = _.has(row, 'highlighting') ? row.highlighting.nombre_cliente : row.doc.nombre_cliente;
          return {
            nit    : row.doc._id,
            name   : name.toLowerCase() + ' - ' + row.doc._id,
            transp : row.doc.transportadora,
            data   : row.doc,
          };
        });
      })
      .catch(err => {
        loading.dismiss();
        console.error('Error updateSearch cliente-modal.ts', err);
      });
  }

}
