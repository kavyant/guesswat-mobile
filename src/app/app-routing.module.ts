import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  // Auth`
  { path: 'auth', loadChildren: './Components/auth/auth.module#AuthModule' },
  // Indexes
  { path: 'index-afterlogin', loadChildren: './Components/index-afterlogin/index-afterlogin.module#IndexAfterloginPageModule' },
  { path: 'index-beforelogin2', loadChildren: './Components/index-beforelogin2/index-beforelogin2.module#IndexBeforelogin2PageModule' },
  // Arenas
  { path: 'arena-room/:arenaTitle', loadChildren: './Components/arena-room/arena-room.module#ArenaRoomPageModule' },
  // NinetySecs
  { path: 'ninety-second-challenge/:arenaId/:arenaTitle', loadChildren: './Components/Games/ninety-second/ninety-second-challenge/ninety-second-challenge.module#NinetySecondChallengePageModule' },
  { path: 'ninety-second-beforeplay', loadChildren: './Components/Games/ninety-second/ninety-second-beforeplay/ninety-second-beforeplay.module#NinetySecondBeforeplayPageModule' },
  // Catch-Phrase
  { path: 'catchphrase-play/:arenaId/:arenaTitle', loadChildren: './Components/Games/catch-phrase/catchphrase-play/catchphrase-play.module#CatchphrasePlayPageModule' },
  { path: 'catchphrase-postplay', loadChildren: './Components/Games/catch-phrase/catchphrase-postplay/catchphrase-postplay.module#CatchphrasePostplayPageModule' },
  { path: 'catchphrase-preplay', loadChildren: './Components/Games/catch-phrase/catchphrase-preplay/catchphrase-preplay.module#CatchphrasePreplayPageModule' },
  // Password Play
  { path: 'password-play/:arenaId/:arenaTitle', loadChildren: './Components/Games/password-play/password-play/password-play.module#PasswordPlayPageModule' },
  { path: 'profile', loadChildren: './Components/Profile/profile/profile.module#ProfilePageModule' },
  { path: 'edit-profile', loadChildren: './Components/Profile/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'reward', loadChildren: './reward/reward.module#RewardPageModule' },    
  { path: 'password-management', loadChildren: './Components/Games/Password/password-management/password-management.module#PasswordManagementPageModule' },
  { path: 'event-player', loadChildren: './Extras/event-player/event-player.module#EventPlayerPageModule' },
  { path: 'setting', loadChildren: './Extras/setting/setting.module#SettingPageModule' },
  { path: 'offline-challenge', loadChildren: './Extras/offline-challenge/offline-challenge.module#OfflineChallengePageModule' },
  { path: 'time-freezer', loadChildren: './Extras/time-freezer/time-freezer.module#TimeFreezerPageModule' },
  { path: 'forgetpassword', loadChildren: './forgetpassword/forgetpassword.module#ForgetpasswordPageModule' },

   {path: 'buy',
		children: [
			{path: 'shop', loadChildren: './Shop/shop/shop.module#ShopPageModule'},
			{ path: 'hinto', loadChildren: './Shop/hints-shop/hints-shop.module#HintsShopPageModule' },
			{path: 'pass', loadChildren: './Shop/pass/pass.module#PassPageModule'},			
			{path: 'freezo', loadChildren: './Shop/freezo/freezo.module#FreezoPageModule'},
			{path: 'reverse', loadChildren: './Shop/reverse/reverse.module#ReversePageModule'},
		]
	},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
