import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IndexAfterloginPage } from './index-afterlogin.page';
import { EnvService } from 'src/app/Services/Env/env.service';
import { ArenaSearchComponent } from 'src/app/Extras/arena-search/arena-search.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: IndexAfterloginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  entryComponents: [
    ArenaSearchComponent
  ],
  declarations: [
    IndexAfterloginPage,
    ArenaSearchComponent
  ],
  providers: [EnvService]
})
export class IndexAfterloginPageModule { }
