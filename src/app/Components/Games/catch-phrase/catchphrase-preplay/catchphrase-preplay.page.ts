import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EnvService } from 'src/app/Services/Env/env.service';
import * as io from "socket.io-client";

@Component({
  selector: 'app-catchphrase-preplay',
  templateUrl: './catchphrase-preplay.page.html',
  styleUrls: ['./catchphrase-preplay.page.scss'],
})
export class CatchphrasePreplayPage implements OnInit {

  socket: any;

  user: any = {};

  newArenaId: any = {};

  constructor(
    private navCtrl: NavController,
    public envService: EnvService,

  ) {

    this.user = JSON.parse(localStorage.getItem('currentUser')).data.user;
    // console.log("User", this.user)
    this.socket = io(`${this.envService.backEnd}`, { transports: ['websocket'] });
    this.socket.nsp = "/playcatchphrase";

    this.socket.emit('joindynamiccatchphraseroom', this.user.displayname, this.user._id)
    this.socket.on('playcatchphrasegame', data => {
      this.newArenaId = data;
      console.log("New Arena", this.newArenaId)
    })
  }

  ngOnInit() {
  }

}
