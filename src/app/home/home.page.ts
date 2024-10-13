import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private navCtrl: NavController) {}

  enviarMensagem(event: Event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    const input = (event.target as HTMLFormElement).querySelector('.input_escrever') as HTMLInputElement;
    const mensagem = input.value;

    console.log('Mensagem enviada:', mensagem);
    input.value = '';
  }
}
