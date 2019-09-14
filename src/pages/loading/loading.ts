import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';

import { Storage } from "@ionic/storage";
import { ImagePicker } from '@ionic-native/image-picker';

import { AbstractPage } from '../abstract';
import { GamePage, GameLoaderPage } from '../pages';
import { FacebookService, Api, User, Friends, CategoryProvider, Translate, HeaderProvider } from '../../providers/providers';

@Component({
	selector: 'page-loading',
	templateUrl: 'loading.html'
})
export class LoadingPage extends AbstractPage {


	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
		public facebook: FacebookService,
		public api: Api,
		public user: User,
		public friends: Friends,
		public category: CategoryProvider,
        public header: HeaderProvider,
		public translate: Translate) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params, header);
		
		translate.initTranslate().then((ret) => {
			if(ret){
				this.loadElements();
			}
		});

		
	}

	async loadElements(){
		const cats= await this.category.load();

		const user= await this.user.load(1);

		const friends= await this.friends.load();

		const notifs = await this.header.loadProfile();

		this.goToProfile('forward');
	}

}