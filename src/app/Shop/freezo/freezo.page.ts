import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/Services/Common/common.service';
import { FreezoData } from "src/app/Shop/shopdata.model";
import { Admob, AdmobOptions } from '@ionic-native/admob/ngx';
@Component({
	selector: 'app-freezo',
	templateUrl: './freezo.page.html',
	styleUrls: ['./freezo.page.scss'],
})
export class FreezoPage implements OnInit {

	user: any;
	freezoData = FreezoData;
	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		private alertService: CommonService,
		private route: ActivatedRoute,
		private http: HttpClient,
		private admob: Admob) {
		//admob initialize
		const admobOptions: AdmobOptions = {
			publisherId: 'XXX-XXXX-XXXX',
			interstitialAdId: 'XXX-XXXX-XXXX',
			rewardedAdId: 'XXX-XXXX-XXXX',
			isTesting: true,
			autoShowBanner: false,
			autoShowInterstitial: false,
			autoShowRewarded: false,
			adSize: this.admob.AD_SIZE.BANNER
		};

		// Set admob options
		this.admob.setOptions(admobOptions)
			.then(() => console.log('Admob options have been successfully set'))
			.catch(err => console.error('Error setting admob options:', err));

		this.admob.createBannerView()
			.then(() => console.log('Banner ad loaded'))
			.catch(err => console.error('Error loading banner ad:', err));

		this.admob.requestRewardedAd()
			.then(() => console.log('Rewarded ad loaded'))
			.catch(err => console.error('Error loading rewarded ad:', err));

	}

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('currentUser'));
	}
	watchRewardVideo() {
		this.admob.onAdOpened().subscribe(() => console.log('Interstitial ad opened'));
	}
	changeAmount(scheme, value, coins) {

		var frval: any = {};
		frval.email = this.user.gameprofile.email;
		frval.scheme = scheme;
		this.http.post(environment.api_url + 'economy/buyfreezo', frval).subscribe(response => {
			this.user.gameprofile.freezo = this.user.gameprofile.freezo + value;
			this.user.gameprofile.coins = this.user.gameprofile.coins - coins;
			localStorage.setItem('currentUser', JSON.stringify(this.user));

			this.alertService.presentToast("Time Freezer Purchased Successfully.");
			this.navCtrl.navigateRoot('/index-afterlogin');
		}, error => {
			this.alertService.presentToast("Error in Time Freezer purchasing.");
			this.navCtrl.navigateRoot('/index-afterlogin');
		});
	}

	disableSort() {
		return 0;
	}

}
