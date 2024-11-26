import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('listaChat') listaChat!: ElementRef;
  @ViewChild('formulario') formulario!: ElementRef;

  mensagemUsuario: string = '';
  API_KEY = 'AIzaSyBKaty_AHxulY5w0mKeWj6wvWkAx25Ita0';
  API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.API_KEY}`;

  speechRecognition!: SpeechRecognition;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.speechRecognition = new (window as any).webkitSpeechRecognition();
      this.speechRecognition.lang = 'pt-BR';
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;

      this.speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log('Entrada de voz reconhecida:', transcript);
        this.mensagemUsuario = transcript;
        this.handleOutgoingChat();  // Envia a mensagem assim que a voz for reconhecida
      };

      this.speechRecognition.onerror = (event: any) => {
        console.error('Erro na entrada de voz:', event.error);
      };
    } else {
      console.warn('Web Speech API não é suportada neste navegador.');
    }
  }

  mensagemCriada(conteudo: string, ...nomeClasse: string[]) {
    const div = document.createElement('div');
    div.classList.add('mensagem', ...nomeClasse);
    div.innerHTML = conteudo;
    return div;
  }

  async geradorAPI(mensagemdeSaida1: HTMLElement) {
    const elementoTexto = mensagemdeSaida1.querySelector('.texto_lista') as HTMLElement;

    // Verifique o valor de 'mensagemUsuario' antes de enviar à API
    console.log('Mensagem antes de enviar para a API:', this.mensagemUsuario);

    if (!this.mensagemUsuario.trim()) {
      console.log('Mensagem vazia, não enviando à API.');
      elementoTexto.innerText = 'Mensagem vazia, tente novamente.';
      return;
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: this.mensagemUsuario }] }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
        elementoTexto.innerText = 'Erro ao processar a resposta.';
        return;
      }

      const data = await response.json();
      const apiResponse = data?.candidates[0]?.content?.parts[0]?.text || 'Resposta não encontrada.';

      // Log para verificar o retorno da API
      console.log('Resposta da API:', apiResponse);

      elementoTexto.innerText = apiResponse;
    } catch (error) {
      console.error('Erro na API:', error);
      elementoTexto.innerText = 'Desculpe, ocorreu um erro.';
    } finally {
      mensagemdeSaida1.classList.remove('carregamento');
    }
  }

  carregamentoAnimacao() {
    const html = `<div class="conteudo_mensagem">
                    <p class="texto_lista"></p>
                    <div class="carregamento_indicador">
                      <div class="barra_carregamento"></div>
                      <div class="barra_carregamento"></div>
                      <div class="barra_carregamento"></div>
                    </div>
                  </div>`;

    const mensagemdeSaida1 = this.mensagemCriada(html, 'carregamento');
    this.listaChat.nativeElement.appendChild(mensagemdeSaida1);

    this.geradorAPI(mensagemdeSaida1);
  }

  handleOutgoingChat() {
    if (!this.mensagemUsuario.trim()) return;

    // Log para verificar a mensagem antes de exibir
    console.log('Mensagem enviada pelo usuário:', this.mensagemUsuario);

    this.exibirMensagemNoChat('Você:', this.mensagemUsuario);  // Exibe a pergunta do usuário no chat
    
    this.formulario.nativeElement.reset();
    this.mensagemUsuario = '';  // Limpa após o envio da mensagem

    setTimeout(() => this.carregamentoAnimacao(), 500);
  }

  exibirMensagemNoChat(titulo: string, texto: string) {
    const html = `<div class="conteudo_mensagem">
                    <p class="texto_lista"><strong>${titulo}</strong> ${texto}</p>
                  </div>`;
    const mensagem = this.mensagemCriada(html);
    this.listaChat.nativeElement.appendChild(mensagem);
  }

  enviarMensagem(event: Event) {
    event.preventDefault();
    this.handleOutgoingChat();
  }

  enviarMensagemDoCard(mensagem: string) {
    this.mensagemUsuario = mensagem;
    this.enviarMensagem(new Event('submit'));
  }

  iniciarVoz() {
    if (this.speechRecognition) {
      this.speechRecognition.start();
      console.log('Reconhecimento de voz iniciado.');
    } else {
      alert('Web Speech API não é suportada neste navegador.');
    }
  }
}
