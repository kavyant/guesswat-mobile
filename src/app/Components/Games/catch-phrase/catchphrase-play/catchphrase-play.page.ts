import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from "socket.io-client";
import { timer } from 'rxjs';
import { AlertController, PopoverController, NavController, ModalController } from '@ionic/angular';
import { ArenaService } from 'src/app/Services/Arena/arena.service';
import { CommonService } from 'src/app/Services/Common/common.service';
import { TenSecTimerComponent } from 'src/app/Extras/ten-sec-timer/ten-sec-timer.component';
import { EnvService } from 'src/app/Services/Env/env.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { GameOverComponent } from 'src/app/Extras/game-over/game-over.component';

@Component({
  selector: 'app-catchphrase-play',
  templateUrl: './catchphrase-play.page.html',
  styleUrls: ['./catchphrase-play.page.scss'],
})
export class CatchphrasePlayPage implements OnInit {

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

  t1p1MsgDisplay: boolean = false;
  t1p2MsgDisplay: boolean = false;
  t2p1MsgDisplay: boolean = false;
  t2p2MsgDisplay: boolean = false;

  chatText: string = "";

  t1p1Msgs: any = [];
  t2p1Msgs: any = [];
  t1p2Msgs: any = [];
  t2p2Msgs: any = [];

  swapTeam: boolean = false;
  swapPlayer: boolean = false;

  activeTeam: string = "TEAMA";

  mainWord: string = "Waiting for Word";
  displayWord: boolean = false;

  //Timer Declares
  source = timer(0, 1000);
  isMainTimer = false;
  timer: any = {};
  mainTimer1: number = 50;
  mainTimer2: number = 50;
  mainTimer3: number = 50;



  gtIndex() {
    this.navCtrl.navigateRoot(`/index-afterlogin`);
  }

  currentRound: string = "";
  roundNumber: number = 0;

  constructor(
    private router: ActivatedRoute,
    public arenaService: ArenaService,
    public commonService: CommonService,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController,
    public envService: EnvService,
    public vibration: Vibration,
    public modalCtrl: ModalController,

  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser')).data.user;
    this.router.params.subscribe(params => {
      this.arenaId = params['arenaId'];
      this.arenaTitle = params['arenaTitle'];
      this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
      this.socket.nsp = "/catchphrase";
      this.socket.emit("joincatchphraseroom", this.user.email, this.user.displayname, this.arenaId, this.arenaTitle);

      this.arenaService.getArena(params['arenaTitle']).subscribe(temp => {
        this.arena = temp.data[0];
        this.teams = temp.data[0].teams;
        this.assignPlayerPositions();
      });




      this.socket.on("updatechat", (data1, data2) => {
        switch (data1) {
          case "SERVER": this.updateServer(data2)
            break;
          case "TEAMA_PLAYER1": this.t1p1MsgHandle(data2);
            break;
          case "TEAMA_PLAYER2": this.t1p2MsgHandle(data2);
            break;
          case "TEAMB_PLAYER1": this.t2p1MsgHandle(data2);
            break;
          case "TEAMB_PLAYER2": this.t2p2MsgHandle(data2);
            break;
          case "Score": this.gotScore(data2)
            break;
          case "Freezo": this.applyFreezo(data2)
            break;
          case "ROUND DURATION": this.setRoundDuration(Math.round(data2 / 1000));
            break;

          default: console.log("Checking Users", data2);
            break;
        }
      })
    })
  }
  t1p1MsgHandle(data) {
    this.t1p1Msgs.push(data);
    this.t1p1MsgDisplay = true;
    setTimeout(() => { this.t1p1MsgDisplay = false; }, 1000);
  }
  t1p2MsgHandle(data) {
    this.t1p2Msgs.push(data);
    this.t1p2MsgDisplay = true;
    setTimeout(() => { this.t1p2MsgDisplay = false; }, 1000);
  }

  t2p1MsgHandle(data) {
    this.t2p1Msgs.push(data);
    this.t2p1MsgDisplay = true;
    setTimeout(() => { this.t2p1MsgDisplay = false; }, 1000);
  }
  t2p2MsgHandle(data) {
    this.t2p2Msgs.push(data);
    this.t2p2MsgDisplay = true;
    setTimeout(() => { this.t2p2MsgDisplay = false; }, 1000);
  }

  round1Duration = 0;
  round2Duration = 0;
  round3Duration = 0;

  setRoundDuration(duration) {

    console.log('Duration :', duration)
    switch (this.roundNumber) {
      case 0: this.roundNumber = 1; this.currentRound = "Round " + this.roundNumber; this.round1Duration = duration;
        break;
      case 1: this.round1Duration = duration;
        break;
      case 2: this.round2Duration = duration;
        break;
      case 3: this.round3Duration = duration;
        break;

    }

    this.mainClock(duration);

  }
  gotScore(score) {
    // this.socket.disconnect(true)
    this.gameOverPopUp(score);
    this.roundNumber = 0;
    this.currentRound = "Round " + this.roundNumber;

  }
  isPopup: boolean = false;
  updateServer(msg) {
    console.log(' Server:', msg)

    if (msg == "LOADING YOUR GAME") {

      this.t1p1.role = "Clue Giver"
      this.t1p2.role = "Guesser"
      this.t2p1.role = "Waiting for turn"
      this.t2p2.role = "Waiting for turn"
      this.userRole();

      this.tenSecPop();
    }

    if (msg.includes("Congratulations")) {
      this.vibration.vibrate(1500);

      this.tenSecPop();
      this.roundNumber++;
      this.currentRound = "Round " + this.roundNumber;
    }


    if (msg == "CORRECT") {
      // this.displayWord = false;
      this.mainWord = "Waiting for Word"
      this.commonService.presentToast("Correct Answer");
      this.vibration.vibrate(1500);
    }
    if (msg == "INCORRECT") {
      this.mainWord = "Waiting for Word"
      this.commonService.presentToast("Wrong Answer")
      this.vibration.vibrate(1500);
    }



    if (msg.includes("Turn changed to")) {
      this.vibration.vibrate(1500);
      this.displayWord = false;
      if (msg.includes("TEAMA") && msg.includes("PLAYER1")) {
        this.activeTeam = "TEAMA"
        this.t1p1.role = "Clue Giver"
        this.t1p2.role = "Guesser"
        this.t2p1.role = "Waiting for turn"
        this.t2p2.role = "Waiting for turn"
        this.userRole();
      }
      if (msg.includes("TEAMA") && msg.includes("PLAYER2")) {
        this.activeTeam = "TEAMA"
        this.t1p1.role = "Guesser"
        this.t1p2.role = "Clue Giver"
        this.t2p1.role = "Waiting for turn"
        this.t2p2.role = "Waiting for turn"
        this.userRole();
      }
      if (msg.includes("TEAMB") && msg.includes("PLAYER1")) {
        this.activeTeam = "TEAMB"
        this.t1p1.role = "Waiting for turn"
        this.t1p2.role = "Waiting for turn"
        this.t2p1.role = "Clue Giver"
        this.t2p2.role = "Guesser"
        this.userRole();
      }
      if (msg.includes("TEAMB") && msg.includes("PLAYER2")) {
        this.activeTeam = "TEAMB"
        this.t1p1.role = "Waiting for turn"
        this.t1p2.role = "Waiting for turn"
        this.t2p1.role = "Guesser"
        this.t2p2.role = "Clue Giver"
        this.userRole();
      }
    }


    if (msg.includes("Your word is :")) {
      let temp = msg.split("Your word is :");
      this.mainWord = temp[1];

      if (!this.isPopup) {
        if (this.user.role != "Guesser") {
          this.displayWord = true;
        }
      }

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
  }

  assignPlayerPositions() {
    this.teams.forEach(player => {
      if (player.teamId == "TEAMA" && player.playerId == "PLAYER1") {
        this.t1p1 = player;
      }
      if (player.teamId == "TEAMA" && player.playerId == "PLAYER2") {
        this.t1p2 = player;
      }
      if (player.teamId == "TEAMB" && player.playerId == "PLAYER1") {
        this.t2p1 = player;
      }
      if (player.teamId == "TEAMB" && player.playerId == "PLAYER2") {
        this.t2p2 = player;
      }
      if (this.user.email == player.userId) {
        this.user.teamId = player.teamId;
        this.user.playerId = player.playerId;
      }
    });
    this.updateLocalTeam();
    if (this.user.teamId == 'TEAMB') {
      this.swapTeam = true;
    }
    if (this.user.playerId == 'PLAYER1') {
      this.swapPlayer = true;
    }
  }
  updateLocalTeam() {
    this.localTeams = [
      this.t1p1,
      this.t1p2,
      this.t2p1,
      this.t2p2,
    ]
  }



  ngOnInit() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
    this.socket.nsp = "/catchphrase";
  }

  sendChat() {
    this.socket.emit("sendchat", this.user.email, this.arenaId, this.chatText);
    this.chatText = "";
  }


  async tenSecPop() {
    this.isPopup = true;

    let audio = new Audio();
    audio.src = `../../assets/audio/06 5-4-3-2-1 for ending.wav`;
    audio.load();
    audio.loop = true;




    const popover = await this.popoverCtrl.create({
      component: TenSecTimerComponent,
      translucent: true,
      // backdropDismiss: false,
      componentProps: { gameName: "CatchPhrase" }
    });

    popover.onDidDismiss().then(() => {

      audio.pause();

      this.isPopup = false;


      if (this.roundNumber == 0) {
        this.roundNumber = 1;
        this.currentRound = "Round " + this.roundNumber;
      }


      if (!this.displayWord) {
        if (this.user.role != "Guesser") {
          this.displayWord = true;
        }
      }
    });

    return await popover.present().then(() => {
      audio.play();
    });
  }

  async gameOverPopUp(score) {


    const popover = await this.popoverCtrl.create({
      component: GameOverComponent,
      translucent: true,
      backdropDismiss: false,
      componentProps: { "score": score, "arenaTitle": this.arenaTitle, "gameName": "catchphrase" },
    });

    popover.onDidDismiss().then(() => {
    });

    this.socket.emit("disjoinCatchRoom");
    return await popover.present();
  }

  ionViewDidLeave() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
  }


  freezoActived: boolean = false;
  clickFreezo() {
    if (this.user.freezo) {
      this.freezoActived = true;
      // this.socket.emit("freezo", this.user.email, this.arenaId, this.chatText);
      this.user.freezo = this.user.freezo - 1;
    } else {
      this.commonService.presentToast("You do not have enough freezos")
    }
  }

  applyFreezo(dur) {
    let dura = dur.a / 1000; 0
    this.freezoActived = true;

    setTimeout(() => {
      this.commonService.presentToast("Freezo Deactivated")
      this.freezoActived = false;
    }, 10000);
    this.commonService.presentToast("Freezo Activated")
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
  isSuperRound = false;
  beginSuperRound() {
    this.isSuperRound = true;
  }




  mainClock(mainTimer) {
    this.timer = {};
    this.source = timer(0, 1000);
    if (this.roundNumber == 1) {
      this.mainTimer1 = mainTimer;
      this.timer = this.source.subscribe(val => {
        this.isMainTimer = true;
        if (this.mainTimer1 > 0) {
          this.mainTimer1 = mainTimer - val;
          if (this.mainTimer1 == 10) {
            this.vibration.vibrate(1500);
          }
        } else {
          this.timer.unsubscribe();
        }
        if (this.freezoActived) {
          this.commonService.presentToast("Freezo Deactivated")
          this.freezoActived = false;
        }
      });
    }
    if (this.roundNumber == 2) {
      this.mainTimer2 = mainTimer;
      this.timer = this.source.subscribe(val => {
        this.isMainTimer = true;
        if (this.mainTimer2 > 0) {
          this.mainTimer2 = mainTimer - val;
          if (this.mainTimer2 == 10) {
            this.vibration.vibrate(1500);
          }
        } else {
          this.timer.unsubscribe();
        }
        if (this.freezoActived) {
          this.commonService.presentToast("Freezo Deactivated")
          this.freezoActived = false;
        }
      });
    }
    if (this.roundNumber == 3) {
      this.mainTimer3 = mainTimer;
      this.timer = this.source.subscribe(val => {
        this.isMainTimer = true;
        if (this.mainTimer3 > 0) {
          this.mainTimer3 = mainTimer - val;
          if (this.mainTimer3 == 10) {
            this.vibration.vibrate(1500);
          }
        } else {
          this.timer.unsubscribe();
        }
        if (this.freezoActived) {
          this.commonService.presentToast("Freezo Deactivated")
          this.freezoActived = false;
        }
      });
    }





  }

}
