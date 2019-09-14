import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import { User } from "../user/user";

@Injectable()
export class HeaderProvider {
	private notifications:Notifications;

	constructor(public storage: Storage, public api: Api, public user: User) {	
		console.log(this.notifications);
		this.loadProfile();
	}


	async loadProfile(){
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

	setProfile(notif){
		this.profile= notifs;
	}

	setPlay(notif){
		this.play= notifs;
	}

	setSearch(notif){
		this.search= notifs;
	}

	setSettings(notif){
		this.settings= notifs;
	}

}
