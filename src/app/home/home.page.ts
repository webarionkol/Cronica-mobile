/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, ViewChild } from '@angular/core';
import { MenuController, IonSlides } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, HomeTab, Product } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { HOME, imgUrl } from '../config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  response_data:any;
  app_banners:any;
  categories:any;
  new_arrival:any;
  imgurl:any=imgUrl;

  @ViewChild('Slides') slides: IonSlides;

  segment = '';
  index = 0;
  
  data: Array<HomeTab> = [];
  sponsored: Array<Product> = [];
  product_data_1: Array<Product> = [];
  product_data_2: Array<Product> = [];
  product_data_3: Array<Product> = [];
  product_data_4: Array<Product> = [];
  product_data_5: Array<Product> = [];
  slideOpts = {
    effect: 'flip',
    zoom: false
  };
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
   };
  constructor(
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private fun: FunctionsService,
    private dataService: DataService,
    private api:ApiService,
    private router:Router) {
      this.api.Get(HOME).then(data=>{
        console.log(data);
        this.response_data=data['body'];
        this.response_data.forEach(element => {
          if(element.category=="app_banners")
          {
            this.app_banners=element.app_banners;
          }
          else if(element.category=="categories")
          {
            this.categories=element.categories;
          }
          else if(element.category=="new_arrival")
          {
            this.new_arrival=element.new_arrival;
          }
        });
        console.log(this.categories);
        console.log(this.new_arrival);
        console.log(this.app_banners);
      }).catch(d=>{
        console.log(d);
      })




    this.data = dataService.tabs;
    this.sponsored = dataService.sponsored;
    this.product_data_1 = dataService.products_1;
    this.product_data_2 = dataService.products_2;
    this.product_data_3 = dataService.products_3;
    this.product_data_4 = dataService.products_4;
    this.product_data_5 = dataService.products_5;
    const d = this.activatedRoute.snapshot.paramMap.get('id');
    if (d) {
      this.segment = this.data[parseInt(d, 10)].title;
    } else {
      this.segment = this.data[0].title;
    }
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  seg(event) {
    this.segment = event.detail.value;
  }

  drag() {
    let distanceToScroll = 0;
    for (let index in this.data) {
      if (parseInt(index) < this.index) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  preventDefault(e) {
    e.preventDefault();
  }

  async change() {
    await this.slides.getActiveIndex().then(data => this.index = data);
    this.segment = this.data[this.index].title;
    this.drag();
  }

  side_open() {
    this.menuCtrl.toggle('end');
  }

  update(i) {
    this.slides.slideTo(i).then((res) => console.log('responseSlideTo', res));
  }
}
