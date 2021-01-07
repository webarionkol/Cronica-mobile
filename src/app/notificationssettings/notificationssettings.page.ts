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
import { ApiService } from '../api/api.service';
import { ABOUT } from '../config';


@Component({
  selector: 'app-notificationssettings',
  templateUrl: './notificationssettings.page.html',
  styleUrls: ['./notificationssettings.page.scss'],
})
export class NotificationssettingsPage implements OnInit {
  data:any;
  constructor(private fun: FunctionsService, private menuCtrl: MenuController,private api:ApiService) {
    this.api.presentLoading();
    this.api.Get(ABOUT).then(data=>{
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
