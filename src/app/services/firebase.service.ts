// src/app/services/firebase.service.ts

import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.app);

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
      } else {
        console.log('No user is signed in.');
      }
    });
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in:', userCredential.user);
      return userCredential.user; 
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; 
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

}
