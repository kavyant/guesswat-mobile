import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PasswordPlayPage } from './password-play.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordPlayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
  ],
  declarations: [PasswordPlayPage]
})
export class PasswordPlayPageModule { }
