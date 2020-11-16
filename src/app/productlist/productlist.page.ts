/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../data.service';
import { FunctionsService } from '../functions.service';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { imgUrl, PRODUCTLIST } from '../config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.page.html',
  styleUrls: ['./productlist.page.scss'],
  inputs: ['recieved_data']
})
export class ProductlistPage implements OnInit {

category_id:any;
products:any;
imgurl:any=imgUrl;
  constructor(private fun: FunctionsService, private nav: NavController,private api: ApiService,private route:ActivatedRoute,
    private router:Router) {
      this.api.presentLoading();
    this.route.queryParams.subscribe(data=>{
      // console.log("productlist page");
      // console.log(data.id);
      this.category_id=data.id;
      var formdata = new FormData();
      formdata.append("category_id", data.id);
      this.api.Post(PRODUCTLIST,formdata).then(data=>{
        // console.log(data);
        setTimeout(() => {
          this.api.dismissLoading();
        }, 1000);
        this.products=data['data'];
        console.log(this.products.length)
        if(this.products.length=='0'){
          this.api.presentToast("No Products");
        }
      }).catch(d=>{
        console.log(d);
        setTimeout(() => {
          this.api.dismissLoading();
        }, 1000);
        this.api.presentToast("No Products");
      })
    })
    
  }
  productdetail(id)
  {
    console.log(id);
    this.router.navigate(['productdetail'],{queryParams:{id:id,category_id:this.category_id}});
  }
  ngOnInit() {
  }


}
