import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      console.log('Login bem-sucedido!');
      this.router.navigate(['/home']); 
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('E-mail ou senha inválidos. Tente novamente.');
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      console.log('Login com Google bem-sucedido!');
      this.router.navigate(['/home']); 
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
    }
  }
}
