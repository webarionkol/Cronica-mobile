import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { ADDUSER, CHECKOUT } from '../config';
import { DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import swal from 'sweetalert';
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.page.html',
  styleUrls: ['./adduser.page.scss'],
})
export class AdduserPage implements OnInit {
  validations_form: FormGroup;
  cart:any;
  checkout:boolean=false;
  checkoutObj={};
  user:any;
  constructor(private fun:FunctionsService, private menuCtrl: MenuController, private modalController: ModalController, private data: DataService,
    private formBuilder: FormBuilder,private api:ApiService,private router:Router,private route:ActivatedRoute) { 
      this.route.queryParams.subscribe(data=>{
        this.cart=JSON.parse(data['data']);
        this.validations_form = this.formBuilder.group({
          first_name: new FormControl('', Validators.compose([
            Validators.required,
          ])),
          last_name: new FormControl('', Validators.compose([
          ])),
          email: new FormControl(data.email, Validators.compose([
            Validators.required,  
            Validators.email,
          ])),
          mobile_no: new FormControl('', Validators.compose([ 
            Validators.required, 
          ])),
          password: new FormControl('', Validators.compose([  
            Validators.required,
          ])),
          city: new FormControl('', Validators.compose([ 
            Validators.required,
          ])),
          state: new FormControl('', Validators.compose([ 
            Validators.required,
          ])),
          country: new FormControl('', Validators.compose([ 
            Validators.required,
          ])),
        
          address: new FormControl('', Validators.compose([ 
            Validators.required,
          ])),
        pincode: new FormControl('', Validators.compose([ 
          Validators.required,
        ]))
         });
      })
  }

  addUser(value)
  {
    
    if(this.validations_form.invalid){
      this.api.presentToast("Please enter all details");
    }
    else{
      this.api.presentLoading();
      console.log(value);
      var formdata = new FormData();
      formdata.append("name", value.first_name+" "+value.last_name);
      formdata.append("email", value.email);
      formdata.append("mobile_no", value.mobile_no);
      formdata.append("password", value.password);
      formdata.append("city", value.city);
      formdata.append("state", value.state);
      formdata.append("country", value.country);
      formdata.append("address", value.address);
      formdata.append("pincode", value.pincode);
      this.api.Post(ADDUSER,formdata).then(data=>{
        console.log(data);
        if(data['status']==200)
        {
            this.checkout=true;
            this.user=data['user'];
            this.api.presentToast("User added successfully");
        }
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
      }).catch(d=>{
        console.log(d);
        if(d['status']==501)
        {
          this.api.presentToast("Please try again");
        }
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
