import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";

@Injectable()
export class CategoryProvider {
	private categories:any[];

	constructor(public storage: Storage, public api: Api) {	}

	getCategories(){
		return this.categories;
	}

	getById(id){
		return this.categories[id];
	}

	getAllSelected(){
		let result:any[] = new Array();
		for(let category of this.categories){
			if(category.selected){
				result.push(category.id);
			}
		}
		return result;
	}

	getNbSelected(){
		let result:number = 0;
		for(let category of this.categories){
			if(category.selected){
				result++;
			}
		}
		return result;
	}

	load(){
		return new Promise((resolve, reject) => {
			console.log("Chargement des catégories");
			let data: any;
			data = {};

			this.api.post('category/all', data)
			.subscribe(
				(data) => {
					let body: any;
					this.categories = JSON.parse(data.text());
					for(let categorie of this.categories){
						let imgCat = new Image();
						imgCat.src = categorie.picture;
					}
					resolve();
				},
				(err) => {
					reject(err);
				},
				() => {
					//this.goToHome();
				});
		});
	}

	sort(){
		return this.categories.sort((cat1, cat2) =>{
			return cat1.name.localeCompare(cat2.name);
		})
	}
}
