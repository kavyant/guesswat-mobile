import { Component, OnInit, ɵConsole, } from '@angular/core';
import { NavParams, NavController, AlertController, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import * as io from "socket.io-client";
import { ArenaService } from 'src/app/Services/Arena/arena.service';
import { CommonService } from 'src/app/Services/Common/common.service';
// import { AuthService } from 'src/app/Services/Auth/auth.service';
import { UsersListComponent } from 'src/app/Extras/users-list/users-list.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { EnvService } from 'src/app/Services/Env/env.service';

@Component({
  selector: 'app-arena-room',
  templateUrl: './arena-room.page.html',
  styleUrls: ['./arena-room.page.scss'],
})
export class ArenaRoomPage implements OnInit {



  public navParams: NavParams
  arenaName: string;
  cnctns: Array<any> = [];
  teams: Array<any> = [];
  audience: Array<any> = [];
  unSelArr: Array<any> = [];

  arena: any = {};
  minPlayers = {
    pass: 2,
    catch: 2,
    nsec: 2,
  }

  link: string = ``;

  selectedGame: string = '';

  owner: any = {};
  socket: any;

  user: any = {};


  dis4: boolean = true;
  dis2: boolean = false;

  t1p1: any = {};
  t1p2: any = {};
  t2p1: any = {};
  t2p2: any = {};

  showContinue: boolean = false;

  testing: boolean = false;
  testingGame: string = "nsec"
  constructor(
    private commonService: CommonService,
    private navCtrl: NavController,
    private router: ActivatedRoute,
    public asCtrl: ActionSheetController,
    public commonCtrl: CommonService,
    public arenaService: ArenaService,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public popCtrl: PopoverController,
    // public authService: AuthService,
    public envService: EnvService,
  ) {

    this.user = JSON.parse(localStorage.getItem('currentUser')).data.user;
    console.log(this.user)
    if (this.testing) {
      this.selectTestGame();
    }


    this.router.params.subscribe(params => {
      this.getArena(params['arenaTitle']);
      this.arenaService.getArena(params['arenaTitle']).subscribe(snap => {
        let temp: any = snap.data[0]

        this.owner = temp.owner;
        this.arena = temp;
        this.link = `Hey, I have created an Arena room "${this.arena.title}". Please join so we can play together`;
        this.cnctns = temp.connections;
        this.unSelArr = temp.connections;
        this.teams = temp.teams;
        this.audience = temp.audience;
        if (temp.currentGame) {
          this.selectedGame = temp.currentGame;
          this.displayPlayers()
        }

        this.checkSelfInArena();

        this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
        this.socket.nsp = "/selectionarena";

        this.socket.on("load90secroom", () => {
          this.navCtrl.navigateRoot(`/ninety-second-challenge/${this.arena._id}/${this.arena.title}`);
        })

        this.socket.on("loadcatchphraseroom", () => {
          this.navCtrl.navigateRoot(`/catchphrase-play/${this.arena._id}/${this.arena.title}`);
        })

        this.socket.on("loadpasswordroom", () => {
          this.navCtrl.navigateRoot(`/password-play/${this.arena._id}/${this.arena.title}`);
        })


        this.socket.emit("getarena", snap.data[0]._id);

        this.socket.on('updateArena', data => {
          this.cnctns = data.connections;
          this.unSelArr = data.connections;
          this.audience = data.audience;
          this.teams = data.teams;
          this.checkSelfInArena();
        });




        this.updateTeamsAndAudiences();
        this.socket.on("gameselectionui", data => {
          if (data) {
            this.selectedGame = data;
            this.displayPlayers();
            this.displayContinue();
          }
        })
      });
    });
    this.getUsername();
  }


  async shareAlert() {
    console.log(this.link)
    const actionSheet = await this.asCtrl.create({
      header: 'Invite to Arena : ' + this.arena.title,
      buttons: [
        {
          text: 'Whatsapp',
          role: 'selected',
          cssClass: '',
          icon: 'logo-whatsapp',
          handler: () => {
            this.share("whatsapp");
          }
        },
        {
          text: 'Facebook',
          role: 'selected',
          cssClass: '',
          icon: 'logo-facebook',
          handler: () => {
            this.share("facebook");
          }
        },
        {
          text: 'Twitter',
          role: 'selected',
          cssClass: '',
          icon: 'logo-twitter',
          handler: () => {
            this.share("twitter");
          }
        },
        {
          text: 'Copy Link',
          role: 'selected',
          cssClass: '',
          icon: 'copy',
          handler: () => {
            this.copyLink();
          }
        },
      ]
    });
    await actionSheet.present();
  }

  selGame(gameName) {
    if (this.owner == this.user.email) {
      this.socket.emit("gameselection", this.owner, this.arena._id, this.user.displayname, gameName);
    } else {
      this.commonService.presentToast("You are not an owner");
    }
  }

  copyLink() {
    this.clipboard.copy(this.link);
    this.commonService.presentToast("Arena Id Copied")
  }

  async exitArenaAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Exit Arena ??',
      message: this.user.displayname + " will leave the " + this.arena.title + " Arena ",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Leave Now',
          cssClass: 'danger',
          handler: () => {
            this.leaveArena();
          }
        }
      ]
    });
    await alert.present();

  }
  leaveArena() {
    this.socket.emit('removeuserfromconnections', this.user.email, this.arena._id, "", "", "");
    this.socket.emit('removeuserfromteam', this.user.email, this.arena._id, "", "", "");
    this.socket.emit('removeuserfromaudience', this.user.email, this.arena._id, "", "", "");
    this.socket.emit("getarena", this.arena._id);

  }

  share(sMedia) {
    switch (sMedia) {
      case "facebook": this.socialSharing.shareViaFacebook(this.link)
        break;
      case "whatsapp": this.socialSharing.shareViaWhatsApp(this.link)
        break;
      case "twitter": this.socialSharing.shareViaTwitter(this.link)
        break;
      // case "email": this.socialSharing.shareViaEmail(this.link,`Join Arena ${this.arenaName} `,)
      // break;

      default:
        break;
    }

    this.socialSharing.shareViaWhatsApp(this.link)
  }

  getArena(arenaTitle) {
    this.arenaName = arenaTitle;
  }

  ngOnInit() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
    this.socket.nsp = "/selectionarena";
  }
  ionViewDidEnter() {
    // console.clear();
  }

  ionViewDidLoad() {
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
    this.socket.nsp = "/selectionarena";
  }
  back() {
    this.navCtrl.navigateRoot("/index-afterlogin");
  }

  getUsername() {
    let observable = new Observable(observer => {
      this.socket.on('/create_arena', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  ninetySecondChallenge() {
    if (this.owner == this.user.email) {
      this.navCtrl.navigateRoot(`/ninety-second-challenge/${this.arena._id}/${this.arena.title}`);
    }
  }
  passwordPlay() {
    if (this.owner == this.user.email) {
      this.navCtrl.navigateRoot(`/password-play/${this.arena._id}/${this.arena.title}`);
    }
  }
  catchPhrase() {
    if (this.owner == this.user.email) {
      this.navCtrl.navigateRoot(`/catchphrase-play/${this.arena._id}/${this.arena.title}`);
    }
  }


  async selPlayerOpen(team, player, platerPos) {
    if (this.owner == this.user.email) {

      if (this.audience.length) {
        const popover = await this.popCtrl.create({
          component: UsersListComponent,
          animated: true,
          backdropDismiss: false,
          componentProps: { "UnSelArr": this.audience },
          keyboardClose: true,
          mode: "ios",
          translucent: true
        });
        popover.onDidDismiss()
          .then((result) => {
            this.addToTeam(result['data'], team, player, platerPos);
          });

        return await popover.present();
      } else {
        this.commonService.presentToast("No more players")
      }
    } else {
      this.commonService.presentToast("You are not an owner")
    }
  }

  addToTeam(playerData, team, player, playerPos) {
    let existingPLayer = eval("this." + playerPos);
    if (!Object.keys(existingPLayer).length) {
      this.socket.emit('addusertoteam', playerData.userId, this.arena._id, playerData.username, team, player);
      this.socket.emit('removeuserfromaudience', playerData.userId, this.arena._id, playerData.username, team, player);
      this.socket.emit("getarena", this.arena._id);
      this.updateTeamsAndAudiences();
    } else {
      this.replaceAlert(playerData, team, player, playerPos)
    }
  }

  async replaceAlert(playerData, team, player, playerPos) {
    let existingPLayer = eval("this." + playerPos);
    const alert = await this.alertCtrl.create({
      header: 'Replace ' + existingPLayer.username,
      message: 'Player will be replaced with ' + playerData.username,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Replace',
          cssClass: 'danger',
          handler: () => {
            this.replacePlayer(playerData, existingPLayer, team, player);
          }
        }
      ]
    });
    await alert.present();
  }

  replacePlayer(playerData, existingPLayer, team, player) {
    //Existing PLayer
    this.socket.emit('addusertoaudience', existingPLayer.userId, this.arena._id, existingPLayer.username, "", "");
    this.socket.emit('removeuserfromteam', existingPLayer.userId, this.arena._id, existingPLayer.username, team, player);
    //Replacing PLayer
    this.socket.emit('addusertoteam', playerData.userId, this.arena._id, playerData.username, team, player);
    this.socket.emit('removeuserfromaudience', playerData.userId, this.arena._id, playerData.username, team, player);
    this.socket.emit("getarena", this.arena._id);
    this.updateTeamsAndAudiences();
  }
  updateTeamsAndAudiences() {
    this.socket.on("updateAudienceList", data => {
      this.audience = data;
    })
    this.socket.on("updateTeammembersList", data => {
      this.teams = data;
      this.assignTeams();
    })
    this.displayContinue();
  }
  async rmPLayerConfirm(player) {
    const alert = await this.alertCtrl.create({
      header: 'Remove player ' + player.userId,
      message: 'Player will no longer be in arena',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Remove',
          cssClass: 'danger',
          handler: () => {
            this.rmPlayer(player);
          }
        }
      ]
    });
    await alert.present();
  }


  rmPlayer(player) {
    this.socket.emit("leavegameroom", this.arena, player.userId);
    this.socket.emit("getarena", this.arena._id);
  }

  displayPlayers() {
    switch (this.selectedGame) {
      case "catch": this.dis4 = true; this.dis2 = false;
        break;
      case "pass": this.dis4 = true; this.dis2 = false;
        break;
      case "nsec": this.dis4 = false; this.dis2 = true;
        break;
      default:
        break;
    }
    this.assignTeams();
  }
  gtGame() {
    this.showContinue = false;
    switch (this.selectedGame) {
      case "catch": this.catchPhrase();
        break;
      case "pass": this.passwordPlay();
        break;
      case "nsec": this.ninetySecondChallenge();
        break;
      default:
        break;
    }
  }

  assignTeams() {
    this.displayContinue();
    this.teams.forEach(snap => {
      if (snap.playerId == "PLAYER1" && snap.teamId == "TEAMA") {
        this.t1p1 = snap;
      }
      if (snap.playerId == "PLAYER1" && snap.teamId == "TEAMB") {
        this.t2p1 = snap;
      }
      if (snap.playerId == "PLAYER2" && snap.teamId == "TEAMA") {
        this.t1p2 = snap;
      }
      if (snap.playerId == "PLAYER2" && snap.teamId == "TEAMB") {
        this.t2p2 = snap;
      }
    })
  }

  displayContinue() {
    if (this.selectedGame == "catch" && this.teams.length >= 4) {
      this.showContinue = true;
    }
    if (this.selectedGame == "pass" && this.teams.length >= 4) {
      this.showContinue = true;
    }
    if (this.selectedGame == "nsec" && this.teams.length >= 2) {
      this.showContinue = true;
    }
  }

  checkSelfInArena() {
    let isPresent: boolean = false;
    for (let i = 0; i < this.arena.connections.length; i++) {
      if (this.arena.connections[i].userId == this.user.email) {
        isPresent = true;
      }
    }
  }


  //Testing Functions
  selectTestGame() {
    if (this.user.email == "techarqam@gmail.com")
      this.selGame(this.testingGame);
  }

}
