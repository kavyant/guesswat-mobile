import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  unSelArray: Array<any> = this.navParams.get("UnSelArr");

  constructor(
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
  ) {
    console.log(this.unSelArray)
  }

  ngOnInit() { }

  close(p) {
    // if (p.userId.length) {
    this.popoverCtrl.dismiss(p);
    // }
  }
}