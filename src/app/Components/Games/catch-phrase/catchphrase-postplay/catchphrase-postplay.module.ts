import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CatchphrasePostplayPage } from './catchphrase-postplay.page';

const routes: Routes = [
  {
    path: '',
    component: CatchphrasePostplayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CatchphrasePostplayPage]
})
export class CatchphrasePostplayPageModule {}
