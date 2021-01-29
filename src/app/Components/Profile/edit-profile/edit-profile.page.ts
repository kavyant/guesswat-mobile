import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';

import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/Services/Common/common.service';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.page.html',
	styleUrls: ['./edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {

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
		this.showLoaderImg = false;
	}

	ngOnInit() {

		this.user = JSON.parse(localStorage.getItem('currentUser')).data.user;

		this.userForm = new FormGroup({
			'displayname': new FormControl(this.user.displayname, [
				Validators.required,
				Validators.minLength(3),
			]),
			'dob': new FormControl(this.user.dob && this.user.dob.slice(0, 10), [
				Validators.required,
			]),
			'gender': new FormControl(this.user.gender, [
				Validators.required,
			]),
			'password': new FormControl('', [
				//Validators.required,
				//Validators.minLength(6),        
			]),
			'confirm_password': new FormControl('', [
				//Validators.required,
				//Validators.minLength(6),        		        
			]),
		}, ValidateConfirmPassword);
	}

	public submitForm() {

		if (this.userForm.valid) {
			var frval = this.userForm.value;
			frval.email = this.user.gameprofile.email;
			delete frval.confirm_password;

			if (frval.password == "") {
				delete frval.password;
			}
			else {
				const md5 = new Md5();
				frval.password = md5.appendStr(frval.password).end();
			}

			this.http.post(environment.api_url + 'user/update', frval).subscribe(response => {
				if (response["data"] != null) {
					this.user.displayname = frval.displayname;
					this.user.dob = frval.dob;
					this.user.gender = frval.gender;
					localStorage.setItem('currentUser', JSON.stringify(this.user));

					this.alertService.presentToast("Profile Updated Successfully.");
					this.navCtrl.navigateRoot('/profile');
				}
				else {
					this.alertService.presentToast("Error in Updating Profile.");
				}
			}, error => {
				this.alertService.presentToast(error.error.message);
			});
		} else {
			this.validateAllFormFields(this.userForm);
		}

	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

}


export function ValidateConfirmPassword(findForm: FormControl) {

	if (findForm["controls"].password.value == findForm["controls"].confirm_password.value) {
		return null;
	}
	return { validConfirmPassword: true };
}