import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from "socket.io-client";
import { timer } from 'rxjs';
import { AlertController, PopoverController, NavController } from '@ionic/angular';
// import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ArenaService } from 'src/app/Services/Arena/arena.service';
import { CommonService } from 'src/app/Services/Common/common.service';
import { TenSecTimerComponent } from 'src/app/Extras/ten-sec-timer/ten-sec-timer.component';
import { EnvService } from 'src/app/Services/Env/env.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { GameOverComponent } from 'src/app/Extras/game-over/game-over.component';

@Component({
  selector: 'app-password-play',
  templateUrl: './password-play.page.html',
  styleUrls: ['./password-play.page.scss'],
})
export class PasswordPlayPage implements OnInit {
  socket: any;
  user: any = {};

  arenaId: string;
  arenaTitle: string;
  arena: any = {};

  teams: Array<any> = [];
  localTeams: Array<any> = [];

  t1p1: any = {};
  t1p2: any = {};
  t2p1: any = {};
  t2p2: any = {};

  chatText: string = "";

  t1p1Msgs: any = [];
  t2p1Msgs: any = [];
  t1p2Msgs: any = [];
  t2p2Msgs: any = [];

  swapTeam: boolean = false;
  swapPlayer: boolean = false;

  activeTeam: string = "TEAMA";

  mainWord: string = "";
  displayWord: boolean = false;

  //Timer Declares
  // source = timer(0, 1000);
  // isMainTimer = false;
  // timer: any = {};
  // mainTimer: number = 20;
  // subTimer: number = 20;



  gtIndex() {
    this.navCtrl.navigateRoot(`/index-afterlogin`);
  }

  constructor(
    private router: ActivatedRoute,
    // public authService: AuthService,
    public arenaService: ArenaService,
    public commonService: CommonService,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController,
    public envService: EnvService,
    public vibration: Vibration,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser')).data.user;
    this.router.params.subscribe(params => {
      this.arenaId = params['arenaId'];
      this.arenaTitle = params['arenaTitle'];
      this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
      this.socket.nsp = "/password";
      this.socket.emit("joinpasswordroom", this.user.email, this.user.displayname, this.arenaId, this.arenaTitle);

      this.arenaService.getArena(params['arenaTitle']).subscribe(temp => {
        console.log(temp)
        this.arena = temp.data[0];
        this.teams = temp.data[0].teams;
        this.assignPlayerPositions();
      });
      this.socket.on("updatechat", (data1, data2) => {
        console.log(data1, ":", data2);
        switch (data1) {
          case "SERVER": this.updateServer(data2)
            break;
          case "TEAMA_PLAYER1": this.t1p1Msgs.push(data2);
            break;
          case "TEAMA_PLAYER2": this.t1p2Msgs.push(data2);
            break;
          case "TEAMB_PLAYER1": this.t2p1Msgs.push(data2);
            break;
          case "TEAMB_PLAYER2": this.t2p2Msgs.push(data2);
            break;
          case "Score": this.gotScore(data2)
            break;
          // case "ROLES": this.assignRoles(data2);
          //   break;

          // default: console.log("Checking Users", data2);
          // break;
        }
      })
    })
  }

  sendChat() {
    this.socket.emit("sendchat", this.user.email, this.arenaId, this.chatText);
    this.chatText = "";
  }


  updateServer(msg) {
    if (msg == "LOADING YOUR GAME") {
      this.t1p1.role = "Clue Giver"
      this.t1p2.role = "Guesser"
      this.t2p1.role = "Clue Giver"
      this.t2p2.role = "Guesser"
      this.userRole();
      // this.timer.unsubscribe();
      this.mainClock(29, 20);
      this.tenSecPop();
    }
    if (msg.includes("Your word is :")) {

      this.displayWord = false;
      let temp = msg.split("Your word is :");
      this.mainWord = temp[1];
      if (this.user.role == "Clue Giver") {
        this.displayWord = true;
      }
    }

    if (msg.includes("TURN CHANGED TO")) {
      this.displayWord = false;
      this.timer.unsubscribe();
      // this.mainClock(20,20);
      if (msg.includes("TEAMA")) {
        console.log("includes teamA")
        this.activeTeam = "TEAMA";
        this.mainClock(20, 20)
        this.userRole();
      }
      if (msg.includes("TEAMB")) {
        console.log("includes teamb")
        this.mainClock(20, 20)
        this.activeTeam = "TEAMB";
        this.userRole();
      }
    }

    if (msg.includes("Word Receivers")) {
      let temp = msg.split("Word Receivers");
      let temp1 = temp[1];
      let temp2 = temp1.split(",");
      console.log("recievers", temp2)
    }


    if (msg == "CORRECT") {
      this.mainWord = "Waiting for Word"
      this.commonService.presentToast("Correct Answer")
      this.vibration.vibrate(1500);
    }
    if (msg == "INCORRECT") {
      this.mainWord = "Waiting for Word"
      this.commonService.presentToast("Wrong Answer")
      this.vibration.vibrate(1500);
    }




  }



  userRole() {
    switch (this.user.email) {
      case this.t1p1.userId: this.user.role = this.t1p1.role;
        break;
      case this.t1p2.userId: this.user.role = this.t1p2.role;
        break;
      case this.t2p1.userId: this.user.role = this.t2p1.role;
        break;
      case this.t2p2.userId: this.user.role = this.t2p2.role;
        break;

      default: this.user.role = "Audience"
        break;
    }

    if (this.user.role != "Guesser") {
      this.displayWord = true;
    }

  }


  ngOnInit() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
    this.socket.nsp = "/password";
  }

  assignPlayerPositions() {
    this.teams.forEach(player => {
      if (player.teamId == "TEAMA" && player.playerId == "PLAYER1") {
        this.t1p1 = player;
        this.t1p1.role = "Clue Giver"
      }
      if (player.teamId == "TEAMA" && player.playerId == "PLAYER2") {
        this.t1p2.role = "Guesser"
        this.t1p2 = player;
      }
      if (player.teamId == "TEAMB" && player.playerId == "PLAYER1") {
        this.t2p1 = player;
        this.t2p1.role = "Clue Giver"
      }
      if (player.teamId == "TEAMB" && player.playerId == "PLAYER2") {
        this.t2p2 = player;
      }
      if (this.user.email == player.userId) {
        this.user.teamId = player.teamId;
        this.user.playerId = player.playerId;
      }
    });
    if (this.user.teamId == 'TEAMB') {
      this.swapTeam = true;
    }
    if (this.user.playerId == 'PLAYER1') {
      this.swapPlayer = true;
    }
  }

  source = timer(0, 1000);
  isMainTimer = false;
  timer: any = {};
  mainTimer = 29;
  subTimer = 20;

  mainClock(mainTimer, subTimer) {
    this.timer = {};
    this.mainTimer = mainTimer;
    this.subTimer = subTimer;
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
    const popover = await this.popoverCtrl.create({
      component: TenSecTimerComponent,
      translucent: true,
      // backdropDismiss: false,
      componentProps: { gameName: "Password" }
    });

    popover.onDidDismiss().then(() => {
      if (!this.displayWord) {
        if (this.user.role != "Guesser") {
          this.displayWord = true;
        }
      }
    });

    return await popover.present();
  }
  gotScore(score) {
    this.gameOverPopUp(score);

  }

  async gameOverPopUp(score) {


    const popover = await this.popoverCtrl.create({
      component: GameOverComponent,
      translucent: true,
      backdropDismiss: false,
      componentProps: { "score": score, "arenaTitle": this.arenaTitle, "gameName": "password" },
    });

    popover.onDidDismiss().then(() => {
    });

    // this.socket.emit("disjoinCatchRoom");
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

}