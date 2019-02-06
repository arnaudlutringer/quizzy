import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';

import { Storage } from "@ionic/storage";
import { ImagePicker } from '@ionic-native/image-picker';

import { AbstractPage } from '../abstract';
import { GamePage, GameLoaderPage } from '../pages';
import { FacebookService } from '../../providers/providers';

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
		public facebook: FacebookService) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		this.doughnut = [1000, 2000, 3000];
		this.mock();
		this.calculateTaux();
	}


	makeShow(id) {
		if(this.state == id){
			this.state = null;
		}else{
			this.state = id;
		}
	}

	play(index){
		this.goTo(GameLoaderPage, 'forward', {'friend':this.friends[index]});
	}


	mock(){
		this.friends = [{
			'id':1,
			'usualName' : 'Shaba',
			'description' : 'Recordman du CO',
			'account_image' : 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/person.png',
			'score': 55,
			'answers':{
				'good': 4,
				'bad': 6,
				'not_played': 30
			},
			'comments':[{
				'date':'22/01/2019 19:10',
				'message':'Coucou',
				'me':true
			},{
				'date':'22/01/2019 21:10',
				'message':'Bah quoi il est pas beau mon quizz ?',
				'me':false,
			},{
				'date':'23/01/2019 22:10',
				'message':'Coucou',
				'me':true
			},{
				'date':'23/01/2019 22:11',
				'message':'Bah quoi il est pas beau mon quizz ?',
				'me':false,
			},{
				'date':'22/01/2019 19:10',
				'message':'Coucou',
				'me':true
			},{
				'date':'22/01/2019 21:10',
				'message':'Bah quoi il est pas beau mon quizz ?',
				'me':false,
			},{
				'date':'23/01/2019 22:10',
				'message':'Coucou',
				'me':true
			},{
				'date':'23/01/2019 22:11',
				'message':'Bah quoi il est pas beau mon quizz ?',
				'me':false,
			},{
				'date':'22/01/2019 19:10',
				'message':'Coucou',
				'me':true
			},{
				'date':'22/01/2019 21:10',
				'message':'Bah quoi il est pas beau mon quizz ?',
				'me':false,
			},{
				'date':'23/01/2019 22:10',
				'message':'Coucou',
				'me':true
			},{
				'date':'23/01/2019 22:11',
				'message':'Bah quoi il est pas beau mon quizz ?',
				'me':false,
			}],
			'his_score':{
				'score':24,
				'answers':{
					'good': 4,
					'bad': 66,
					'not_played': 12
				}

			}
		},
		{
			'id':2,
			'usualName' : 'Morgane',
			'description' : 'Recordman de la lutte',
			'account_image' : 'https://cdn2.iconfinder.com/data/icons/marriage-life/500/marry-512.png',
			'score': 70,
			'answers':{
				'good': 34,
				'bad': 16,
				'not_played': 0
			},
			'comments':[],
			'his_score':{
				'score':1,
				'answers':{
					'good': 1,
					'bad': 10,
					'not_played': 1
				}

			}
		},
		{
			'id':3,
			'usualName' : 'Gwladys',
			'description' : 'Je n\'oublie jamais ;)',
			'account_image' : 'https://cdn0.iconfinder.com/data/icons/avatar-25/64/avatar-business-woman-girl-blonde-512.png',
			'score': 12,
			'answers':{
				'good': 4,
				'bad': 16,
				'not_played': 2
			},
			'comments':[],
			'his_score':{
				'score':78,
				'answers':{
					'good': 40,
					'bad': 6,
					'not_played': 1
				}

			}
		}  	];
	}

	calculateTaux(){
		for(let friend of this.friends){
			let good = friend.answers.good;
			let bad = friend.answers.bad;
			let not_played = friend.answers.not_played;

			let total = good + bad + not_played;

			friend.taux = {
				'good' : Math.floor(good / total * 100),
				'bad' : Math.floor(bad / total * 100),
				'not_played' : Math.floor(not_played / total * 100)
			};


			good = friend.his_score.answers.good;
			bad = friend.his_score.answers.bad;
			not_played = friend.his_score.answers.not_played;

			total = good + bad + not_played;

			friend.his_score.taux = {
				'good' : Math.floor(good / total * 100),
				'bad' : Math.floor(bad / total * 100),
				'not_played' : Math.floor(not_played / total * 100)
			};
		}

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