import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { CommonService } from '../Services/Common/common.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {

  userForm: FormGroup;
  ipData: any;
  showLoaderImg = false;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private alertService: CommonService,
    private route: ActivatedRoute,
    private http: HttpClient) {
    this.showLoaderImg = false;
  }
  

  ngOnInit() {

    this.userForm = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  public submitForm() {
    this.showLoaderImg = true;

    var frval = this.userForm.value;
    this.http.post(environment.api_url + 'user/sendpwd', frval).subscribe(response => {

      this.showLoaderImg = false;
      if (response["status"] == 200 && response["data"]) {
        this.alertService.presentToast('Password sent on Email');
        this.navCtrl.navigateRoot('/auth/login');
      }
      else {
        this.alertService.presentToast(response["message"]);
      }
    }, error => {
      this.showLoaderImg = false;
      this.alertService.presentToast('Error!');
    });

  }

}
