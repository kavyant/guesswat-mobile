import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Socket } from 'ngx-socket-io';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { CommonService } from './Services/Common/common.service';

// import { AuthService } from './Services/Auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socket: Socket,
    private nativeAudio: NativeAudio,
    public commonService: CommonService,
    // public authService: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.show();
      setTimeout(() => { this.splashScreen.hide() }, 3000);
      this.socket.connect();
      this.socket.on('connect', () => {
        console.log("socket connection established");
      });
      this.socket.on('error', error => {
        console.log("an error was encountered: ", error)
      });
    }).catch((e) => {
      console.log("Promise broken.", e);

    });
  }





}
