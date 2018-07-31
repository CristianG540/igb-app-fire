import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms'

// libs terceros
import Raven from 'raven-js'

// Providers
import { AuthProvider } from '../../providers/auth/auth'
import { ConfigProvider } from '../../providers/config/config'

function passwordMatchValidator (g: FormGroup) {
  return g.get('password').value === g.get('passwordConfirm').value
    ? null : { 'mismatch': true }
}

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  private signupForm: FormGroup

  constructor (
    private navCtrl: NavController,
    private navParams: NavParams,
    private cgServ: ConfigProvider,
    private authServ: AuthProvider
  ) {
  }

  // Runs when the page is about to enter and become the active page.
  ionViewWillLoad () {
    this.initializeForm()
  }

  private initializeForm (): void {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      // asesor_id: new FormControl('', [Validators.required] ),
      nit_cliente: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.minLength(6), Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.minLength(6), Validators.required])
    }, passwordMatchValidator)
  }

  private register (): void {
    const loading = this.cgServ.showLoading()

    const formModel = JSON.parse(JSON.stringify(this.signupForm.value))

    this.authServ.register(formModel).then(() => {
      loading.dismiss()
    }).catch(err => {
      loading.dismiss()
      console.error('error register - pages/signup.ts', err)
      Raven.captureException(new Error(`error register - pages/signup.ts 🐛: ${JSON.stringify(err)}`), {
        extra: err
      })
    })

  }

}
