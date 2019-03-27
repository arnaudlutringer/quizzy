import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import { CategoryProvider } from "../category/category";

@Injectable()
export class User {

	private id: number;

	private username: string;

	private categories:any[];

	private friends:any[];

	constructor(public storage: Storage, public api: Api, public categoryProvider: CategoryProvider) {	}

	getCategories(){
		return this.categories;
	}

	getId(){
		return this.id;
	}

	getUsername(){
		return this.username;
	}

	getFriends(){
		return this.friends;
	}

	getModel(){
		let result:any = {};
		result.id = this.id;
		result.categories = this.categories;
		result.friends = this.friends;
		return result;
	}

	load(id){
		return new Promise((resolve, reject)=>{
			console.log("Chargement du user "+id);
			let data: any;
			data = {};

			this.api.post('user/' + id, data)
			.subscribe(
				(data) => {
					let body: any;
					body = JSON.parse(data.text());

					this.id = body['id'];
					this.username = body['username'];
					this.friends = body['friends'];

					this.categories = new Array();

					let hisCategories:number[] = body.categories;
					for(let category of this.categoryProvider.getCategories()){
						if(hisCategories.indexOf(+category.id) > -1){
							category.selected = 1;
						}else{
							category.selected = 0;
						}
						this.categories.push(category);
						resolve();
					}
				},
				(err) => {
				},
				() => {
					//this.goToHome();
				});
		});
	}

	updateCategories(){
		let data: any;
		data = {};
		data.categories = this.categoryProvider.getAllSelected();

		this.api.post('user/'+this.id+'/update-categories', data)
		.subscribe(
			(data) => {
				let body: any;
				this.categories = JSON.parse(data.text());
			},
			(err) => {
			},
			() => {
				//this.goToHome();
			});
	}
}
