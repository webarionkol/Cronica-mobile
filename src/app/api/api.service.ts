import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl, CART } from '../config';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @Output() Cart:EventEmitter<any> = new EventEmitter();
  @Output() Address:EventEmitter<any> = new EventEmitter();
 cart:any;
 location:any;
  constructor(public http: HttpClient, public toastController: ToastController,
    public loadingController: LoadingController,public alertController: AlertController,
    private route:Router) {
    
    }


  public Get(api) {
    // let header = new HttpHeaders().set("token",this.getToken());
    return new Promise((resolve, reject) => {
      // this.http.get(apiUrl + api,{headers:header})
      this.http.get(apiUrl + api)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public Post(api, formData) {
    // let header = new HttpHeaders().set("token",this.getToken());
    return new Promise((resolve, reject) => {
      // this.http.post(apiUrl + api, formData,{headers:header})
      this.http.post(apiUrl + api, formData)
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
    let header = new HttpHeaders().set("token",this.getToken());
    return new Promise((resolve, reject) => {
      this.http.delete(apiUrl + api,{headers:header})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
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
