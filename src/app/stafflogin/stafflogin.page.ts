import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LOGIN, PROFILE, STAFFLOGIN } from '../config';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-stafflogin',
  templateUrl: './stafflogin.page.html',
  styleUrls: ['./stafflogin.page.scss'],
})
export class StaffloginPage implements OnInit {

  
  validations_form: FormGroup;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private fun: FunctionsService,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private data: DataService,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private api:ApiService,
    private geolocation: Geolocation,
    private router:Router) {
      this.validations_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,  
          Validators.email,
        ])),
        password: new FormControl('', Validators.compose([  
          Validators.required,
        ]))
       });
       console.log("apiservice");
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }

  signin(value) {
    this.api.presentLoading();
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   console.log(resp);
    //   // alert(resp.coords.latitude)
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //  }).catch((error) => {
    //    console.log('Error getting location', error);
    //  });
     
    //  let watch = this.geolocation.watchPosition();
    //  watch.subscribe((data) => {
    //    console.log(data);
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //  });
    
    if(this.validations_form.invalid)
    {
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
      this.api.presentToast("Please enter all details");
    }
    else{
      
      var formdata = new FormData();
      formdata.append("email", value.email);
      formdata.append("password", value.password);
      formdata.append("one_singnal", '11');
      this.api.Login(STAFFLOGIN,formdata).then(data=>{
        console.log(data);
        this.api.setToken(data['success'].token);

        
          this.api.Post(PROFILE,{}).then(data=>{
            console.log(data);
            this.api.setUserInfo(data['data'][0]);
            setTimeout(() => {
              this.api.dismissLoading();
            }, 2000);
            this.api.updateCart();
            this.presentAlert();
            this.router.navigate(['landing']);
          }).catch(d=>{
            console.log(d)
            setTimeout(() => {
              this.api.dismissLoading();
            }, 2000);
          })

      }).catch(d=>{
         console.log(d);
         if(d['error'])
         {
            this.api.presentToast(d['error']['errors']);
         }
         else
         {
           this.api.presentToast("Please try again later");
         }
        setTimeout(() => {
          this.api.dismissLoading();
        }, 2000);
      })

    }

  }

  async open_modal(b) {
    let modal;
    if (b) {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.terms_of_use, title: 'Terms of Use' }
      });
    } else {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.privacy_policy, title: 'Privacy Policy' }
      });
    }
    return await modal.present();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Welcome',
      // subHeader: 'Subtitle',
      message: 'You are login as staff',
      buttons: ['OK']
    });

    await alert.present();
  }
}
