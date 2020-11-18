import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl, CART } from '../config';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @Output() Cart_emitter:EventEmitter<any> = new EventEmitter();
  @Output() Address:EventEmitter<any> = new EventEmitter();
 cart:any;
 location:any;
 total_cart_product:any;
  constructor(public http: HttpClient, public toastController: ToastController,
    public loadingController: LoadingController,public alertController: AlertController,
    private route:Router) {
    if(localStorage.getItem('cart'))
    {
      this.total_cart_product=(this.getCart()).length;
    }
    }

    public Put(api){
      // let header = new HttpHeaders().set("token",this.getToken());
      let header = new HttpHeaders().set(
        "Authorization",
         'Bearer'+" "+this.getToken()
      );
      return new Promise((resolve, reject) => {
        this.http.put(apiUrl + api,{},{headers:header})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    }


  public Get(api) {
    // let header = new HttpHeaders().set("token",this.getToken());
    let header = new HttpHeaders().set(
      "Authorization",
       'Bearer'+" "+this.getToken()
    );
    return new Promise((resolve, reject) => {
      this.http.get(apiUrl + api,{headers:header})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public Post(api, formData) {
    // let header = new HttpHeaders().set("token",this.getToken());
    let header = new HttpHeaders().set(
      "Authorization",
       'Bearer'+" "+this.getToken()
    );
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + api, formData,{headers:header})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public Login(api, formData) {
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + api, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  public Delete(api){
    // let header = new HttpHeaders().set("token",this.getToken());
    let header = new HttpHeaders().set(
      "Authorization",
       'Bearer'+" "+this.getToken()
    );
    return new Promise((resolve, reject) => {
      this.http.delete(apiUrl + api,{headers:header})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateCart(){
    var user=this.getUserInfo();
    this.Get(CART+"/show?user_id="+user.id).then(data=>{
      console.log(data);
      if(data['status']==200)
      {
        this.total_cart_product=data['data'].length;
        localStorage.setItem('cart',JSON.stringify(data['data']));
        this.Cart_emitter.emit(this.total_cart_product);
      }
      
    }).catch(d=>{
      if(d.status==400)
          {
            localStorage.setItem('cart','');
            this.total_cart_product=0;
            this.Cart_emitter.emit(this.total_cart_product);
          }
      console.log(d);
     
    })
  }
  getCart()
  {
    if(localStorage.getItem('cart'))
    {
      return JSON.parse(localStorage.getItem('cart'));
    }
  }
  setUserInfo(value)
  {
    localStorage.setItem("userInfo",JSON.stringify(value));
  }

  getUserInfo()
  {
    return JSON.parse(localStorage.getItem("userInfo"));
  }



  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      // duration: 2000
    });
    await loading.present(); 
  }
  async dismissLoading()
  {
    this.loadingController.dismiss();
  }

  setToken(value)
  {
    localStorage.setItem('token',value);
  }
  getToken()
  {
    return localStorage.getItem('token');
  }
  
  cartView()
  {
        let token=this.getToken();
        this.Get(CART+'/'+token).then(data=>{
          console.log(data);
          this.cart=data;
      }).catch(d=>{
        console.log(d);
        if(d.status==400)
        {
          this.route.navigate(['/login']);
          this.presentToast("Please login");
        }
      })
 }

 navigate(route)
 {
   console.log("navigate function");
   this.route.navigate([route]);
 }

  async presentAlert(message) {
        const alert = await this.alertController.create({
          header: 'sorry!',
          // subHeader: 'Subtitle',
          message: message,
          buttons: [{
            text: 'ok',
            role: 'cancel',
            handler: () => {
            this.route.navigate(['home']);
            }
          }]
        });

        await alert.present();
  }

}
