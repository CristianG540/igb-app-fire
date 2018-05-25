import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';

// Models
import { Producto } from '../../providers/productos/models/producto';

// Providers
import { CarritoProvider } from '../../providers/carrito/carrito';
import { ProductosProvider } from '../../providers/productos/productos';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html',
})
export class CarritoPage {

  private _prods: Producto[] = [];

  constructor(
    private evts: Events,
    private cartServ: CarritoProvider,
    private prodServ: ProductosProvider,
    private util: ConfigProvider,
  ) {
    this.evts.subscribe('cart:change', () => {
      this.reloadProds();
      console.log("se lanzo el evento change");
    });
  }

  ionViewDidEnter() {
    this.reloadProds();
  }

  private reloadProds(): void {
    const prodsId = this.cartServ.carIdItems;
    this.prodServ.fetchProdsByids(prodsId)
      .then((prods: Producto[]) => {
        this._prods = prods.filter(Boolean);
        console.log('prods carrito', this._prods);
      })
      .catch(err => console.error('Error reloadProds pages/carrito.ts'))
  }

  private deleteItem(prod: Producto): void {
    let loading = this.util.showLoading();
    this.cartServ.deleteItem(prod)
      .then(res=>{
        loading.dismiss();
        this.util.showToast(`El producto ${res.id} se elimino de carrito correctamente`);
        console.log("prod eliminado carrito", res);
      })
      .catch(err => {
        loading.dismiss();
        console.error('Error deleteItem carrito_page.ts', err)
      })
  }

}
