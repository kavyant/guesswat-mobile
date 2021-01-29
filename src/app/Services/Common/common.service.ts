import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

   testing: boolean = true;

  constructor(
    private toastController: ToastController,
    public loadingCtrl: LoadingController,
  ) { }



  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'dark'
    });
    // if (!this.testing) {
    toast.present();
    // }
  }


  async present(options: object) {
    await this.dismiss();
    await this.loadingCtrl
      .create(options)
      .then(res => {
        res.present();
      });
  }

  async dismiss() {
    while (await this.loadingCtrl.getTop() !== undefined) {
      await this.loadingCtrl.dismiss();
    }
  }
}
