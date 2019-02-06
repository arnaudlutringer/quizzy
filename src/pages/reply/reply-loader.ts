import { Component } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage, ReplyPage } from '../pages';
import { Api, User } from '../../providers/providers';

@Component({
	selector: 'page-reply-loader',
	templateUrl: 'reply-loader.html'
})
export class ReplyLoaderPage extends AbstractPage {
	remaining:number = 3;
	delai:number = 1000;
	timer:any;

	questions:any[];

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
		public api: Api,
		public user: User) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		this.startTimer();
	}

	startTimer(){
		this.load();
		this.timer = setInterval(x => 
		{
			this.remaining -= this.delai / 1000;
			if(this.remaining <= 0){
				this.goTo(ReplyPage, 'forward', {'questions':this.questions})
				clearInterval(this.timer);
			}
		}, this.delai);
	}

	async load(){
		console.log("Chargement des questions");

		const resolve = await this.loadQuestions(); 
		if(resolve.length == 0){
				clearInterval(this.timer);
			this.goToQuestions('back');
		}

		this.questions = resolve;
	}

	loadQuestions(){
		return new Promise<any>((resolve, reject)=>{
			let data: any;
			data = {};
			data.user_id = this.user.getId();
			this.api.post('question/get-to-play', data)
			.subscribe(
				(data) => {
					let body: any;
					body = JSON.parse(data.text());
					resolve(body);
				},
				(err) => {
				},
				() => {
					//this.goToHome();
				});
		});
	}

}
