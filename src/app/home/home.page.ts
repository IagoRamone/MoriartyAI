import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('listaChat', { static: false }) listaChat!: ElementRef;
  @ViewChild('formulario', { static: false }) formulario!: ElementRef;

  mensagemUsuario: string = '';
  API_KEY = 'AIzaSyBKaty_AHxulY5w0mKeWj6wvWkAx25Ita0';
  API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.API_KEY}`;

  speechRecognition!: SpeechRecognition;

  userName: string = ''; 

  constructor(private cdr: ChangeDetectorRef, private authService: AuthService) {
    if ('webkitSpeechRecognition' in window) {
      this.speechRecognition = new (window as any).webkitSpeechRecognition();
      this.speechRecognition.lang = 'pt-BR';
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;

      this.speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log('Entrada de voz reconhecida:', transcript);
        this.mensagemUsuario = transcript.trim();
        this.handleOutgoingChat();
      };

      this.speechRecognition.onerror = (event: any) => {
        console.error('Erro na entrada de voz:', event.error);
      };
    } else {
      console.warn('Web Speech API não é suportada neste navegador.');
    }

    this.authService.user$.subscribe((user) => {
      this.userName = this.authService.getUserName(); 
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();

    if (!this.listaChat) {
      console.error('Elemento listaChat não foi inicializado.');
    }
  }

  // Método para deslogar o usuário
  logout() {
    this.authService.logout();  // Supondo que o AuthService tenha um método logout()
    console.log('Usuário deslogado');
  }

  mensagemCriada(conteudo: string, ...nomeClasse: string[]) {
    const div = document.createElement('div');
    div.classList.add('mensagem', ...nomeClasse);
    div.innerHTML = conteudo;
    return div;
  }

  exibirMensagemNoChat(titulo: string, texto: string, remetente: 'usuario' | 'chat') {
    const classeRemetente = remetente === 'usuario' ? 'mensagem-usuario' : 'mensagem-chat';
    const html = `<div class="conteudo_mensagem ${classeRemetente}">
                    <p class="texto_lista"><strong>${titulo}</strong> ${texto}</p>
                  </div>`;
    const mensagem = this.mensagemCriada(html);
    this.listaChat.nativeElement.appendChild(mensagem);
  }

  async geradorAPI(mensagemdeSaida1: HTMLElement) {
    const elementoTexto = mensagemdeSaida1.querySelector('.texto_lista') as HTMLElement;

    if (!elementoTexto) {
      console.error('Elemento ".texto_lista" não encontrado.');
      mensagemdeSaida1.classList.remove('carregamento');
      return;
    }

    const mensagemTrimmed = this.mensagemUsuario.trim();
    if (!mensagemTrimmed) {
      console.warn('Mensagem vazia, não será enviada.');
      elementoTexto.innerText = 'Mensagem vazia, tente novamente.';
      mensagemdeSaida1.classList.remove('carregamento');
      return;
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: mensagemTrimmed }] }], 
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
      console.log('Resposta da API:', apiResponse);

      elementoTexto.innerText = "Moriarty:" +  apiResponse;
    } catch (error) {
      console.error('Erro na API:', error);
      elementoTexto.innerText = 'Desculpe, ocorreu um erro.';
    } finally {
      mensagemdeSaida1.classList.remove('carregamento');
    }
  }

  handleOutgoingChat() {
    if (!this.listaChat) {
      console.error('Referência de listaChat não inicializada.');
      return;
    }

    if (!this.mensagemUsuario.trim()) {
      console.warn('Mensagem vazia ou inválida, não será enviada.');
      return;
    }

    console.log('Mensagem enviada pelo usuário:', this.mensagemUsuario);

    this.exibirMensagemNoChat('Você:', this.mensagemUsuario, 'usuario');

    const html = `<p class="texto_lista">...</p>`;
    const mensagemdeSaida = this.mensagemCriada(html, 'mensagem-chat', 'carregamento');
    this.listaChat.nativeElement.appendChild(mensagemdeSaida);

    this.geradorAPI(mensagemdeSaida);

    this.mensagemUsuario = '';
    if (this.formulario && this.formulario.nativeElement) {
      this.formulario.nativeElement.reset();
    }
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
