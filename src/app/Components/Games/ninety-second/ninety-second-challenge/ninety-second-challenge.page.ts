import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from "socket.io-client";
import { timer } from 'rxjs';
import { AlertController, PopoverController, NavController, ModalController } from '@ionic/angular';
// import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ArenaService } from 'src/app/Services/Arena/arena.service';
import { CommonService } from 'src/app/Services/Common/common.service';
import { TenSecTimerComponent } from 'src/app/Extras/ten-sec-timer/ten-sec-timer.component';
import { EnvService } from 'src/app/Services/Env/env.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { GameOverComponent } from 'src/app/Extras/game-over/game-over.component';


@Component({
  selector: 'app-ninety-second-challenge',
  templateUrl: './ninety-second-challenge.page.html',
  styleUrls: ['./ninety-second-challenge.page.scss'],
})
export class NinetySecondChallengePage implements OnInit {


  socket: any;
  arenaId: string;
  arenaTitle: string;
  user;

  chatText: string = "";

  t1p1Msgs: Array<any> = [];
  t2p1Msgs: Array<any> = [];

  mainTimer: number = 100;
  subTimer: number = 90;

  serverMessages: Array<any> = [];
  t1p1: any = {};
  t2p1: any = {};
  arena: any = {};
  teams: Array<any> = [];


  mainWord: string = "Waiting for Word";
  displayWord: boolean = false;
  isSwap: boolean = false;
  isPopup: boolean = false;

  constructor(
    private router: ActivatedRoute,
    // public authService: AuthService,
    public arenaService: ArenaService,
    public commonService: CommonService,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController,
    public envService: EnvService,
    public modalCtrl: ModalController,
    public vibration: Vibration,
  ) {

    this.user = JSON.parse(localStorage.getItem('currentUser')).data.user;
    console.log(' User:', this.user)
    this.t1p1.role = "Clue Giver";
    this.t2p1.role = "Guesser";
    this.user.role = "Audience";
    this.router.params.subscribe(params => {
      this.arenaId = params['arenaId'];
      this.arenaTitle = params['arenaTitle'];
      this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
      this.socket.nsp = "/90sec";
      this.socket.emit("join90secroom", this.user.email, this.user.displayname, this.arenaId);
      this.arenaService.getArena(params['arenaTitle']).subscribe(temp => {

        console.log(this.arena)


        this.arena = temp.data[0];
        this.teams = temp.data[0].teams;
        this.teams.forEach(snap => {
          if (snap.teamId == "TEAMA" && snap.playerId == "PLAYER1") {
            this.t1p1 = snap;
            this.t1p1.role = "Clue Giver";
            this.assignRole();
          }
          if (snap.teamId == "TEAMB" && snap.playerId == "PLAYER1") {
            this.t2p1 = snap;
            this.t2p1.role = "Guesser";
            this.assignRole();
          }
          switch (this.user.email) {
            case this.t1p1.userId: this.user.role = "Clue Giver"
              break;
            case this.t2p1.userId: this.user.role = "Guesser"
              break;

            default: this.user.role = "Audience"
              break;
          }
          if (this.user.email == this.t2p1.userId) {
            this.isSwap = true;
          }
        })
      })


      this.socket.on("updatechat", (data1, data2) => {
        switch (data1) {
          case "SERVER": this.updateServer(data2)
            break;
          case "TEAMA_PLAYER1": this.updatet1p1Msgs(data2)
            break;
          case "TEAMB_PLAYER1": this.updatet2p1Msgs(data2)
            break;
          case "Score": this.gotScore(data2)
            break;
          case "Freezo": this.applyFreezo(data2)
            break;

          default: console.log("Checking Users", data2);
            break;
        }
      })
    })

  }



  ionViewDidLeave() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
  }


  updatet1p1Msgs(data) {
    if (this.user.email == this.t2p1.userId) {
      this.t1p1Msgs.push(data);
    } else {
      this.t2p1Msgs.push(data);
    }
  }

  updatet2p1Msgs(data) {
    if (this.user.email == this.t2p1.userId) {
      this.t2p1Msgs.push(data);
    } else {
      this.t1p1Msgs.push(data);
    }
  }


  updateServer(data) {
    if (data == "CORRECT") {
      this.mainWord = "Waiting for word"
      this.commonService.presentToast("Correct Answer")
      this.vibration.vibrate(1500);
    }
    if (data == "INCORRECT") {
      this.mainWord = "Waiting for word"
      this.commonService.presentToast("Wrong Answer")
      this.vibration.vibrate(1500);
    }

    if (data.includes("Powerpass has been applied")) {
      this.commonService.presentToast("Power pass has been applied")
    }


    if (data == "LOADING YOUR GAME") {
      this.mainClock(99, 90);
      this.tenSecPop();
    }

    if (data.includes("Your word is :")) {
      let temp = data.split("Your word is :");
      this.mainWord = temp[1];

      if (!this.isPopup) {

        if (this.user.role != "Guesser") {
          this.displayWord = true;
        }
      }

    }
    if (data.includes("Turn changed to")) {
      this.displayWord = false;
      this.mainWord = "";
      this.timer.unsubscribe();
      if (data.includes("TEAMA")) {
        this.t1p1.role = "Clue Giver";
        this.t2p1.role = "Guesser";
      }
      if (data.includes("TEAMB")) {
        this.t1p1.role = "Guesser";
        this.t2p1.role = "Clue Giver";
      }
      if (this.user.email == this.t1p1.userId) {
        this.user.role = "Guesser"
      } else {
        this.user.role = "Clue Giver"
      }
      this.mainClock(99, 90);
      this.tenSecPop();
    }
    if (data.includes("GAME OVER")) {
      this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
      this.socket.nsp = "/90sec";

      if (this.isMainTimer) {
        this.timer.unsubscribe();
      }
    }


    this.serverMessages.push(data);
  }

  gotScore(score) {
    this.gameOverPopUp(score);
  }


  ngOnInit() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
    this.socket.nsp = "/90sec";
  }


  assignRole() {
    return;
    // if (this.mainWord.length) {
    if (this.t1p1.email == this.user.email && this.t1p1.role == "Clue Giver") {
      this.displayWord = true;
    }

    if (this.t2p1.email == this.user.email && this.t2p1.role == "Clue Giver") {
      this.displayWord = true;
    }
  }

  sendChat() {
    this.socket.emit("sendchat", this.user.email, this.arenaId, this.chatText);
    this.chatText = "";
  }


  source = timer(0, 1000);
  isMainTimer = false;
  timer: any = {};
  mainClock(mainTimer, subTimer) {

    this.mainTimer = mainTimer;
    this.subTimer = subTimer;

    this.timer = {};
    this.source = timer(0, 1000);

    this.timer = this.source.subscribe(val => {
      this.isMainTimer = true;

      if (this.mainTimer > 0) {
        this.mainTimer = mainTimer - val;
      } else {
        this.timer.unsubscribe();
      }


      if (this.mainTimer < subTimer) {
        this.subTimer = this.mainTimer;
        if (this.freezoActived) {
          this.commonService.presentToast("Freezo Deactivated")
          this.freezoActived = false;
        }
      }

    });
  }


  async tenSecPop() {
    this.isPopup = true;
    const popover = await this.popoverCtrl.create({
      component: TenSecTimerComponent,
      translucent: true,
      backdropDismiss: false,
      componentProps: { gameName: "90 Second" }
    });

    popover.onDidDismiss().then(() => {
      this.isPopup = false;
      if (!this.displayWord) {
        if (this.user.role != "Guesser") {
          this.displayWord = true;
        }

      }
      this.assignRole();
    });

    return await popover.present();
  }

  async gameOverPopUp(score) {
    const popover = await this.popoverCtrl.create({
      component: GameOverComponent,
      translucent: true,
      backdropDismiss: false,
      componentProps: { "score": score, "arenaTitle": this.arenaTitle, "gameName": "90sec" },
    });
    popover.onDidDismiss().then(() => {
    });
    this.socket.emit("disjoin90secRoom");
    return await popover.present();
  }

  //Powers


  freezoActived: boolean = false;
  clickFreezo() {
    if (this.user.freezo) {
      this.socket.emit("freezo", this.user.email, this.arenaId, this.chatText);
      this.user.freezo = this.user.freezo - 1;
    } else {
      this.commonService.presentToast("You do not have enough freezos")
    }
  }

  applyFreezo(dur) {
    let dura = dur.a / 1000; 0
    this.timer.unsubscribe();
    this.freezoActived = true;
    this.commonService.presentToast("Freezo Activated")
    this.mainClock(this.mainTimer + dura, this.subTimer)
  }


  clickPowerPass() {
    console.clear();
    console.log('Number of passes :', this.user.pass)
    if (this.user.pass) {
      this.socket.emit("powerpass", this.user.email, this.arenaId, this.chatText);
      this.user.pass = this.user.pass - 1;
    } else {
      this.commonService.presentToast("You do not have enough Passes")
    }
  }

  applyPowerPass() {

  }
}
