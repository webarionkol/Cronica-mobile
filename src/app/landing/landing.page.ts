import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private fun: FunctionsService, private page: NavController) {
    
   }

  ngOnInit() {
  }
  logout(){
    localStorage.clear();
    this.page.navigateRoot('/login');
  }
}
