import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/Services/Common/common.service';
import { ReverseData } from "src/app/Shop/shopdata.model";

@Component({
	selector: 'app-reverse',
	templateUrl: './reverse.page.html',
	styleUrls: ['./reverse.page.scss'],
})
export class ReversePage implements OnInit {

	user:any;
	reverseData = ReverseData;  

  	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
	    public toastCtrl: ToastController,	    
	    private alertService: CommonService,
	    private route: ActivatedRoute,
	    private http: HttpClient) {	
 	}

 	ngOnInit() {					
		this.user = JSON.parse(localStorage.getItem('currentUser'));
	}

	changeAmount(scheme,value,coins){		
		var frval:any= {};
		frval.email = this.user.gameprofile.email;
		frval.scheme = scheme;		
		this.http.post(environment.api_url+'economy/buyreverse',frval).subscribe(response => {
			this.user.gameprofile.reverse = this.user.gameprofile.reverse + value;
			this.user.gameprofile.coins = this.user.gameprofile.coins - coins;
   			localStorage.setItem('currentUser', JSON.stringify(this.user));
   			
   			this.alertService.presentToast("Reverse Purchased Successfully.");
			this.navCtrl.navigateRoot('/index-afterlogin');
		},error => {
			this.alertService.presentToast("Error in Reverse purchasing.");
			this.navCtrl.navigateRoot('/index-afterlogin');
		});		
	}	

	disableSort(){
  		return 0;
  	}

}
