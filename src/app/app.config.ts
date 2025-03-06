import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "danotes-d6091", "appId": "1:483274891859:web:0b102d25477058eaeb9ca6", "storageBucket": "danotes-d6091.firebasestorage.app", "apiKey": "AIzaSyCbQPSn4tXhWneGWFry8iyPUsV4JVvxM40", "authDomain": "danotes-d6091.firebaseapp.com", "messagingSenderId": "483274891859", "measurementId": "G-7Y03SKQYMP" }))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
