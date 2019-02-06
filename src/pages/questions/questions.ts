import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AbstractPage } from '../abstract';
import { ProfilePage, ReplyLoaderPage } from '../pages';
import { Api, User } from '../../providers/providers';

@Component({
	selector: 'page-questions',
	templateUrl: 'questions.html'
})
export class QuestionsPage extends AbstractPage {

	display:number;

	questions:any[];
	baseQuestions:any[];

	search:string;

	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public storage: Storage,
		public toastCtrl: ToastController,
		public modalCtrl: ModalController,
		public params: NavParams,
		private sanitizer: DomSanitizer,
		public user: User,
		public api: Api) {
		super(viewCtrl, navCtrl, alertCtrl, toastCtrl, modalCtrl, params);
		this.display=1;
		//this.mock();
		let data: any;
		data = {};
		data.user_id = this.user.getId();
		this.api.post('question/get', data)
		.subscribe(
			(data) => {
				let body: any;
				body = JSON.parse(data.text());

				this.baseQuestions = body;
				this.questions = this.baseQuestions
			},
			(err) => {
			},
			() => {
				//this.goToHome();
			});
	}

	show(menu){
		this.display = menu;
	}

	goToReply(){
		this.goTo(ReplyLoaderPage, 'forward', {});
	}

	delete(questionId){
		let indexOf:number;
		this.questions.forEach((question, index) => {
			if(question.id == questionId){
				indexOf = index;
			}
		});

		let alert = this.confirm(
			'Suppresion', 
			'Veux-tu vraiment supprimer cette question ?',
			()=>{
				this.questions.splice(indexOf,1);
				this.searchQuestion(null);
				let data: any;
				data = {};
				data.user_id = this.user.getId();
				data.question_id = questionId;
				this.api.post('question/delete', data)
				.subscribe(
					(data) => {
					},
					(err) => {
					},
					() => {
						//this.goToHome();
					});
			});

		alert.present();

	}

	searchQuestion(event){
		var searchString = ''+this.search;
		if(this.search == undefined || searchString.length < 3){
			this.questions = this.baseQuestions;
			return;
		}
		let result:any[] = new Array();
		for(let question of this.baseQuestions){
			if(question.title.toLowerCase().indexOf(this.search.toLowerCase()) >= 0 || question.category.title.toLowerCase().indexOf(searchString.toLowerCase()) >= 0){
				result.push(question);
				continue;
			}else{
				if(question.type == 'QCM'){
					for(let answer of question.goodAnswer.text){
						if(answer.text && answer.text.toLowerCase().indexOf(searchString.toLowerCase()) >= 0){
							result.push(question);
							continue;
						}
					}
				}else{
					if(question.goodAnswer.text[0] && question.goodAnswer.text[0].toLowerCase().indexOf(searchString.toLowerCase()) >= 0){
						result.push(question);
						continue;
					}
				}
			}
		}
		this.questions = result;
	}
}
