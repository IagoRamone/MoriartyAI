import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email?: string;
  senha?: string;

  constructor(private router: Router) {}

  login() {
    console.log('Email:', this.email);
    console.log('Senha:', this.senha);
    this.router.navigate(['/home']);
  }

  goToCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
