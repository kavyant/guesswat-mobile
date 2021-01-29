import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { DatePicker } from '@ionic-native/date-picker/ngx';
import { Md5 } from 'ts-md5/dist/md5';

import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/Services/Common/common.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { AuthService } from 'src/app/Services/Auth/auth.service';
// import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/Services/translate-config.service';
import { $ } from 'protractor';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  userForm: FormGroup;
  ipData: any;
  showLoaderImg = false;
  imageURI: any;
  imageFileName: any;
  selectedLanguage:string;

  showdob:boolean = true;
  showButton: boolean = false;
  showPage3:boolean = false;
  showPage4: boolean = false;
  showPage5: boolean = false;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private alertService: CommonService,
    // private authenticationService: AuthService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private http: HttpClient,
    private camera: Camera,
    private transfer: FileTransfer,
    private translate: TranslateConfigService
    // private datepicker: DatePicker 
  ) {
    this.showLoaderImg = false;  
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

    this.ipData = JSON.parse(localStorage.getItem('ipData'));

    this.userForm = new FormGroup({
      'displayname': new FormControl('', [
        Validators.required,
      ]),
      'email': new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      // this.isEmailUnique.bind(this)),
      'gender': new FormControl('', [
        Validators.required,
      ]),
      'dob': new FormControl('', [
        Validators.required,
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      'confirm_password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    }, ValidateConfirmPassword);

  }
  
  public continueForm() {
    console.log(this.userForm.value.dob);
    
    if(this.userForm.value.dob){
      this.showdob = false;
      this.showButton = true;
    }
    if(this.userForm.value.gender && this.userForm.value.displayname) {
      this.showPage3 = false;
      this.showPage4 = true;
      this.showButton = false;
    }
  }

  public continueFormPage() {
    this.showButton = false;
    this.showPage3 = true;
  }

  public continueFormEmail() {
    this.showPage5 = true;
    this.showPage4 = false;
  } 

  public submitForm() {

    this.showLoaderImg = true;
    if (this.userForm.valid) {
      var frval = this.userForm.value;
      const md5 = new Md5();
      frval.password = md5.appendStr(frval.password).end();
      frval.name = frval.displayname;
      if (this.ipData) {
        frval.lat = this.ipData.lat;
        frval.lon = this.ipData.lon;
        frval.city = this.ipData.city;
        frval.state = this.ipData.state;
        frval.country = this.ipData.country;
      }
      this.http.post(environment.api_url + 'auth/register', frval).subscribe(response => {
        this.showLoaderImg = false;
        if (response["status"] == 200) {
          this.alertService.presentToast("Thank you for your Registration! Your Account is created Successfully, Now you can login on site using your email and password.");
          this.navCtrl.navigateRoot('/auth/login');
        }
        else {
          this.alertService.presentToast(response["message"]);
        }
      }, error => {
        this.showLoaderImg = false;
        this.alertService.presentToast(error.error.message);
      });
    } else {
      this.showLoaderImg = false;
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

  isEmailUnique(control: FormControl) {

    return this.http.get(environment.api_url + 'user/chkemail/' + control.value);
  }

}

export function ValidateConfirmPassword(findForm: FormControl) {

  if (findForm["controls"].password.value == findForm["controls"].confirm_password.value) {
    return null;
  }
  return { validConfirmPassword: true };
}
