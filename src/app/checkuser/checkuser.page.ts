import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { CHECKOUT, CHECKUSER } from '../config';
import { DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import swal from 'sweetalert';
@Component({
  selector: 'app-checkuser',
  templateUrl: './checkuser.page.html',
  styleUrls: ['./checkuser.page.scss'],
})
export class CheckuserPage implements OnInit {

  validations_form: FormGroup;
email:any;
cart:any;
checkoutObj={};
user:any;
checkout:boolean=false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private fun: FunctionsService,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private data: DataService,
    private formBuilder: FormBuilder,
    private api:ApiService,
    private router:Router,
    private route:ActivatedRoute) {

      this.route.queryParams.subscribe(data=>{
        this.cart=JSON.parse(data['data']);
        console.log(this.cart);
      })

      this.validations_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,  
          Validators.email,
        ]))
       });
  }

  submit(value)
  {
    if(this.validations_form.invalid){
      this.api.presentToast("Please enter all details");
    }
    else
    {
          this.api.presentLoading();
          this.email=value.email;
          console.log(value);
          this.api.Get(CHECKUSER+'?email='+value.email).then(data=>{
      
              console.log(data);
              setTimeout(() => {
                this.api.dismissLoading();
              }, 2000);

              if(data['status']==1)
              {
                this.checkout=true;
                this.user=data['data'];
                 this.api.presentToast("User already exist");
              }
              else if(data['status']==0)
              {
                  this.checkout=false;
                  this.router.navigate(['adduser'],{queryParams:{email:this.email,data:JSON.stringify(this.cart)}});
              }
      
          }).catch(d=>{
      
            console.log(d);
            setTimeout(() => {
              this.api.dismissLoading();
            }, 2000);
          })
    }
  }

  placeOrder()
  {
    this.api.presentLoading();
    this.checkoutObj["calculation"]={};
    this.checkoutObj["calculation"]["address"]=this.user.address+","+this.user.city+","+this.user.state+","+this.user.pincode+","+this.user.country;
    this.checkoutObj["calculation"]["userid"]=this.user.id;
    this.checkoutObj["calculation"]["paymentMode"]="cod";
    this.checkoutObj["calculation"]["data"]=this.cart;
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
        this.router.navigate(['login']);
      }, 2000);
    })
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }

 
  ngOnInit() {
  }

}
