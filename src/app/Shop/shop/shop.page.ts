import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
//import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/Services/Common/common.service';
import { ShopData } from "src/app/Shop/shopdata.model";

@Component({
	selector: 'app-shop',
	templateUrl: './shop.page.html',
	styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

	user:any;
	shopData = ShopData;
	public payPalConfig?: IPayPalConfig;
	currency ='USD';
	scheme ='START';
	price = '0.99';
	coins=0;
	payModel = false;	  

  	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
	    public toastCtrl: ToastController,	    
	    private alertService: CommonService,
	    private route: ActivatedRoute,
	    //private iap: InAppPurchase,
	    private http: HttpClient) {	
 	}

 	ngOnInit() {					
		this.user = JSON.parse(localStorage.getItem('currentUser'));

		this.initConfig();
	}	

	private initConfig(): void {		

		this.payPalConfig = {
			currency: this.currency,
			clientId: environment.paypal_client_id,
			createOrderOnClient: (data) => <ICreateOrderRequest>{
				intent: 'CAPTURE',
				purchase_units: [
				{
					amount: {
						currency_code: this.currency,
						value: this.price,						
					},					
				}
				]
			},
			advanced: {
				commit: 'true'
			},
			style: {
				label: 'paypal',
				layout: 'vertical'
			},
			onApprove: (data, actions) => {
				/*console.log('onApprove - transaction was approved, but not authorized', data, actions);
				actions.order.get().then(details => {
					console.log('onApprove - you can get full order details inside onApprove: ', details);
				}); */				            
			},
			onClientAuthorization: (data) => {
				//console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
				//this.showSuccess = true;
				var frval:any= {};
				frval.email = this.user.gameprofile.email;
				frval.scheme = this.scheme;		
				this.http.post(environment.api_url+'economy/buycoins',frval).subscribe(response => {
					this.user.gameprofile.coins = this.user.gameprofile.coins + this.coins;
   					localStorage.setItem('currentUser', JSON.stringify(this.user));
				});

   				this.alertService.presentToast("Coin Purchased Successfully.");
				this.navCtrl.navigateRoot('/index-afterlogin');
			},
			onCancel: (data, actions) => {
				this.alertService.presentToast("Error in Payment!");
				this.payModel = false;				
				//console.log('OnCancel', data, actions);
			},
			onError: err => {
				this.alertService.presentToast("Error in Payment!");
				this.payModel = false;
				//console.log('OnError', err);
			},
			onClick: (data, actions) => {
				//console.log('onClick', data, actions);								
			},
		};
	}

	buyCoin(scheme,value,coins){

		var frval:any= {};
		frval.email = this.user.gameprofile.email;
		frval.scheme = scheme;		
		this.http.post(environment.api_url+'economy/buycoins',frval).subscribe(response => {						
			this.user.gameprofile.coins = this.user.gameprofile.coins + coins;
   			localStorage.setItem('currentUser', JSON.stringify(this.user));
   			
   			this.alertService.presentToast("Coin Purchased Successfully.");
			this.navCtrl.navigateRoot('/index-afterlogin');
		},error => {
			this.alertService.presentToast("Error in Coin purchasing.");
			this.navCtrl.navigateRoot('/index-afterlogin');
		});
	}	

	buyCoinPaypal(scheme,price,coins){		
		//this.currency = currency;
		this.price = price;
		this.coins = coins;
		this.scheme = scheme;
		this.initConfig();
		this.payModel = true;				
	}

	changeCountry(currency){
		this.currency = currency;
	}

	closePayModel()
	{
		this.payModel = false;				
	}

	disableSort(){
  		return 0;
  	}
}
