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
import { FunctionsService } from '../functions.service';
import { DataService, Product, HomeTab } from '../data.service';
import { IonSlides, MenuController, NavController, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { CART, PRODUCTDETAIL } from '../config';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.page.html',
  styleUrls: ['./productdetail.page.scss'],
})
export class ProductdetailPage implements OnInit {

  category_id:any;
  user:any;
  @ViewChild('Slides') slides: IonSlides;
  @ViewChild('Content') content: IonContent;
  @ViewChild('slider') slider: IonSlides;

  index = 0;
  segment = '';
  slideOpts = {
    effect: 'flip',
    zoom: false
  };

  data: Array<HomeTab> = [];

  product: Product;
  product_detail:any;
  recent_product:any;
  constructor(
    private menuCtrl: MenuController,
    private fun: FunctionsService,
    private dataService: DataService,
    private nav: NavController,
    private route:ActivatedRoute,
    private api:ApiService) {
      this.user=this.api.getUserInfo();
      this.api.presentLoading();
    this.route.queryParams.subscribe(data=>{
      this.category_id=data.category_id;
      this.api.Put(PRODUCTDETAIL+"/"+data.id).then(data=>{
        console.log(data);
        this.segment="Overview";
        this.product_detail=data['data'];
        this.recent_product=data['recent_product'];
        console.log(this.product_detail);
        setTimeout(() => {
          this.api.dismissLoading();
        }, 1000);
      }).catch(d=>{
        console.log(d);
        setTimeout(() => {
          this.api.dismissLoading();
        }, 1000);
        this.api.presentToast("No Products");
      })
    })
    this.product = dataService.current_product;
    this.data = dataService.item_tab;
    this.segment = this.data[0].title;
    console.log(this.data);
    console.log(this.segment);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  async change() {
    await this.slides.getActiveIndex().then(d => this.index = d);
    this.segment = this.data[this.index].title;
    // this.drag();
  }

  onReviewClick(index) {
    this.segment = this.data[index].title;
    this.index = index;
    this.slides.slideTo(index);
    this.content.scrollToTop();
    this.drag();

  }

  goToCart() {
    // this.fun.navigate('cart', false);
    this.api.presentLoading();
    var obj={
      "data": [{
        "category": this.category_id,
        "count": 1,
        "productId": this.product_detail.id,
        "productName": this.product_detail.productname,
        "userid": this.user.id
      }]
    }
    
    this.api.Post(CART,obj).then(data=>{
      console.log(data);
      if(data['status']==200)
      {
        
        this.api.updateCart();
      }
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
    }).catch(d=>{
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
      console.log(d);
      this.api.presentToast("Product already exist to your cart");
    })
  }

  update(i) {
    this.slides.slideTo(i);
  }

  drag() {
    let distanceToScroll = 0;
    for (const index in this.data) {
      if (parseInt(index) < this.index) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  seg(event) {
    console.log(event);
    this.segment = event.detail.value;
  }

}
