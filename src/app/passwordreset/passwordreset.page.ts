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
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { FORGETPASSWORD } from '../config';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.page.html',
  styleUrls: ['./passwordreset.page.scss'],
})
export class PasswordresetPage implements OnInit {
  
  validations_form: FormGroup;
  constructor(private fun: FunctionsService, private menuCtrl: MenuController,
    private formBuilder: FormBuilder,private api:ApiService,private router:Router) { 
      this.validations_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,  
          Validators.email,
        ])),
       });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  reset(value){
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
      this.api.Post(FORGETPASSWORD,formdata).then(data=>{
        console.log(data);
        // this.api.setToken(data['success'].token);
        if(data['error'])
        {
          this.api.presentToast(data['error']);
        }
        else
        {
          console.log("else condition");
          localStorage.setItem('email', value.email);
          this.router.navigate(['otp'],{queryParams:{email:"forget_password"}});
        }
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
      }).catch(d=>{
        console.log(d);
        this.api.dismissLoading();
        this.api.presentToast(d.error.errors);
      })

    }

  }

}
