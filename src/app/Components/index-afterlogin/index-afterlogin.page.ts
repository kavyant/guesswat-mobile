import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController, NavController, ModalController, LoadingController } from '@ionic/angular';
// import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { FacebookLoginResponse, Facebook } from '@ionic-native/facebook/ngx';
import * as io from "socket.io-client";
import { ArenaSearchComponent } from 'src/app/Extras/arena-search/arena-search.component';
import { ArenaService } from 'src/app/Services/Arena/arena.service';
import { CommonService } from 'src/app/Services/Common/common.service';
// import { AuthService } from 'src/app/Services/Auth/auth.service';
import { EnvService } from 'src/app/Services/Env/env.service';
import { SoundService } from 'src/app/Services/Sound/sound.service';


@Component({
  selector: 'app-index-afterlogin',
  templateUrl: './index-afterlogin.page.html',
  styleUrls: ['./index-afterlogin.page.scss'],
})
export class IndexAfterloginPage implements OnInit {
  @ViewChild('slider', { static: true }) slides: IonSlides;
  @ViewChild('slider2', { static: true }) slides2: IonSlides;
  @ViewChild('slider3', { static: true }) slides3: IonSlides;

  arenaName: string;

  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };

  sliderConfig2 = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };

  sliderConfig3 = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };

  title: string;
  username = '';
  data: any;
  user: any;

  socket: any;
  testing: boolean = false;

  constructor(
    public arenaService: ArenaService,
    private commonService: CommonService,
    private _ALERT: AlertController,
    private navCtrl: NavController,
    private fb: Facebook,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public soundService: SoundService,
    public envService: EnvService,
  ) {


    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.testing) {
      this.autoMate();
    }
  }

  ngOnInit() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
  }

  ionViewWillEnter() {
    // this.soundService.playAudio('06 5-4-3-2-1 for ending', true)
  }



  ionViewWillLeave() {
  }
  swipeNext() {
    this.slides.slideNext();
  }
  swipeNext3() {
    this.slides3.slideNext();
  }
  swipeNext2() {
    this.slides2.slideNext();
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  slidesDidLoad2(slides2: IonSlides) {
    slides2.startAutoplay();
  }

  slidesDidLoad3(slides3: IonSlides) {
    slides3.startAutoplay();
  }

  async arenaOptions() {

    const alert = await this._ALERT.create({
      cssClass: 'alertArenas',
      subHeader: '',
      buttons: [
        {
          text: 'Create Arena',
          handler: data => {
            this.createArenaOption();
          }
        },
        {
          text: 'Join Arena',
          handler: data => {
            this.searchArena();
          }
        },
      ]
    });
    await alert.present();
  }

  async createArenaOption() {
    // this.socket.connect();
    const alert = await this._ALERT.create({
      header: 'Create Arena',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: ' Arena Name'
        }
      ],
      cssClass: 'alertCancel',
      buttons: [
        {
          text: '',
          handler: data => {
            this.arenaName = data.username;
            if (data.username.length < 5 || data.username.length > 30) {
              this.commonService.presentToast("Arena name not valid");
            } else {
              this.createArena();
            }
          }
        },
      ]
    });

    await alert.present();
  }

  joinArena(arenaId, arenaName) {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
    this.socket.nsp = "/selectionarena";
    this.socket.emit('joingameroom', this.user.data.user.email, arenaId, this.user.displayname, "", "");
    this.socket.emit('addusertoteam', this.user.data.user.email, arenaId, this.user.displayname, "TEAMA", "PLAYER1");
    if (this.testing) {
      this.navCtrl.navigateRoot(`/arena-room/${arenaName}`);
    } else {
      this.socket.on('updateConnectionsList', data => {
        if (data.length) {
          this.navCtrl.navigateRoot(`/arena-room/${arenaName}`);
          this.dismiss();
        } else {
          this.commonService.presentToast(data.message);
        }
      });
    }
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      message: 'Creating Arena...',
      translucent: true,
    });
    return await loading.present();
  }
  async searchArena() {
    const modal = await this.modalCtrl.create({
      component: ArenaSearchComponent
    });
    return await modal.present();

  }


  createArena() {
    this.present();
    this.arenaService.createArena(this.arenaName, this.user.data.user.email).subscribe(snap => {
      if (snap.message == "Arena created.") {
        this.joinArena(snap.data._id, snap.data.title);
      } else {
        this.dismiss();
        this.commonService.presentToast(snap.message);
        this.createArenaOption();
      }
    })
  }


  gtCoins() {
    this.navCtrl.navigateRoot('/buy/shop');
    this.soundService.playAudio('15Earningcoins', true)
  }


  loginFB() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.commonService.presentToast('Logged into Facebook!' + " " + res);
        this.navCtrl.navigateRoot('/index-afterlogin');
      })
      .catch(e => this.commonService.presentToast('Error logging into Facebook' + " " + e));
  }




  isLoading = false;

  loader: any;

  async present() {
    this.isLoading = true;
    this.loader = await this.loadingCtrl.create({
      message: 'Creating Arena',
    })
    this.loader.present();
  }

  async dismiss() {
    this.isLoading = false;
    await this.loader.dismiss();
  }


  //Testing Autmations



  autoMate() {
    if (this.user.data.user.email == "techarqam@gmail.com") {
      let testArenaTitle = this.arenaNameGenerator(6);
      this.createArenaTest(testArenaTitle)
    } else {
      this.searchArena();
    }
  }







  createArenaTest(arenaName) {
    this.arenaService.createArena(arenaName, this.user.data.user.email).subscribe(snap => {
      if (snap.message == "Arena created.") {
        // console.log(snap)
        this.joinArena(snap.data._id, snap.data.title);
      }
    })
  }





  arenaNameGenerator(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
