import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import { User } from "../user/user";

@Injectable()
export class Friends {

	private friends: Friend[] = [];

	private currentFriendIndex: number;

	constructor(public storage: Storage, public api: Api, public user: User) {	}

	setCurrentFriendIndex(index){
		this.currentFriendIndex = index;
	}

	getCurrentFriendIndex(){
		return this.currentFriendIndex;
	}

	getFriends(){
		return this.friends;
	}

	getCurrentFriend(){
		return this.friends[this.currentFriendIndex];
	}

	load(){
		return new Promise((resolve, reject)=>{
			console.log("Chargement des amis du user " + this.user.getId());
			
			for(let friend of this.user.getFriends()){
				let fr = new Friend(
					friend['id'], 
					friend['username'], 
					friend['image_account'], 
					friend['description'],
					friend['firstname'],
					friend['lastname']);

				fr.setMyScore(friend['my_score']);
				fr.setHisScore(friend['his_score']);
				
				this.calculateTaux(fr);

				this.friends.push(fr);
			}

			resolve();
		});
	}

	updateScore(pts: number){
		let friend: Friend=this.friends[this.getCurrentFriendIndex()];
		friend.getMyScore().getAnswers().decrementNotPlayed();
		friend.getMyScore().incrementScore(pts);
		if(pts > 0){
			friend.getMyScore().getAnswers().incrementGood();
		}else{
			friend.getMyScore().getAnswers().incrementBad();
		}
		this.calculateTaux(friend);

		let data: any;
		data = {};
		data.user_request = this.user.getId();
		data.user_response = friend.getId();
		data.score = friend.getMyScore().getScore();

		this.api.post('user/update-score', data)
		.subscribe(
			(data) => {
			},
			(err) => {
			},
			() => {
				//this.goToHome();
			});

	}

	calculateTaux(friend){
		let good = friend.getMyScore().getAnswers().getGood();
		let bad = friend.getMyScore().getAnswers().getBad();
		let notPlayed = friend.getMyScore().getAnswers().getNotPlayed();

		let total = good + bad + notPlayed;

		friend.getMyScore().getTaux().setGood(Math.floor(good / total * 100));
		friend.getMyScore().getTaux().setBad(Math.floor(bad / total * 100));
		friend.getMyScore().getTaux().setNotPlayed(Math.floor(notPlayed / total * 100));


		good = friend.getHisScore().getAnswers().getGood();
		bad = friend.getHisScore().getAnswers().getBad();
		notPlayed = friend.getHisScore().getAnswers().getNotPlayed();

		total = good + bad + notPlayed;

		friend.getHisScore().getTaux().setGood(Math.floor(good / total * 100));
		friend.getHisScore().getTaux().setBad(Math.floor(bad / total * 100));
		friend.getHisScore().getTaux().setNotPlayed(Math.floor(notPlayed / total * 100));
	}

}

@Injectable()
export class Friend {
	private id: number;

	private username: string;

	private accountImageUrl: string;

	private description: string;

	private firstName: string;

	private lastName: string;

	private myScore: Score;

	private hisScore: Score;

	constructor(id: number, 
		username: string, 
		image_account: string, 
		description: string,
		firstName: string,
		lastName: string) {
		this.id = id;
		this.username = username;
		this.accountImageUrl = image_account;
		this.description = description;
		this.firstName = firstName;
		this.lastName = lastName;
	}

	setId(id){
		this.id = id;
	}

	getId(){
		return this.id;
	}

	setAccountImageUrl(url){
		this.accountImageUrl = url;
	}

	setDescription(description){
		this.description = description;
	}

	setLastName(lastName){
		this.lastName = lastName;
	}

	setFirstName(firstName){
		this.firstName = firstName;
	}

	setMyScore(score){
		this.myScore = new Score(score['score'], score['answers']);
	}

	getMyScore(){
		return this.myScore;
	}

	setHisScore(score){
		if(score){
			this.hisScore = new Score(score['score'], score['answers']);
		}
	}

	getHisScore(){
		return this.hisScore;
	}

}

@Injectable()
export class Score {
	private score: number;

	private answers: Answers;

	private taux: Taux;

	constructor(score: number, 
		answers: any[]) {
		this.score = score;
		this.answers = new Answers();
		this.answers.setFromArray(answers);
		this.taux = new Taux();
	}

	setAnswers(array){
		this.answers = new Answers();
		this.answers.setFromArray(array);
	}

	getAnswers(){
		return this.answers;
	}

	setScore(score){
		this.score = score;
	}

	getScore(){
		return this.score;
	}

	incrementScore(pts){
		this.score += pts;
	}

	getTaux(){
		return this.taux;
	}
}

@Injectable()
export class Answers {
	private total: number;

	private good: number;

	private bad: number;

	private notPlayed: number;

	setFromArray(answers){
		this.total = answers['total'];
		this.good = answers['good'];
		this.bad = answers['bad'];
		this.notPlayed = answers['not_played'];
	}

	decrementNotPlayed(){
		this.notPlayed--;
	}

	incrementGood(){
		this.good++;
	}

	incrementBad(){
		this.bad++;
	}

	getGood(){
		return this.good;
	}

	getBad(){
		return this.bad;
	}

	getNotPlayed(){
		return this.notPlayed;
	}
}

@Injectable()
export class Taux {
	private good: number;

	private bad: number;

	private notPlayed: number;

	constructor() {
		this.good = 0;
		this.bad = 0;
		this.notPlayed = 0;
	}

	setGood(good){
		this.good = good;
	}

	setBad(bad){
		this.bad = bad;
	}
	
	setNotPlayed(notPlayed){
		this.notPlayed = notPlayed;
	}

	setFromArray(taux){
		this.good = taux['good'];
		this.bad = taux['bad'];
		this.notPlayed = taux['not_played'];
	}
}