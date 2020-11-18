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
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { imgUrl } from '../config';
import { Orders } from '../data.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-orderinfo',
  templateUrl: './orderinfo.page.html',
  styleUrls: ['./orderinfo.page.scss'],
})
export class OrderinfoPage implements OnInit {

  order: any;
  imgUrl=imgUrl;
  user:any;
  constructor(private modalController: ModalController, private params: NavParams, private fun: FunctionsService,private api:ApiService) {
    this.order = params.get('value');
    this.user=this.api.getUserInfo();
  }

  ngOnInit() {
  }

  dismiss(){
    this.modalController.dismiss();
  }

}
