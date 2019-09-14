import { Component, ViewChild } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams, Slides } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { QuestionsPage } from '../pages';
import { Api, User, HeaderProvider } from '../../providers/providers';

@Component({
	selector: 'page-reply',
	templateUrl: 'reply.html'
})
export class ReplyPage extends AbstractPage {
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
	replied:boolean = false;

	noMoreQuestion:boolean = false;

	days:any[];
	months:any[];
	years:any[];

	int_value:number;
	text_value:string;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
		public api: Api,
        public header: HeaderProvider,
		public user: User) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params, header);
		this.questions = params.get('questions');
		this.prepareLists();
	}

	ionViewWillLoad(){
		this.currentQuestion = this.questions[this.currentQuestionId];
	}

	ionViewDidLeave(){
		if(this.noMoreQuestion){
			this.toast('Plus de questions');
		}
	}

	setGood(answerChosen){
		if(this.questions[this.currentQuestionId].goodAnswer == answerChosen){
			this.replied = false;
			this.questions[this.currentQuestionId].goodAnswer = null;
		}else{
			this.replied = true;
			this.questions[this.currentQuestionId].goodAnswer = answerChosen;
		}
	}

	getClass(answerChosen){
		if(answerChosen == this.currentQuestion.goodAnswer){
			return 'good';
		}
		return '';

	}

	setQCMGood(answerChosen){
		let string = new String(answerChosen+';');
		let indexof = this.questions[this.currentQuestionId].goodAnswer.indexOf(string);
		if(indexof > -1){
			this.questions[this.currentQuestionId].goodAnswer=this.questions[this.currentQuestionId].goodAnswer.replace(string, '');
		}else{
			this.questions[this.currentQuestionId].goodAnswer += string;
		}

		this.questions[this.currentQuestionId].goodAnswer = this.sortQCM();

		this.replied = (this.questions[this.currentQuestionId].goodAnswer != '');
		
	}

	sortQCM(){
		let arr = this.questions[this.currentQuestionId].goodAnswer.split(';').sort();
		this.questions[this.currentQuestionId].goodAnswer ='';
		for(let item of arr){
			if(item){
				this.questions[this.currentQuestionId].goodAnswer += item + ';';
			}
		}
	}

	getQCMClass(answerChosen){
		if(this.questions[this.currentQuestionId].goodAnswer.indexOf(new String(answerChosen+';')) > -1){
			return 'good';
		}
		return '';

	}

	nextQuestion(){
		this.reply(this.questions[this.currentQuestionId].goodAnswer);
	}

	doNotReply(){
		this.reply(null);

	}

	reply(reponse){
		let data: any;
		data = {};
		data.user_id = this.user.getId();
		data.question_id = this.currentQuestion.id;
		data.reponse = reponse;
		this.api.post('question/reply', data)
		.subscribe(
			(data) => {
				let body: any;
				body = JSON.parse(data.text());
			},
			(err) => {
			},
			() => {
				//this.goToHome();
			});
		this.currentQuestionId++;
		this.currentResponse =null;
		if(this.currentQuestionId == this.questions.length){
			this.noMoreQuestion = true;
			this.goToQuestions('back');
		}else{
			this.noMoreQuestion = false;
			this.replied = false;

			switch(this.currentQuestion.type.name){
				case 'YMD':{
					this.sliderDay.lockSwipes(false);
					this.sliderMonth.lockSwipes(false);
					this.sliderYear.lockSwipes(false);
					break;
				}
				case 'YM':{
					this.sliderMonth.lockSwipes(false);
					this.sliderYear.lockSwipes(false);
					break;
				}
				case 'Y':{
					this.sliderYear.lockSwipes(false);
					break;
				}
				case 'INT':{
					this.int_value = null;
					break;
				}
				case 'TEXT':{
					this.text_value = null;
					break;
				}
				default:
				break;
			}
			
			this.currentQuestion = this.questions[this.currentQuestionId];
		}
	}

	quit(){
		this.goTo(QuestionsPage, 'backward', {});
	}

	validYMD(){
		this.questions[this.currentQuestionId].goodAnswer = this.sliderYear._slides[this.sliderYear.getActiveIndex()].innerText+ 
		'-' +
		this.sliderMonth._slides[this.sliderMonth.getActiveIndex()].dataset.value + 
		'-' + 
		this.sliderDay._slides[this.sliderDay.getActiveIndex()].dataset.value;
		this.sliderDay.lockSwipes(true);
		this.sliderMonth.lockSwipes(true);
		this.sliderYear.lockSwipes(true);
		this.replied = true;
	}

	validYM(){
		this.questions[this.currentQuestionId].goodAnswer = this.sliderYear._slides[this.sliderYear.getActiveIndex()].innerText+ 
		'-' +
		this.sliderMonth._slides[this.sliderMonth.getActiveIndex()].dataset.value;
		this.sliderMonth.lockSwipes(true);
		this.sliderYear.lockSwipes(true);
		this.replied = true;
	}

	validY(){
		this.questions[this.currentQuestionId].goodAnswer = this.sliderYear._slides[this.sliderYear.getActiveIndex()].innerText;
		this.sliderYear.lockSwipes(true);
		this.replied = true;
	}

	validINT(){
		this.questions[this.currentQuestionId].goodAnswer = this.int_value;
		this.replied = true;
	}

	validTEXT(){
		this.questions[this.currentQuestionId].goodAnswer = this.text_value;
		this.replied = true;
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
}
