/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 *
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart, DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { ModalController, IonList, NavController, MenuController, AlertController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { CART, CHECKOUT, imgUrl } from '../config';
import { Router } from '@angular/router';
import swal from 'sweetalert';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
user:any;
cart:any;
imgurl:any=imgUrl;
  @ViewChild('slidingList') slidingList: IonList;

  customAlertOptions: any = {
    header: 'Select Quantity',
    translucent: true
  };

  qty = [];
  code = '';
  show = true;
  data: Array<Cart> = [];
  checkoutObj={};
  constructor(
    private menuCtrl: MenuController,
    public dataService: DataService,
    public fun: FunctionsService,
    private modalController: ModalController,
    private nav: NavController,
    public alertController: AlertController,
    private api:ApiService,
    private route:Router) {
      this.api.presentLoading();
      this.user=this.api.getUserInfo();
      
      this.api.Get(CART+"/show?user_id="+this.user.id).then(data=>{
        console.log(data);
        if(data['status']==200)
        {
          this.cart=data['data'];
          this.checkoutObj["calculation"]={};
          this.checkoutObj["calculation"]["address"]=this.user.address+","+this.user.city+","+this.user.state+","+this.user.pincode+","+this.user.country;
          this.checkoutObj["calculation"]["userid"]=this.user.id;
          this.checkoutObj["calculation"]["paymentMode"]="cod";
          this.checkoutObj["calculation"]["data"]=this.cart;
        }
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
      }).catch(d=>{
        console.log(d);
        if(d.status==400)
        {
          this.cart=[];
        }
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
      })
    
    if (this.data.length === 0) { this.show = false; }
    for (let i = 1; i <= 36; i++) { this.qty.push(i); }
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  async open_modal(b) {
    let modal;
    if (b) {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.dataService.terms_of_use, title: 'Terms of Use' }
      });
    } else {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.dataService.privacy_policy, title: 'Privacy Policy' }
      });
    }
    return await modal.present();
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
  calculate(i) {
    let res = 0;
    if (i === 0) {
      for (const j of this.data) {
        if (j.product.offer) {
          res += this.fun.calculate(j.product.cost_price, j.product.discount) * j.quantity;
        } else {
          res += j.product.cost_price * j.quantity;
        }
      }
    }
    if (i === 1) {
      for (const j of this.data) {
        res += j.product.shipping;
      }
    }
    return res;
  }


  fix(a) {
    return a.toFixed(2);
  }

  add() {
    const res = this.calculate(1) + this.calculate(0);
    return res;
  }

  browse() {
    this.fun.navigate('/home', false);
  }

   remove(id) {
   console.log(id);
   this.api.presentLoading();
   this.api.Delete(CART+"/Delete?cart_id="+id+"&user_id="+this.user.id).then(data=>{
     console.log(data);
     if(data['status']==200)
     {
      this.api.updateCart();
       this.api.presentToast("Product deleted Successfully");
       
          
        this.api.Get(CART+"/show?user_id="+this.user.id).then(data=>{
          console.log(data);
          if(data['status']==200)
          {
            this.cart=data['data'];
            this.checkoutObj["calculation"]["data"]=this.cart;
          }
          setTimeout(() => {
            this.api.dismissLoading();
          }, 2000);
        }).catch(d=>{
          console.log(d);
          if(d.status==400)
          {
            this.cart=[];
            this.checkoutObj["calculation"]["data"]=this.cart;
          }
          setTimeout(() => {
            this.api.dismissLoading();
          }, 2000);
        })

        
     }
    
   }).catch(d=>{
     console.log(d);
     setTimeout(()=>{
      this.api.dismissLoading();
    },2000);
   })
  }
  updateCart(cart_id,type)
  {
    console.log(cart_id);
    console.log(type);
    var response=this.cart.find(x=>x.cart_id==cart_id);
    console.log(response);
    if(response.count==1&&type==-1)
    {
      console.log("if condition");
      this.remove(response.cart_id);
    }
    else
    {
      this.api.presentLoading();
      var count=Number(response.count)+Number(type);
      console.log(count);
      this.api.Put(CART+"/update?cart_id="+response.cart_id+"&user_id="+this.user.id+"&count="+count).then(data=>{
        console.log(data);
        if(data['status']==201)
        {
                  this.api.updateCart();
                  this.api.presentToast("Quantity updated Successfully");
                  this.api.Get(CART+"/show?user_id="+this.user.id).then(data=>{
                    console.log(data);
                    if(data['status']==200)
                    {
                      this.cart=data['data'];
                    }
                    setTimeout(() => {
                      this.api.dismissLoading();
                    }, 2000);
                  }).catch(d=>{
                    console.log(d);
                    if(d.status==400)
                    {
                      this.cart=[];
                    }
                    setTimeout(() => {
                      this.api.dismissLoading();
                    }, 2000);
                  })

        }
      }).catch(d=>{
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
        console.log(d);
      })
    }
  }
}
