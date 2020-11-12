/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../data.service';
import { FunctionsService } from '../functions.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { imgUrl } from '../config';

@Component({
  selector: 'app-innerhome',
  templateUrl: './innerhome.component.html',
  styleUrls: ['./innerhome.component.scss'],
  inputs: ['recieved_data']
})
export class InnerhomeComponent implements OnInit {

  @Input() recieved_data: Array<Product>;
  @Input() recent_product;
  imgurl:any=imgUrl;
  constructor(private fun: FunctionsService, private nav: NavController,private router:Router) {
  }

  ngOnInit() {
  }

  open(id){
    // this.fun.update(data);
    this.router.navigate(['productdetail'],{queryParams:{id:id}});
  }

}
