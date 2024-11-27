import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

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

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async cadastrar() {
    if (this.senha === this.confirmarSenha) {
      try {
        
        await this.firebaseService.register(this.email, this.senha, this.nomeCompleto);
        console.log('Cadastro realizado com sucesso');
        this.router.navigate(['/home']);
      } catch (error) {
        console.log('Erro ao cadastrar usuário:', error);
      }
    } else {
      console.log('Erro: As senhas não coincidem!');
    }
  }
}