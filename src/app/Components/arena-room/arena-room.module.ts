import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ArenaRoomPage } from './arena-room.page';
import { UsersListComponent } from 'src/app/Extras/users-list/users-list.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

const routes: Routes = [
  {
    path: '',
    component: ArenaRoomPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    UsersListComponent
  ],
  declarations: [ArenaRoomPage, UsersListComponent],
  providers: [
    SocialSharing,
    Clipboard
  ]
})
export class ArenaRoomPageModule { }
