import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Facebook } from '@ionic-native/facebook/ngx';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { environment } from '../environments/environment';
import { TenSecTimerComponent } from './Extras/ten-sec-timer/ten-sec-timer.component';
import { Vibration } from '@ionic-native/vibration/ngx';
//profile pic plugins
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TranslateConfigService } from './Services/translate-config.service';
import { HTTP } from '@ionic-native/http/ngx';
import { Admob, AdmobOptions } from '@ionic-native/admob/ngx';
// import { IonicStorageModule } from '@ionic/storage';
import { GameOverComponent } from './Extras/game-over/game-over.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const config: SocketIoConfig = { url: environment.api_url, options: {} };

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    TenSecTimerComponent,
    GameOverComponent
  ],
  entryComponents: [
    TenSecTimerComponent,
    GameOverComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TranslateConfigService,
    HttpClient,
    Facebook,
    FormBuilder,
    NativeAudio,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    FileTransfer,
    FileTransferObject,
    Admob
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
