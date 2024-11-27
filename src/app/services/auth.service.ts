import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<firebase.User | null>(null);
  user$ = this.userSubject.asObservable(); 

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.onAuthStateChanged((user) => {
      this.userSubject.next(user); 
    });
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('User signed in:', userCredential.user);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error; 
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

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

  getUserName(): string {
    const user = this.userSubject.value;
    if (user) {
      return user.displayName || user.email || 'Visitante';
    }
    return 'Visitante'; 
  }
}
