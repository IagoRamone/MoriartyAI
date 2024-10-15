// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Login com email e senha
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('User signed in:', userCredential.user);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error; // Propaga o erro para que o componente possa tratar
    }
  }

  // Logout
  async logout() {
    try {
      await this.afAuth.signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

  // Login com Google
  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('User signed in with Google:', result.user);
    } catch (error) {
      console.error('Error during Google sign in:', error);
      throw error;
    }
  }
}
