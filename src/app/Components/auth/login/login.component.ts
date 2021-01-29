import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { CommonService } from 'src/app/Services/Common/common.service';
// import { AuthService } from 'src/app/Services/Auth/auth.service';
import { environment } from 'src/environments/environment';
import { TranslateConfigService } from 'src/app/Services/translate-config.service';


declare var FB: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: any;
  userForm: FormGroup;
  ipData: any;
  showLoaderImg = false;
  selectedLanguage:string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private formBuilder: FormBuilder,
    private fb: Facebook, private alertService: CommonService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalController: ModalController, 
    private translate: TranslateConfigService) {
      this.selectedLanguage = this.translate.getDefaultLanguage();
      if (navigator.languages && navigator.languages.length) {
        this.selectedLanguage = navigator.languages[0]
        this.translate.setLanguage(this.selectedLanguage);
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        } else {
          this.selectedLanguage = 'en';
          this.translate.setLanguage(this.selectedLanguage);
        }
    }
   
    languageChanged(){
      this.translate.setLanguage(this.selectedLanguage);
    }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user && this.user['gameprofile']['email']) {
      this.navCtrl.navigateRoot('/index-afterlogin');
    }

    this.userForm = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.getIp();

    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: environment.fb_app_id,
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  getIp() {

    this.ipData = JSON.parse(localStorage.getItem('ipData'));
    if (this.ipData != null && this.ipData.city != "") {
      return true;
    }

    this.http.get<{ ip: string }>('https://jsonip.com').subscribe(data => {
      var ip = data.ip;
      this.http.post(environment.api_url + 'matchmaker/citybyip', { ip: ip }).subscribe(response => {
        this.ipData = response['data'];
        localStorage.setItem('ipData', JSON.stringify(this.ipData));
      });
    });
  }

  public submitForm() {
    this.showLoaderImg = true;
    var frval = this.userForm.value;
    const md5 = new Md5();
    frval.password = md5.appendStr(frval.password).end();
    this.http.post(environment.api_url + 'auth/login', frval).subscribe(response => {
      this.showLoaderImg = false;
      if (response["status"] == 200 && response["data"]['found'] == true) {
        let user: any = response["data"]["message"]['gameprofile']
        user['displayname'] = response["data"]["message"]['displayname'];
        user['dob'] = response["data"]["message"]['dob'];

        response["data"]["message"]['data'] = { user: user };
        localStorage.setItem('currentUser', JSON.stringify(response["data"]["message"]));
        this.navCtrl.navigateRoot('/index-afterlogin');
      }
      else {
        this.alertService.presentToast("Email and password does not match!");
      }
    }, error => {
      this.showLoaderImg = false;
      this.alertService.presentToast("Error on Login!");
    });
  }

  fbLogin() {
    FB.login((response) => {
      //console.log('submitLogin',response);
      if (response.authResponse) {
        //console.log(response.authResponse);
        this.http.post(environment.api_url + 'auth/fbdetails', { id: response.authResponse.userID, access_token: response.authResponse.accessToken }).subscribe(response => {
          response["data"]['_id'] = response["data"]['id'];
          var namearr = response["data"]["name"].split(" ");
          response["data"]['firstname'] = namearr[0];
          response["data"]['lastname'] = namearr[1];
          //console.log(response);
          if (response["data"] != null) {
            localStorage.setItem('currentUser', JSON.stringify(response["data"]));
            this.navCtrl.navigateRoot('/index-afterlogin');
          }
          else {
            this.alertService.presentToast(response["message"]);
          }
        });
      }
    });
  }

}
