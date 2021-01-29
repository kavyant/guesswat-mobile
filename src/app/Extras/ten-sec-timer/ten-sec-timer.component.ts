import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-ten-sec-timer',
  templateUrl: './ten-sec-timer.component.html',
  styleUrls: ['./ten-sec-timer.component.scss'],
})
export class TenSecTimerComponent implements OnInit {

  timerlength: number = 10;


  mainTimer: number = this.timerlength;

  timer;

  gameName: string = "";

  constructor(
    public popoverCtrl: PopoverController,
    public navParams: NavParams
  ) {
    this.gameName = this.navParams.get("gameName");
  }


  ngOnInit() {
    this.mainTimer = this.timerlength;
    this.mainClock();
  }

  isTimer: boolean = false;

  mainClock() {
    this.timer = timer(0, 1000).subscribe(val => {
      if (this.mainTimer > 1) {
        this.isTimer = !this.isTimer;
        this.mainTimer = this.timerlength - val;
      } else {
        this.timer.unsubscribe();
        this.dismiss();
      }
    });
  }
  dismiss() {
    this.popoverCtrl.dismiss({
      'dismissed': true
    });
  }

}
