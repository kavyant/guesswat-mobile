import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NinetySecondChallengePage } from './ninety-second-challenge.page';

const routes: Routes = [
  {
    path: '',
    component: NinetySecondChallengePage
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
  declarations: [
    NinetySecondChallengePage,
  ]
})
export class NinetySecondChallengePageModule { }
