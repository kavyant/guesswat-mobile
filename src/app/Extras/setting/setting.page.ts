import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';

import { environment } from '../../../environments/environment';
import { CommonService } from 'src/app/Services/Common/common.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  	user: any;
	userForm: FormGroup;
	showLoaderImg = false;

	constructor(public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		private formBuilder: FormBuilder,
		private alertService: CommonService,		
		private route: ActivatedRoute,		
		private http: HttpClient,		
	) {		
	}

	ngOnInit() {

		this.user = JSON.parse(localStorage.getItem('currentUser'));
	}	

  	logout() {    	
    	localStorage.clear();
    	this.navCtrl.navigateRoot("/auth/login");
  	}
}
