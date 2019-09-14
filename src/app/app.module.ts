import { NgModule, ErrorHandler  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyApp } from './app.component';
import { Globalization } from '@ionic-native/globalization/ngx';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Http, HttpModule} from '@angular/http';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ProfilePage, ProfileCommentsPage, ContactPage, GamePage,
  LoadingPage, GameLoaderPage, QuestionsPage, ReplyLoaderPage, 
  ReplyPage, SettingsPage, SettingsInterestsPage, SearchPage } from '../pages/pages';
  import { Facebook } from "@ionic-native/facebook";
  import { CategoryProvider, FacebookService, User, Api, Friends, Translate, StringUtils, HeaderProvider } from '../providers/providers';
  import { StatusBar } from '@ionic-native/status-bar';
  import { SplashScreen } from '@ionic-native/splash-screen';
  import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

  @NgModule({
    declarations: [
    MyApp,
    ProfilePage,
    ProfileCommentsPage,
    ContactPage,
    LoadingPage,
    GamePage, 
    GameLoaderPage,
    ReplyPage, 
    ReplyLoaderPage,
    QuestionsPage,
    SettingsPage, 
    SettingsInterestsPage,
    SearchPage
    ],
    imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      mode: 'ios'
    }),
    IonicStorageModule.forRoot({
      name: '__quizzydb'
      //driverOrder: ['localstorage' ]
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
    MyApp,
    ProfilePage,
    ProfileCommentsPage,
    ContactPage,
    LoadingPage,
    GamePage, 
    GameLoaderPage,
    ReplyPage, 
    ReplyLoaderPage,
    QuestionsPage,
    SettingsPage,
    SettingsInterestsPage,
    SearchPage
    ],
    providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativePageTransitions,
    CategoryProvider, 
    Facebook,
    FacebookService,
    User,
    Api,
    Friends,
    Globalization,
    Translate,
    StringUtils,
    HeaderProvider
    ]
  })
  export class AppModule {}

  export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }