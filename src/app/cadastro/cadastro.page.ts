import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  nomeCompleto: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  cadastrar() {
    if (this.senha === this.confirmarSenha) {
      console.log('Cadastro realizado com sucesso:', {
        nomeCompleto: this.nomeCompleto,
        email: this.email,
        senha: this.senha,
      });
      this.router.navigate(['/home']);
    } else {
      console.log('Erro: As senhas não coincidem!');
    }
  }
}
