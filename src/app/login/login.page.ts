/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 *
 */
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { LOGIN } from '../config';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private fun: FunctionsService,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private data: DataService,
    private formBuilder: FormBuilder,
    private api:ApiService,
    private router:Router) {
      this.validations_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,  
          Validators.email,
        ])),
        password: new FormControl('', Validators.compose([  
          Validators.required,
        ]))
       });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }

  signin(value) {
    this.api.presentLoading();
    if(this.validations_form.invalid)
    {
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
      this.api.presentToast("Please enter all details");
    }
    else{
      var formdata = new FormData();
      formdata.append("email", value.email);
      formdata.append("password", value.password);
      formdata.append("one_singnal", '11');
      this.api.Post(LOGIN,formdata).then(data=>{
        console.log(data);
        this.api.setToken(data['success'].token);
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
        this.router.navigate(['home']);
      }).catch(d=>{
        console.log(d);
        this.api.dismissLoading();
        this.api.presentToast(d.error.errors);
      })

    }

  }

  async open_modal(b) {
    let modal;
    if (b) {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.terms_of_use, title: 'Terms of Use' }
      });
    } else {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.privacy_policy, title: 'Privacy Policy' }
      });
    }
    return await modal.present();
  }

}
