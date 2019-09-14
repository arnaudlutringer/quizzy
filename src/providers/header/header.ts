import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import { User } from "../user/user";

@Injectable()
export class HeaderProvider {
	private notifications:Notifications;

	constructor(public storage: Storage, public api: Api, public user: User) {	
	}


	async loadProfile(){
		this.notifications = new Notifications();
		const notificationsFounded = await this.getApiNotifications();
		this.notifications.setProfile(notificationsFounded['profile']);

	}

	getNotifications(){
		return this.notifications;
	}
	
	getApiNotifications(){
		return new Promise((resolve, reject)=>{
			let data: any;
			data = {};
			data.lastConnected = this.user.getLastConnected();

			console.log(this.user);

			this.api.post('user/' + this.user.getId() + '/get-notifications', data)
			.subscribe(
				(data) => {
					let body: any;
					body = JSON.parse(data.text());
					resolve(body);
				},
				(err) => {
				},
				() => {
					//this.goToHome();
				});
		});
	}

}

@Injectable()
export class Notifications {
	private profile: any[];

	private play: any[];

	private search: any[];

	private settings: any[];

	constructor() {
		this.profile = new Array();
		this.play = new Array();
		this.search = new Array();
		this.settings = new Array();
	}

	setProfile(notifs){
		this.profile= notifs;
	}

	setPlay(notifs){
		this.play= notifs;
	}

	setSearch(notifs){
		this.search= notifs;
	}

	setSettings(notifs){
		this.settings= notifs;
	}

	getProfile(){
		return this.profile;
	}

}
