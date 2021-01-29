import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, LoadingController, IonSearchbar } from '@ionic/angular';
import * as io from "socket.io-client";
import { ArenaService } from 'src/app/Services/Arena/arena.service';
import { CommonService } from 'src/app/Services/Common/common.service';
// import { AuthService } from 'src/app/Services/Auth/auth.service';
import { EnvService } from 'src/app/Services/Env/env.service';

@Component({
  selector: 'app-arena-search',
  templateUrl: './arena-search.component.html',
  styleUrls: ['./arena-search.component.scss'],
})
export class ArenaSearchComponent implements OnInit {
  @ViewChild(IonSearchbar, { static: true }) searchbar: IonSearchbar;

  arenaName: string = '';
  arenas: Array<any> = [];
  user: any = {};


  socket: any;

  testing: boolean = false;



  ionViewDidEnter() {
    console.clear();
    setTimeout(() =>
      this.searchbar.setFocus(), 500)
  }

  constructor(
    public modalCtrl: ModalController,
    public arenaService: ArenaService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public commonService: CommonService,
    // public authService: AuthService,
    public envService: EnvService,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser')).data.user;
  }

  ngOnInit() { }



  searchArena() {
    if (this.arenaName.length) {
      this.arenaService.getArena(this.arenaName).subscribe(snap => {
        this.arenas = Object.values(snap.data);
      })
    } else {
      this.arenas = [];
    }
  }

  gtArenaRoom(arena) {

    let connections = arena.connections;
    let isPlayer: boolean = false;

    connections.forEach(conn => {
      if (conn.userId == this.user.email) {
        isPlayer = true
      }
    });

    if (!isPlayer) {

      this.modalCtrl.dismiss().then(() => {
        this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
        this.socket.nsp = "/selectionarena";
        this.socket.emit('joingameroom', this.user.email, arena._id, this.user.displayname, "", "");

        if (this.testing) {

          switch (this.user.email) {
            case "darkarqam@gmail.com":
              this.socket.emit('addusertoteam', this.user.email, arena._id, this.user.displayname, "TEAMA", "PLAYER2");
              break;
            case "third@gmail.com":
              this.socket.emit('addusertoteam', this.user.email, arena._id, this.user.displayname, "TEAMB", "PLAYER1");
              break;
            case "fourth@gmail.com":
              this.socket.emit('addusertoteam', this.user.email, arena._id, this.user.displayname, "TEAMB", "PLAYER2");
              break;
            default:
              break;
          }

        } else {

          this.socket.emit('addusertoaudience', this.user.email, arena._id, this.user.displayname, "", "");
        }




        this.socket.on('updateConnectionsList', data => {
          if (data.length) {
            this.navCtrl.navigateRoot(`/arena-room/${arena.title}`);
            // this.dismiss();
          } else {
            this.commonService.presentToast(data.message);
          }
        });
      });
    } else {
      this.modalCtrl.dismiss().then(() => {
        this.navCtrl.navigateRoot(`/arena-room/${arena.title}`);
      });
    }
  }


  close() {
    this.modalCtrl.dismiss();
  }

  isLoading = false;


  async present(arena) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: 'Joining Arena ' + arena.title,
    }).then(a => {
      a.present();
    });
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingCtrl.dismiss(null, 'cancel');
    }
  }



}



