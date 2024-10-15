import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importar o AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).catch((error) => {
      console.error('Erro ao fazer login:', error);
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().catch((error) => {
      console.error('Erro ao fazer login com Google:', error);
    });
  }
}
