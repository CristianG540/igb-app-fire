import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Libs terceros
import _ from 'lodash';

// Providers
import { CarritoProvider } from '../../providers/carrito/carrito';
import { ClientesProvider } from '../../providers/clientes/clientes';
import { ConfigProvider as cg } from '../../providers/config/config';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-confirmar-orden',
  templateUrl: 'confirmar-orden.html',
})
export class ConfirmarOrdenPage {

  private ordenForm: FormGroup;
  private newClient: FormGroup;
  private newClientFlag: boolean = false;
  private transportadora: number;

  constructor(
    private authServ: AuthProvider,
    private cartServ: CarritoProvider,
    private util: cg,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
  ) {
  }

  // Runs when the page is about to enter and become the active page.
  ionViewWillLoad() {
    this.initializeForm();
  }

  private initializeForm(): void {

    this.ordenForm = this.fb.group({
      observaciones: [''],
      cliente: [this.authServ.userData.nitCliente, Validators.required],
    });

    if ( this.authServ.userData.nitCliente ) {

      this.ordenForm = this.fb.group({
        observaciones: [''],
        cliente: ['C' + this.authServ.userData.nitCliente, Validators.required],
      });
    } else {

      this.ordenForm = this.fb.group({
        observaciones: [''],
        cliente: [this.authServ.userData.nitCliente, Validators.required],
      });
    }

    this.newClient = this.fb.group({
      nombre: ['', Validators.required],
      codCliente: ['', Validators.required],
    });
  }

  private showClientModal(): void {
    const modal = this.modalCtrl.create('ClienteModalPage');
    modal.onDidDismiss(data => {
      if (data) {
        this.ordenForm.controls['cliente'].setValue(data.nit);
        this.transportadora = data.transp;
      }
    });
    modal.present();
  }

  /**
   * este getter lo uso en la vista de este pagina, se encarga de informar
   * el estado de los datos de la orden por asi decirlo, debido a que
   * se usan dos forms diferentes uno si el cliente es nuevo y otro si el
   * cliente es viejo, entonces esto me devuelve el estado del formulario activo
   * y asi puedo deshabilitar el boton de finalizar la orden si el fomrulario activo
   * es invalido
   *
   * @readonly
   * @type {boolean}
   * @memberof ConfirmarOrdenPage
   */
  public get formStatus(): boolean {
    if (this.newClientFlag) {
      return this.newClient.valid;
    } else {
      return this.ordenForm.valid;
    }
  }

}
