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
import { MenuController, NavController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { CART, imgUrl, PRODUCTLIST } from '../config';
import { ActivatedRoute, Router } from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
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
user:any;
search_data:any;
  constructor(private menuCtrl: MenuController,private fun: FunctionsService, private nav: NavController,private api: ApiService,private route:ActivatedRoute,
    private router:Router,private transfer: FileTransfer, private file: File, private iab: InAppBrowser) {
      this.user=this.api.getUserInfo();
      
    this.route.queryParams.subscribe(data=>{
      this.api.presentLoading();
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
        this.search_data=this.products;
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
  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }
  search(event)
  {
    console.log(event);
    if (!event){
      this.products=this.search_data;
    }
    else {
      this.products = this.search_data.filter(e => {
        var name = e.product_name.toLowerCase();
        var value = event.toLowerCase();
        return name.includes(value);  
      });
    }
  } 
  goToCart(product) {
    console.log("in go to cart function");
    console.log(product);
    this.api.presentLoading();
    var obj={
      "data": [{
        "category": product.category_id,
        "count": 1,
        "productId": product.product_id,
        "productName": product.product_name,
        "userid": this.user.id
      }]
    }
    
    this.api.Post(CART,obj).then(data=>{
      console.log(data);
      if(data['status']==200)
      {
        
        this.api.updateCart();
        this.api.presentToast("Product successfully added");
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
  productdetail(id)
  {
    console.log(id);
    this.router.navigate(['productdetail'],{queryParams:{id:id,category_id:this.category_id}});
  }
  view()
  {
    console.log("view function");
    const url = 'http://www.africau.edu/images/default/sample.pdf';
    const browser = this.iab.create(url, '_system');
  }
  download()
  {
    console.log("download function");
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://www.africau.edu/images/default/sample.pdf';
    fileTransfer.download(url, this.file.externalRootDirectory  + '/Download/').then((entry) => {
    console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
      console.log(error);
    });
  }
  ngOnInit() {
  }


}
