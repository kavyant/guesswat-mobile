import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController } from '@ionic/angular';
import { ArenaService } from 'src/app/Services/Arena/arena.service';
import * as io from "socket.io-client";
import { EnvService } from 'src/app/Services/Env/env.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
})
export class GameOverComponent implements OnInit {
  tempscore = {
    "TEAMA": {
      "PLAYER1": {
        "points": 4,
        "correctans": 4
      },
      "PLAYER2": {
        "points": 4,
        "correctans": 4
      },
      "METRICS": {
        "points": 4,
        "correctans": 4
      }
    },
    "TEAMB": {
      "PLAYER1": {
        "points": 2,
        "correctans": 2
      },
      "PLAYER2": {
        "points": 2,
        "correctans": 2
      },
      "METRICS": {
        "points": 2,
        "correctans": 2
      }
    },
    "METRICS": {
      "overallwinner": "",
      "TEAMA_POINTS": 4,
      "TEAMB_POINTS": 2
    }
  }

  socket: any;


  score: any = this.navParams.get("score")
  //score: any = this.tempscore;
  arenaTitle = this.navParams.get("arenaTitle")
  arena: any = {};
  gameName = this.navParams.get("gameName");

  winner: string = "";
  loser: string = "";


  t1p1Points: number = 0;
  t1p2Points: number = 0;
  t2p1Points: number = 0;
  t2p2Points: number = 0;
  continuegame: boolean = false;


  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public arenaService: ArenaService,
    public popoverCtrl: PopoverController,
    public envService: EnvService,
  ) {
    if(this.score.TEAMA.METRICS.roundswon == 2 || this.score.TEAMB.METRICS.roundswon == 2) {
      this.continuegame = true;
      if (this.score.METRICS.TEAMA_POINTS > this.score.METRICS.TEAMB_POINTS) {
        this.winner = "Team A leading";
        this.loser = "Team B losing";
      }
  
      if (this.score.METRICS.TEAMA_POINTS < this.score.METRICS.TEAMB_POINTS) {
        this.winner = "Team B leading";
        this.loser = "Team A losing";
      }
  
      this.t1p1Points = this.score.TEAMA.PLAYER1.points;
      this.t2p1Points = this.score.TEAMB.PLAYER1.points;
  
      if (this.gameName == 'catchphrase' || this.gameName == 'password') {
        this.t1p2Points = this.score.TEAMA.PLAYER2.points;
        this.t2p2Points = this.score.TEAMB.PLAYER2.points;
      }
    }  else{
      if (this.score.METRICS.TEAMA_POINTS > this.score.METRICS.TEAMB_POINTS) {
        this.winner = "Team A wins";
        this.loser = "Team B lost";
      }
  
      if (this.score.METRICS.TEAMA_POINTS < this.score.METRICS.TEAMB_POINTS) {
        this.winner = "Team B wins";
        this.loser = "Team A lost";
      }
  
      if (this.score.METRICS.TEAMA_POINTS == this.score.METRICS.TEAMB_POINTS) {
        this.winner = "Its a tie";
        this.loser = "";
      }
  
      this.t1p1Points = this.score.TEAMA.PLAYER1.points;
      this.t2p1Points = this.score.TEAMB.PLAYER1.points;
  
      if (this.gameName == 'catchphrase' || this.gameName == 'password') {
        this.t1p2Points = this.score.TEAMA.PLAYER2.points;
        this.t2p2Points = this.score.TEAMB.PLAYER2.points;
      }
    }
    
  }
  ngOnInit() {


  }

  destroyObject() {
    this.navToArena();
    return;
    switch (this.gameName) {
      case "90sec":
        this.socket.emit("disjoin90secRoom");
        break;
      case "catchphrase": this.socket.emit("disjoinCatchRoom");
        break;
      case "password": this.socket.emit("disjoinPassword");
        break;

      default:
        break;
    }
    this.navToArena();
  }


  navToArena() {
    this.popoverCtrl.dismiss().then(() => {
      this.navCtrl.navigateRoot(`/index-afterlogin`);
      // this.arenaService.getArena(this.arenaTitle).subscribe(snap => {
      //   if (snap.message == "Arena details found.") {
      //     this.navCtrl.navigateRoot(`/arena-room/${this.arenaTitle}`);
      //   } else {
      // this.navCtrl.navigateRoot(`/index-afterlogin`);
      //   }
      // });
    })
  }

}
