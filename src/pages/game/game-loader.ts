import { Component } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage, GamePage } from '../pages';

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
        public params: NavParams) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		this.startTimer();
		this.friendChosen = this.params.get('friend');
	}

	startTimer(){
		this.timer = setInterval(x => 
		{
			this.remaining -= this.delai / 1000;
			if(this.remaining <= 0){
				this.goTo(GamePage, 'forward', {})
				clearInterval(this.timer);
			}
		}, this.delai);
	}


}
