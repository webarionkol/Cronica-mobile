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
import { MenuController, ModalController } from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { REGISTER } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  
  validations_form: FormGroup;
  constructor(private fun:FunctionsService, private menuCtrl: MenuController, private modalController: ModalController, private data: DataService,
    private formBuilder: FormBuilder,private api:ApiService,private router:Router) { 
    this.validations_form = this.formBuilder.group({
      first_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      last_name: new FormControl('', Validators.compose([
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,  
        Validators.email,
      ])),
      mobile_no: new FormControl('', Validators.compose([ 
        Validators.required, 
      ])),
      password: new FormControl('', Validators.compose([  
        Validators.required,
      ])),
      city: new FormControl('', Validators.compose([ 
        Validators.required,
      ])),
      state: new FormControl('', Validators.compose([ 
        Validators.required,
      ])),
      country: new FormControl('', Validators.compose([ 
        Validators.required,
      ])),
      register_type: new FormControl('', Validators.compose([ 
        Validators.required,
      ])),
      address: new FormControl('', Validators.compose([ 
        Validators.required,
      ]))
     });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  signup(value){
    this.api.presentLoading();
    if(this.validations_form.invalid)
    {
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
      console.log("invalid condition");
      console.log(value);
      this.api.presentToast("Please enter all details");
    }
    else{
      console.log("else condition");
      console.log(value);
      var formdata = new FormData();
      localStorage.setItem('email', value.email);
      formdata.append("name", value.first_name+" "+value.last_name);
      formdata.append("email", value.email);
      formdata.append("mobile_no", value.mobile_no);
      formdata.append("password", value.password);
      formdata.append("city", value.city);
      formdata.append("state", value.state);
      formdata.append("country", value.country);
      formdata.append("register_type", value.register_type);
      formdata.append("address", value.address);
      this.api.Post(REGISTER,formdata).then(data=>{
        console.log(data);
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
        
        if(data['status']==406)
        {
          this.api.presentToast(data['success'])
        }
        else{
            this.router.navigate(['otp']);
        }
      }).catch(d=>{
        console.log(d);
        this.api.dismissLoading();
        this.api.presentToast("Please try again");
      })

    }
  }

  async open_modal(b){
    let modal;
    if(b){
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.terms_of_use, title: 'Terms of Use' }
      });
    }
    else{
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.privacy_policy, title: 'Privacy Policy' }
      });
    }
    return await modal.present();
  }

}
