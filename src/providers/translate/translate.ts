import { Injectable } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Storage} from "@ionic/storage";
import { Api } from '../api/api';
import {appSettings} from "../../app/app-settings";
import { Globalization } from "@ionic-native/globalization/ngx";

/*
  Generated class for the GaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class Translate {

    private lang: string;

    constructor(public translate: TranslateService,
      public storage: Storage,
      public globalization: Globalization) {
      console.log('Provider : Translate');
    }

    getDefaultLang(){
      return this.translate.getDefaultLang();
    }

    getNumber(objet) {
      return objet;
    }

    getLang(){
      return this.lang;
    }

    getTranslate(key){
     let word = key;
     this.translate.get(key).subscribe(
      value => {
        // value is our translated string
        word = value;
      }
      )
     return word;
   }

   setDefaultLang(lang) {
    this.translate.use(lang);
    this.translate.setDefaultLang(lang);
    this.storage.set('defaultLang', lang);
  }

  initTranslate() {
    return new Promise((resolve, reject) => {
      this.storage.get('defaultLang').then((value) => {
        if (value) {
          this.translate.use = value;
          this.translate.setDefaultLang(value);
          this.lang= value;
        }else{
          if (this.translate.getBrowserLang() !== undefined) {
            this.translate.use(this.translate.getBrowserLang());
            this.translate.setDefaultLang(this.translate.getBrowserLang());
            this.lang= this.translate.getBrowserLang();
          } else {
            let language = 'fr';
            this.globalization.getPreferredLanguage()
            .then(res => language = res.value)
            .catch(e => console.log(e));
            this.translate.use(language); // Set your language here
            this.translate.setDefaultLang(language);
            this.lang= language;
          }
        }
        console.log("Langue utilisée : " + this.lang);
        resolve(true);
      });
    });

  }


}
