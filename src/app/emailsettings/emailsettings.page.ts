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
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { CONTACT } from '../config';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-emailsettings',
  templateUrl: './emailsettings.page.html',
  styleUrls: ['./emailsettings.page.scss'],
})
export class EmailsettingsPage implements OnInit {

  data:any;

  constructor(private menuCtrl: MenuController, private fun: FunctionsService,private api:ApiService) {
    this.api.presentLoading();
    this.api.Get(CONTACT).then(data=>{
      this.data=data['data'];
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
      console.log(data);
    }).catch(d=>{
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
      console.log(d);
    })
   }

  ngOnInit() {
  }
  
  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }

}
