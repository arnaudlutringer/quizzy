import { Component } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage } from '../pages';
import { CategoryProvider, User } from '../../providers/providers';

@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})
export class SettingsPage extends AbstractPage {

	nbCategories:number;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
		public categoryProvider: CategoryProvider) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
	}

	ionViewWillEnter(){
		this.nbCategories=this.categoryProvider.getNbSelected();
	}

	pushToInterest(){
		this.pushTo(SettingsInterestsPage, 'forward', {});
	}

}

@Component({
	selector: 'page-settings',
	templateUrl: 'settings-interests.html'
})
export class SettingsInterestsPage extends AbstractPage {

	categories:any[];

	changed:boolean = false;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
		public categoryProvider: CategoryProvider,
		public user: User) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		this.categories=this.categoryProvider.sort();
	}

	change(){
		this.changed =true;
	}

	ionViewCanLeave(){
		if(this.categoryProvider.getNbSelected() <= 0){
			this.toast('Choisis au moins un centre d\'intérêt');
		}
		return this.categoryProvider.getNbSelected() > 0;
	}

	async ionViewWillLeave(){
		if(this.changed){
			const update = await this.user.updateCategories();
		}
	}

	ionViewDidLeave(){
		if(this.changed){
			this.toast('Modifications prises en compte');
		}
	}
}

