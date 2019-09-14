import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';

import { Storage } from "@ionic/storage";
import { ImagePicker } from '@ionic-native/image-picker';

import { AbstractPage } from '../abstract';
import { GamePage, GameLoaderPage } from '../pages';
import { FacebookService, Friends, HeaderProvider } from '../../providers/providers';

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage extends AbstractPage {

	doughnut:number[];

	friends:any[];
	state = "hide";
	options:any;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
        public header: HeaderProvider,
		public facebook: FacebookService,
		public friendsProvider: Friends) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params, header);
		this.doughnut = [1000, 2000, 3000];
	}

	ionViewWillEnter(){
		this.friends = this.friendsProvider.getFriends();
	}

	makeShow(id, index) {
		if(this.state == id){
			this.state = null;
		}else{
			this.friendsProvider.setCurrentFriendIndex(index);
			this.state = id;
		}
	}

	canPlay(friend){
		return friend.myScore.answers.notPlayed > 0 ;
	}

	play(index){
		this.goTo(GameLoaderPage, 'forward', {'friend':this.friends[index]});
	}

	modalComments(friend){
		let commentsModal = this.modalCtrl.create(ProfileCommentsPage, { friend: friend});
		commentsModal.present();
	}

	connectFb(){
    alert('a');
		this.facebook.loginFB();
	}

}

@Component({
	selector: 'page-profile',
	templateUrl: 'profile-comments.html'
})
export class ProfileCommentsPage extends AbstractPage {

	friend:any;
	me: any;
	message:string;

	@ViewChild('content') content:any;
	@ViewChild('chat') chat:any;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		this.friend = this.params.get('friend');
		this.me = {
			'account_image' : 'http://img.over-blog.com/481x500/4/04/49/24/Nov2010/winnie-the-pooh.jpg',
		};
		console.log(this.chat);
	}


	ionViewWillEnter(){
		this.content.scrollTo(0,400000,10, function(){});
	}

	sendMessage(){
		this.friend.comments.push({
			'date':this.toDateFormat(new Date()),
			'message':this.message,
			'me':true
		});

		this.message = '';
		this.content.scrollToBottom(10);
	}

	back(){
		this.viewCtrl.dismiss()
	}

	toDateFormat(date){
		return date.getDate() + '/' + this.toMonthFormat(date.getMonth()) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

	}

	toMonthFormat(monthNumber){
		if(monthNumber<10){
			return '0' + (monthNumber+1)
		}else{
			return (monthNumber+1);
		}
	}
}