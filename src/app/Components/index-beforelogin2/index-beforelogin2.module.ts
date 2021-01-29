import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IndexBeforelogin2Page } from './index-beforelogin2.page';

const routes: Routes = [
  {
    path: '',
    component: IndexBeforelogin2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IndexBeforelogin2Page]
})
export class IndexBeforelogin2PageModule {}
