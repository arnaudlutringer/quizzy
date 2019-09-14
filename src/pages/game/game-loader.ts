import { Component } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage, GamePage } from '../pages';
import { User, Api, HeaderProvider } from '../../providers/providers';

@Component({
	selector: 'page-game-loader',
	templateUrl: 'game-loader.html'
})
export class GameLoaderPage extends AbstractPage {
	remaining:number = 3;
	delai:number = 1000;
	timer:any;

	friendChosen:any;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
        public header: HeaderProvider,
		public user: User, 
		public api: Api) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params, header);
		this.friendChosen = this.params.get('friend');

		this.loadQuestions();

		
	}

	async loadQuestions(){
		console.log('Récupération des questions non répondues du user ' + this.friendChosen.id);
		const questions = await this.getQuestionsNotResponded(this.friendChosen.id, this.user.getId());
		this.startTimer(questions);
	}

	startTimer(questions){
		this.timer = setInterval(x => 
		{
			this.remaining -= this.delai / 1000;
			if(this.remaining <= 0){
				this.goTo(GamePage, 'forward', {'questions':questions, 'userPlayed':this.friendChosen.id});
				clearInterval(this.timer);
			}
		}, this.delai);
	}

	getQuestionsNotResponded(userChosen, user){
		return new Promise((resolve, reject)=>{
			let data: any;
			data = {};
			data.userChosen = userChosen;
			data.user = user;

			this.api.post('question/get-questions-not-responded', data)
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
