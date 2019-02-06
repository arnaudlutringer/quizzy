import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage } from '../pages';

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})
export class GamePage extends AbstractPage {
	temps:number = 10;
	taux:number;
	remaining:string = "10";
	questions:any[];
	currentQuestionId:number = 0;
	currentQuestion:any;

	currentResponse:any;
	showResponses:boolean = false;
	timer:any;
	timerPreGame:any;

	showCategory:boolean = true;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public params: NavParams,
		private sanitizer: DomSanitizer) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		this.mock();
		this.currentQuestion = this.questions[this.currentQuestionId];

		this.startShowCategory();

	}

	startShowCategory(){
		this.showCategory  = true;
		this.timerPreGame = setInterval(x => 
		{
			this.startTimer();
		this.showCategory  = false;
			clearInterval(this.timerPreGame);
		}, 1500);
	}

	startTimer(){
		let delai:number = this.temps / 200;
		let time:number = 10000;
		this.taux=0;
		this.timer = setInterval(x => 
		{
			this.taux+=.5;
			time -= delai * 1000;
			this.remaining = (Math.floor(time / 1000) + 1).toString();
			if(this.taux == 100){
				this.verify(null);

			}
		}, delai * 1000);
	}

	verify(answerChosen){
		if(!this.showResponses){
			this.currentResponse = answerChosen;
			this.showResponses =true;
			clearInterval(this.timer);

			if(answerChosen == this.currentQuestion.goodAnswer.id){
				if(this.taux < 30){
					this.toast('+5');
					return;
				}

				if(this.taux < 70){
					this.toast('+3');
					return;
				}

				if(this.taux < 100){
					this.toast('+1');
					return;
				}
			}
		}
	}

	getClass(answerChosen){
		if(this.showResponses){
			if(answerChosen == this.currentQuestion.goodAnswer.id){
				return 'good';
			}else{
				if(answerChosen == this.currentResponse){
					return 'bad';
				}
			}
		}
		return '';

	}

	nextQuestion(){
		clearInterval(this.timer);
		this.currentQuestionId++;
		if(this.currentQuestionId == this.questions.length){
			this.quit();
		}else{
		this.showResponses = false;
		this.currentResponse =null;
			this.startShowCategory();
			this.currentQuestion = this.questions[this.currentQuestionId];
		}
	}

	quit(){
		this.goToProfile('forward');
		this.reinitQuestionGame();
	}

	reinitQuestionGame(){	
		this.showResponses = false;
		clearInterval(this.timer);
	}

	mock(){
		this.questions = [{
		'id':1,
		'title':"En quelle année je suis né ?",
		'category': {
			'title': 'Gastronomie',
			'image': 'http://www.leshallesdenimes.com/imgs/images/etal-bio/Fruits-Legumes.jpg'
		},
		'answers':[{
			"id": 1,
			'text': "1986",

		},{
			"id": 2,
			'text': "1987"
		},{
			"id": 3,
			'text': "1988"
		},{
			"id": 4,
			'text': "1989"
		}
		],
		'goodAnswer':{
			"id": 1,
			'text': "1986"
		}
	},
	{
		'id':2,
		'title':"Quel est mon plat préféré ?",
		'category': {
			'title': 'Culture générale',
			'image': 'https://pbs.twimg.com/profile_images/2587029738/jl43207kyoox2f9gorbo_400x400.png'
		},
		'answers':[{
			"id": 5,
			'text': "Le tajine",

		},{
			"id": 6,
			'text': "Le bon vieux kebab"
		},{
			"id": 7,
			'text': "La blanquette de veau"
		},{
			"id": 8,
			'text': "Le poulet chasseur"
		}
		],
		'goodAnswer':{
			"id": 8,
			'text': "Le poulet chasseur"
		}
	},
	{
		'id':3,
		'title':"Quel est mon plat préféré ?",
		'category': {
			'title': 'Culture générale',
			'image': 'https://pbs.twimg.com/profile_images/2587029738/jl43207kyoox2f9gorbo_400x400.png'
		},
		'answers':[{
			"id": 5,
			'text': "Le tajine",

		},{
			"id": 6,
			'text': "Le bon vieux kebab"
		},{
			"id": 7,
			'text': "La blanquette de veau"
		},{
			"id": 8,
			'text': "Le poulet chasseur"
		}
		],
		'goodAnswer':{
			"id": 8,
			'text': "Le poulet chasseur"
		}
	},
	{
		'id':4,
		'title':"Quel est mon plat préféré ?",
		'category': {
			'title': 'Culture générale',
			'image': 'https://pbs.twimg.com/profile_images/2587029738/jl43207kyoox2f9gorbo_400x400.png'
		},
		'answers':[{
			"id": 5,
			'text': "Le tajine",

		},{
			"id": 6,
			'text': "Le bon vieux kebab"
		},{
			"id": 7,
			'text': "La blanquette de veau"
		},{
			"id": 8,
			'text': "Le poulet chasseur"
		}
		],
		'goodAnswer':{
			"id": 8,
			'text': "Le poulet chasseur"
		}
	},
	{
		'id':5,
		'title':"Quel est mon plat préféré ?",
		'category': {
			'title': 'Culture générale',
			'image': 'https://pbs.twimg.com/profile_images/2587029738/jl43207kyoox2f9gorbo_400x400.png'
		},
		'answers':[{
			"id": 5,
			'text': "Le tajine",

		},{
			"id": 6,
			'text': "Le bon vieux kebab"
		},{
			"id": 7,
			'text': "La blanquette de veau"
		},{
			"id": 8,
			'text': "Le poulet chasseur"
		}
		],
		'goodAnswer':{
			"id": 8,
			'text': "Le poulet chasseur"
		}
	}
	]
	}

}
