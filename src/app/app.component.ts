/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './data.service';
import { FunctionsService } from './functions.service';
import { ApiService } from './api/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  side_open = true;
  side_open1 = true;
  total_cart_product:any;
  public appPages = [
    { title: 'Home', url: '/landing', icon: 'home' },
    // { title: 'Search', url: '/search', modal: true, icon: 'search' },
    // { title: 'Notifications', url: '/notification', icon: 'notifications' },
    { title: 'Shopping Cart', url: '/cart', icon: 'cart' },
    { title: 'Order History', url: '/orders', icon: 'list' },
    { title: 'About Us', url: 'notificationssettings' ,icon:'contacts'},
    { title: 'Contact Us', url: 'emailsettings' ,icon:'call'},
    // { title: 'Wish Cash', url: '/landing', icon: 'wallet' },
    // { title: 'Rewards', url: '/rewards', icon: 'trophy' },
    // { title: 'Apply Promo', url: '/applypromo', icon: 'megaphone' }
  ];
  public appPages1 = [
    // { title: 'Customer Support', url: '/support', icon: 'people' },
   
    // { title: 'Settings', url: '/settings', icon: 'cog' },
    { title: 'Logout', url: 'login',icon:'power'}
    // { title: 'Logout', url: '/faqs', icon: 'help-circle' },
  ];
  


  colors = [
    'Bronze',
    'Black',
    'Blue',
    'Clear',
    'Gold',
    'Gray',
    'Green',
    'Multi-Color',
    'Orange',
    'Pink',
    'Red',
    'Silver',
    'White',
    'Yellow',
    'Brown',
    'Purple',
    'Beige'
  ];
user:any;
  menu(b){
    if(b){
      this.side_open = false;
      this.side_open1 = true;
    }
    else {
      this.side_open = false;
      this.side_open1 = false;
    }
  }

  back(){
    this.side_open = true;
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public dataService: DataService,
    public fun: FunctionsService,
    private api:ApiService,
    public navCtrl:NavController,
    private router:Router,
    private page: NavController
  ) {
    this.total_cart_product=this.api.total_cart_product;
    this.api.Cart_emitter.subscribe(data=>{
      this.total_cart_product=data;
    })
    this.user=this.api.getUserInfo();
    this.initializeApp();
  }
  logout(){
    this.api.presentToast("Logout successfuly");
    localStorage.clear();
    this.router.navigate(['login']);
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.backgroundColorByHexString('#ffffff');
      if(!this.api.getToken())
      {
        this.api.presentToast("Please Login");
        this.navCtrl.navigateRoot(['login']);
      }
      else
      {
         this.navCtrl.navigateRoot(['landing']);
        // this.navCtrl.navigateRoot(['cart']);
        //  this.navCtrl.navigateRoot(['productlist'],{queryParams:{id:8}});
        // this.navCtrl.navigateRoot(['productdetail'],{queryParams:{id:26,category_id:8}});
        // this.router.navigate(['/productdetail'],{queryParams:{id:26,category_id:8}})
      }
      // this.splashScreen.hide();
    });
  }
}
