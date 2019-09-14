import { Component, ViewChild } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams, Slides } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage } from '../pages';
import { StringUtils, Api, User, Friends, HeaderProvider } from '../../providers/providers';

@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})
export class GamePage extends AbstractPage {
	@ViewChild('sliderDay') sliderDay: Slides;
	@ViewChild('sliderMonth') sliderMonth: Slides;
	@ViewChild('sliderYear') sliderYear: Slides;

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

	replied:boolean = false;
	questionStatus:string = null;

	days:any[];
	months:any[];
	years:any[];

	int_value:number;
	text_value:string;
	qcm_value:string = '';
	qs_value:string = '';

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
		private sanitizer: DomSanitizer,
		public stringUtils: StringUtils,
		public api: Api,
        public header: HeaderProvider,
		public user: User,
		public friendsProvider: Friends) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params, header);

		this.questions = this.params.get('questions');
		
		this.prepareLists();

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
		let delai:number = this.currentQuestion.type.time / 200;
		let time:number = this.currentQuestion.type.time * 1000;
		this.taux=0;
		this.timer = setInterval(x => 
		{
			this.taux+=.5;
			time -= delai * 1000;
			this.remaining = (Math.floor(time / 1000) + 1).toString();
			if(this.taux == 100){
				this.verify(null, null);
				switch(this.currentQuestion.type.name){
					case 'YMD':{
						this.validYMD(false);
					}
					case 'YM':{
						this.validYM(false);
					}
					case 'Y':{
						this.validY(false);
					}
					default :{
						this.replied = true;
					}
				}
			}
		}, delai * 1000);
	}

	verify(answerChosen, goodAnswer){
		if(!this.showResponses){
			this.currentResponse = answerChosen;
			this.showResponses =true;
			clearInterval(this.timer);

			var equal = answerChosen == this.currentQuestion.goodAnswer;

			if(answerChosen == null && goodAnswer == null){
				equal = false;
			}else{
				if(this.currentQuestion.type.name == 'TEXT'){
					equal = this.levenshteinDistance(answerChosen, goodAnswer) <= (goodAnswer.length /  5);
				}
			}

			if(equal){
				this.questionStatus ='good';
				if(this.taux < 30){
					this.toast('+5');
					this.friendsProvider.updateScore(5);
				}

				if(this.taux >= 31 && this.taux < 70){
					this.toast('+3');
					this.friendsProvider.updateScore(3);
				}

				if(this.taux >= 71 && this.taux < 100){
					this.toast('+1');
					this.friendsProvider.updateScore(1);
				}
			}else{
				this.questionStatus ='bad';
				this.friendsProvider.updateScore(0);
			}

			// Envoi de la réponse
			this.saveResponse(this.currentQuestion.id, answerChosen, equal);
			return;
		}
	}

	saveResponse(questionId, answer, good){
		let data: any;
			data = {};
			data.user_played_id = this.friendsProvider.getCurrentFriend().getId();
			data.user_id = this.user.getId();
			data.question_id = questionId;
			data.response = answer;
			data.good = good;

			this.api.post('question/save-response', data)
			.subscribe(
				(data) => {
				},
				(err) => {
				},
				() => {
					//this.goToHome();
				});
	}

	setQCMGood(answerChosen){
		if(!this.replied){
			let string = answerChosen+';';
			let indexof = this.qcm_value.indexOf(string);
			if(indexof > -1){
				this.qcm_value=this.qcm_value.replace(string, '');
			}else{
				this.qcm_value += string;
			}
			this.sortQCM();
		}
	}

	sortQCM(){
		let arr = this.qcm_value.split(';').sort();
		this.qcm_value ='';
		for(let item of arr){
			if(item){
				this.qcm_value += item + ';';
			}
		}
	}

	getQCMClass(answerChosen){
		if(!this.replied){
			if(this.qcm_value.indexOf(answerChosen+';') > -1){
				return 'selected';
			}
		}else{
			if(this.currentQuestion.goodAnswer.indexOf(answerChosen+';') > -1){
				return 'good';
			}else{
				if(this.qcm_value.indexOf(answerChosen+';') > -1){
					return 'bad';
				}
			}	
		}
		return '';
	}


	setGood(answerChosen){
		if(!this.replied){
			this.qs_value = answerChosen;
		}
	}

	getClass(answerChosen){
		if(!this.replied){
			if(this.qs_value == answerChosen){
				return 'selected';
			}
		}else{
			if(this.currentQuestion.goodAnswer == answerChosen){
				return 'good';
			}else{
				if(this.qs_value == answerChosen){
					return 'bad';
				}
			}	
		}
		return '';

	}

	validYMD(replied){
		let date = this.sliderYear._slides[this.sliderYear.getActiveIndex()].innerText+ 
		'-' +
		this.sliderMonth._slides[this.sliderMonth.getActiveIndex()].dataset.value + 
		'-' + 
		this.sliderDay._slides[this.sliderDay.getActiveIndex()].dataset.value;

		this.verify(date, this.currentQuestion.goodAnswer);	

		this.sliderDay.lockSwipes(true);
		this.sliderMonth.lockSwipes(true);
		this.sliderYear.lockSwipes(true);
		this.replied = true;
	}

	validYM(replied){
		let date = this.sliderYear._slides[this.sliderYear.getActiveIndex()].innerText+ 
		'-' +
		this.sliderMonth._slides[this.sliderMonth.getActiveIndex()].dataset.value;

		this.verify(date, this.currentQuestion.goodAnswer);	

		this.sliderMonth.lockSwipes(true);
		this.sliderYear.lockSwipes(true);
		this.replied = true;
	}

	validY(replied){
		let date = this.sliderYear._slides[this.sliderYear.getActiveIndex()].innerText;

		this.verify(date, this.currentQuestion.goodAnswer);		

		this.sliderYear.lockSwipes(true);
		this.replied = true;
	}

	validINT(){
		this.verify(this.int_value, this.currentQuestion.goodAnswer);
		this.replied = true;
	}

	validTEXT(){
		this.verify(this.stringUtils.cleanTextForGame(this.text_value), this.stringUtils.cleanTextForGame(this.currentQuestion.goodAnswer));
		this.replied = true;
	}

	validQCM(){
		this.verify(this.qcm_value, this.currentQuestion.goodAnswer);
		this.replied = true;
	}

	validQS(){
		this.verify(this.qs_value, this.currentQuestion.goodAnswer);
		this.replied = true;
	}

	nextQuestion(){
		clearInterval(this.timer);
		this.currentQuestionId++;
		this.questionStatus = null;
		if(this.currentQuestionId == this.questions.length){
			this.quit();
		}else{
			this.showResponses = false;
			this.currentResponse =null;
			this.replied = false;
			this.currentQuestion = this.questions[this.currentQuestionId];
			this.temps = this.currentQuestion.type.time;
			this.startShowCategory();

			// Réinitilisation des valeurs
			this.qcm_value = '';
			this.qs_value = '';
			this.int_value = null;
			this.text_value = '';
		}
	}

	quit(){
		this.verify(null, null);
		this.goToProfile('forward');
		this.reinitQuestionGame();
	}

	reinitQuestionGame(){	
		this.showResponses = false;
		clearInterval(this.timer);
	}

	prepareLists(){
		this.years = new Array();
		for(var i=1950; i<=2019;i++ ){
			this.years.push({value:i, label:i});
		}
		this.months = new Array();
		this.months.push({value:'01', label:'Janvier'});
		this.months.push({value:'02', label:'Février'});
		this.months.push({value:'03', label:'Mars'});
		this.months.push({value:'04', label:'Avril'});
		this.months.push({value:'05', label:'Mai'});
		this.months.push({value:'06', label:'Juin'});
		this.months.push({value:'07', label:'Juillet'});
		this.months.push({value:'08', label:'Août'});
		this.months.push({value:'09', label:'Septembre'});
		this.months.push({value:'10', label:'Octobre'});
		this.months.push({value:'11', label:'Novembre'});
		this.months.push({value:'12', label:'Décembre'});

		this.days = new Array();
		for(var i=1; i<=31;i++ ){
			this.days.push({value:(i<10?'0'+i:''+i), label:(i<10?'0'+i:''+i)});
		}
	}

	toDateText(date){
		let array = date.split('-');
		if(array.length == 3){
			//YMD
			return array[2] + ' ' + this.months[(+array[1] - 1)].label + ' ' + array[0];
		}
		if(array.length == 2){
			//YMD
			return this.months[(+array[1] - 1)].label + ' ' + array[0];
		}
		return date;
	}

	levenshteinDistance(a, b) {
		if(a.length == 0) return b.length; 
		if(b.length == 0) return a.length; 

		var matrix = [];

		// increment along the first column of each row
		var i;
		for(i = 0; i <= b.length; i++){
			matrix[i] = [i];
		}

		// increment each column in the first row
		var j;
		for(j = 0; j <= a.length; j++){
			matrix[0][j] = j;
		}

		// Fill in the rest of the matrix
		for(i = 1; i <= b.length; i++){
			for(j = 1; j <= a.length; j++){
				if(b.charAt(i-1) == a.charAt(j-1)){
					matrix[i][j] = matrix[i-1][j-1];
				} else {
					matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
						Math.min(matrix[i][j-1] + 1, // insertion
							matrix[i-1][j] + 1)); // deletion
				}
			}
		}

		console.log('levenshtein ['+a+'] ['+b+'] : '+matrix[b.length][a.length]);
		return matrix[b.length][a.length];
	}

}
