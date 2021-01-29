import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CatchphrasePlayPage } from './catchphrase-play.page';

const routes: Routes = [
  {
    path: '',
    component: CatchphrasePlayPage
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
  ],
  declarations: [
    CatchphrasePlayPage,
  ]
})
export class CatchphrasePlayPageModule { }
