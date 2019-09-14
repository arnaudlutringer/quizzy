import { Component } from '@angular/core';
import { ViewController, AlertController, NavController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { ProfilePage, QuestionsPage, SettingsPage, SearchPage } from './pages';
import { HeaderProvider } from '../providers/providers';

@Component({})
export class AbstractPage {
    constructor(public viewCtrl: ViewController,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public params: NavParams,
        public header: HeaderProvider) {}

    goTo(page, direction, params){
        this.navCtrl.setRoot(page, params, {animate: true, direction: direction});
    }

    pushTo(page, direction, params){
        this.navCtrl.push(page, params, {animate: true, direction: direction});
    }

    goToProfile(direction){
        this.goTo(ProfilePage, direction, {});
    }

    goToQuestions(direction){
        this.goTo(QuestionsPage, direction, {});
    }

    goToSearch(direction){
        this.goTo(SearchPage, direction, {});
    }

    goToSettings(direction){
        this.goTo(SettingsPage, direction, {});
    }

    /*goToSearch(){
        this.goTo(ProfilePage, 'backward', {});
    }*/

    alert(message){
        let alert = this.alertCtrl.create({
            title: 'Oops',
            message: message,
            buttons: ['Retour']
        });
        alert.present();
    }

    toast(message){
        let alert = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            dismissOnPageChange: true,
        });
        alert.present();
    }

    toastError(message){
        let alert = this.toastCtrl.create({
            message: message,
            duration: 3000000,
            position: 'bottom',
            dismissOnPageChange: true,
            cssClass:'toast-error'
        });
        alert.present();
    }

    confirm(title, message, fnct){
        return this.alertCtrl.create({
          title: title,
          message: message,
          buttons: [
          {
              text: 'Annuler',
              role: 'cancel',
              cssClass: 'secondary'
          }, {
              text: 'Je confirme',
              handler: fnct
          }
          ]
      });
    }

    getNotifications(idMenu){
      if(idMenu == 1){
          return this.header.getNotifications().profile;
      }
      return new Array();
    }
}