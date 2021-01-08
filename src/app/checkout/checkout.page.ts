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
import { DataService } from '../data.service';
import { AlertController, MenuController } from '@ionic/angular';
import swal from 'sweetalert';
import { ApiService } from '../api/api.service';
import { CART, CHECKOUT } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  addNewPayment = false
  user:any;
  data:any;
  checkoutObj={};
  constructor(private menuCtrl: MenuController, private fun: FunctionsService,
     private dataService: DataService, private alertController: AlertController,
     private api:ApiService,private route:Router) { 
    this.api.presentLoading();
    this.user=this.api.getUserInfo();
    
    this.api.Get(CART+"/show?user_id="+this.user.id).then(data=>{
      if(data['status']==200)
      {
        this.data=data['data'];
        console.log(this.data);
        console.log(this.checkoutObj);
        this.checkoutObj["calculation"]={};
        this.checkoutObj["calculation"]["address"]=this.user.address+","+this.user.city+","+this.user.state+","+this.user.pincode+","+this.user.country;
        this.checkoutObj["calculation"]["userid"]=this.user.id;
        this.checkoutObj["calculation"]["paymentMode"]="cod";
        this.checkoutObj["calculation"]["data"]=this.data;
        console.log(this.checkoutObj);
      }
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
    }).catch(d=>{
      console.log(d);
      if(d.status==400)
      {
        this.data=[];
        this.route.navigate(['home'])
      }
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
    })

  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  addPayment(){
    this.addNewPayment = !this.addNewPayment;
  }

  done(){
    this.api.presentLoading();
    console.log("done function");
    this.api.Post(CHECKOUT,this.checkoutObj).then(data=>{
      console.log(data);
      setTimeout(() => {
        this.api.dismissLoading();
        if(data['status']==200)
        {
           swal("Awesome", "Order Placed successfully", "success");
           this.fun.navigate('home',false);
           this.api.updateCart();
        }
      }, 2000);
    }).catch(d=>{
      console.log(d);
      if(d['status']==503)
      {
        localStorage.clear();
      }
      setTimeout(() => {
        this.api.dismissLoading();
        this.api.presentToast("Please login");
        this.route.navigate(['login']);
      }, 2000);
    })
  }



  async back() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you want to cancel entering your payment info?',
      buttons: [
        {
          text: 'Yes',
          cssClass: 'mycolor',
          handler: (blah) => {
            this.fun.back();
          }
        }, {
          text: 'No',
          role: 'cancel',
          cssClass: 'mycolor',
          handler: () => {}
        }
      ]
    });

    await alert.present();
  }

}
