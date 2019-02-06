import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { appSettings } from '../../app/app-settings';
import { Storage } from "@ionic/storage";
import { Translate } from '../translate/translate';


@Injectable()
export class Api {
  private url = appSettings.API_URL;
  private apiToken = appSettings.API_TOKEN;

  private lang:string;

  constructor(public http: Http,
    public storage : Storage,
    public translate : Translate) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    //return this.http.get('assets/json/initGame.json');
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    body.token = this.apiToken;
    body.lang = this.translate.getLang();
    return this.http.post(this.url + '/' + endpoint, JSON.stringify(body), reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }

  postAuthent(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }
}
