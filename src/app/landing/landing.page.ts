import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private menuCtrl: MenuController,private fun: FunctionsService, private page: NavController) {
    
   }
   ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }
  ngOnInit() {
  }
  logout(){
    localStorage.clear();
    this.page.navigateRoot('/login');
  }
}
