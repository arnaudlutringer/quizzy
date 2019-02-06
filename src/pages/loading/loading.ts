import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';

import { Storage } from "@ionic/storage";
import { ImagePicker } from '@ionic-native/image-picker';

import { AbstractPage } from '../abstract';
import { GamePage, GameLoaderPage } from '../pages';
import { FacebookService, Api, User, CategoryProvider, Translate } from '../../providers/providers';

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
		public category: CategoryProvider,
		public translate: Translate) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		
		translate.initTranslate().then((ret) => {
			if(ret){
				this.loadElements();
			}
		});

		
	}

	async loadElements(){
		const cats= await this.category.load();

		const user= await this.user.load(2);

		this.goToProfile('forward');
	}

}