import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { RESETPASSWORD } from '../config';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {

  validations_form: FormGroup;
  
  constructor(private formBuilder: FormBuilder,private api:ApiService,private router:Router) {
    this.validations_form = this.formBuilder.group({
      password: new FormControl('', Validators.compose([  
        Validators.required,
      ]))
     });
   }

   Reset(value)
   {
        this.api.presentLoading();
        if(this.validations_form.invalid)
        {
          setTimeout(() => {
            this.api.dismissLoading();
          }, 2000);
          this.api.presentToast("Please enter all details");
        }
        else{
          var formdata = new FormData();
          formdata.append("email", localStorage.getItem('email'));
          formdata.append("password", value.password);
          this.api.Post(RESETPASSWORD,formdata).then(data=>{
            console.log(data);
            // this.api.setToken(data['success'].token);
            setTimeout(() => {
              this.api.dismissLoading();
            }, 2000);
           this.router.navigate(['login']);
          }).catch(d=>{
            console.log(d);
            this.api.dismissLoading();
            this.api.presentToast("Please try again");
          })

        }
   }
  ngOnInit() {
  }

}
