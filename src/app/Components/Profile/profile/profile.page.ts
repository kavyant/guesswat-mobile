import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.page.html',
	styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
	user: any;
	showFile: boolean = false;

	constructor(
		private http: HttpClient,) { }

	ngOnInit() {

		this.user = JSON.parse(localStorage.getItem('currentUser'));
		console.log(this.user)
	}

	public uploadpic() {
		console.log("upload mofo");
		this.showFile = true;

	}
	public uploadFile(files) {
		this.showFile = false;
		console.log('files', files)
		var formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i], files[i]['name']);
			console.log("nameing",files[i]['name'])
		}
		this.http.post(environment.api_url + 'user/uploadimage', formData).subscribe(response => {
			console.log(response);
		  }, error => {
			  console.log(error)
			// this.showLoaderImg = false;
			// this.alertService.presentToast(error.error.message);
		  });
		// this.httpService.httpPost('/fileUpload', formData)
		//   .subscribe((response) => {
		// 	console.log('response', response)
		//   },
		// 	(error) => {
		//   console.log('error in fileupload', error)
		//    })
	}
}
