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
import { MenuController, ModalController } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, Orders } from '../data.service';
import { OrderinfoPage } from '../orderinfo/orderinfo.page';
import { ApiService } from '../api/api.service';
import { imgUrl, ORDERHISTORY } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders: Array<Orders>;
 data:any;
 imgUrl=imgUrl;
  constructor(private menuCtrl: MenuController, private modalController: ModalController, private fun: FunctionsService,
     private dataService: DataService,private api:ApiService,private route:Router) {
      this.api.presentLoading();
    this.orders = dataService.orders;
    this.api.Get(ORDERHISTORY).then(data=>{
      console.log(data);
      if(data['status']==200){
        this.data=data['data'];
        console.log(this.data);
      }
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
    }).catch(d=>{
      console.log(d);
      if(d['status']==503)
      {
        this.api.presentToast("Please login");
        this.route.navigate(['login']);
      }
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
    })
   }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');
  }

  async open(order: Orders){
    let modal = await this.modalController.create({
      component: OrderinfoPage,
      componentProps: { value: order }
    });
    return await modal.present();
  }

}
