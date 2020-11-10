import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { OTPVERIFIED } from '../config';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  validations_form: FormGroup;
  forget_otp_verify:boolean=false;
  constructor( private formBuilder: FormBuilder,private api:ApiService,private router:Router,private route:ActivatedRoute) { 
    this.validations_form = this.formBuilder.group({
      otp: new FormControl('', Validators.compose([
        Validators.required,
      ])),
     });
     this.route.queryParams.subscribe(data=>{
       if(data.email)
       {
         console.log(data.email);
         this.forget_otp_verify=true;
       }
       else
       {
         this.forget_otp_verify=false;
       }
       
     })
  }
  otp(value)
  {
    this.api.presentLoading();
    if(this.validations_form.invalid)
    {
      setTimeout(() => {
        this.api.dismissLoading();
      }, 2000);
        console.log("if condition");
        console.log(value);
        console.log(localStorage.getItem('email'));
    }
    else
    {
        console.log("else condition");
        console.log(value);
        var formdata = new FormData();
        formdata.append("email", localStorage.getItem('email'));
        formdata.append("otp", value.otp);
        this.api.Post(OTPVERIFIED,formdata).then(data=>{
          if(data['error'])
          {
              this.api.presentToast('Please try again');
          }
          else
          {
            if(this.forget_otp_verify==false)
            {
              this.router.navigate(['login']);
            }
            else
            {
              this.router.navigate(['forget']);
            }              
          }
          setTimeout(() => {
            this.api.dismissLoading();
          }, 2000);
          console.log(data);
        }).catch(d=>{
          this.api.dismissLoading();
          console.log(d);
        })
    }
  }
  ngOnInit() {
  }

}
