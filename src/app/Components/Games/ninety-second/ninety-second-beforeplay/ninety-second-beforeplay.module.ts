import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NinetySecondBeforeplayPage } from './ninety-second-beforeplay.page';

const routes: Routes = [
  {
    path: '',
    component: NinetySecondBeforeplayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NinetySecondBeforeplayPage]
})
export class NinetySecondBeforeplayPageModule {}
