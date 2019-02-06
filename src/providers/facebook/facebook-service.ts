import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Injectable()
export class FacebookService {

  session: any;

  constructor (public facebook: Facebook) {}

  loginFB(){
    //On demande les permissions suivantes: email
    this.facebook.login(['public_profile', 'email'])
    .then((res: FacebookLoginResponse) => alert('Logged into Facebook!'))
    .catch(e => alert('Error logging into Facebook : '+JSON.stringify(e)));
  }
}