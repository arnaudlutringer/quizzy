import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage, ReplyLoaderPage } from '../pages';
import { Api, User, HeaderProvider } from '../../providers/providers';

@Component({
	selector: 'page-search',
	templateUrl: 'search.html'
})
export class SearchPage extends AbstractPage {

	menuToggle:number = 1;
	search:string;
	users:any[];

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
        public header: HeaderProvider,
		private sanitizer: DomSanitizer,
		public user: User,
		public api: Api) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params, header);
	}

	show(menu){
		this.menuToggle = menu;
	}

	goToReply(){
		this.goTo(ReplyLoaderPage, 'forward', {});
	}

	isReplied(answer){
		if(answer.text.length == 1 && answer.text[0] == null){
			return false;
		}
		return true;
	}

	invite(idUser){
		console.log("Invitation de " + idUser);
		let data: any;
			data = {};
			data.userInvited = idUser;

			this.api.post('user/' + this.user.getId() + '/invite', data)
			.subscribe(
				(data) => {
					var body = JSON.parse(data.text());
					if(body.error){
						this.toastError(body.message.text);
					}
				},
				(err) => {
					this.toast('Une erreur est survenue');
				},
				() => {
					//this.goToHome();
				});
	}

	async searchUser(event){
		if(this.search.length >= 3){
			const found = await this.loadSearch(this.search);
			this.users = found;
		}else{
			this.users = [];
		}
	}

	loadSearch(search){
		return new Promise<any[]>((resolve, reject) => {
			let data: any;
			data = {};
			data.search = search;

			this.api.post('user/' + this.user.getId() + '/search-users', data)
			.subscribe(
				(data) => {
					let users:any[] = JSON.parse(data.text());
					for(let user of users){
						let userImg = new Image();
						userImg.src = user['image_account'];
					}
					resolve(users);
				},
				(err) => {
					reject();
				},
				() => {
					//this.goToHome();
				});
		});
	}
}
