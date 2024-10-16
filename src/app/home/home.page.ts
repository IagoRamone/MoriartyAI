import { Component, ViewChild, ElementRef } from '@angular/core';

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

  constructor() {}

  // Criar um novo elemento de mensagem e retorná-lo
  mensagemCriada(conteudo: string, ...nomeClasse: string[]) {
    const div = document.createElement('div');
    div.classList.add('mensagem', ...nomeClasse);
    div.innerHTML = conteudo;
    return div;
  }

  // Mostrar a animação rodando (efeito de escrita)
  efeitoEscrita(text: string, elementoTexto: HTMLElement) {
    if (!text) {
      elementoTexto.innerText = 'Resposta não encontrada.'; // Mensagem padrão em caso de erro
      return;
    }

    const palavras = text.split(' ');
    let indexGlobal = 0;

    const escreverIntervalo = setInterval(() => {
      elementoTexto.innerText += ' ' + palavras[indexGlobal++];
      
      if (indexGlobal === palavras.length) {
        clearInterval(escreverIntervalo);
      }
    }, 75);
  }

  async geradorAPI(mensagemdeSaida1: HTMLElement) {
    const elementoTexto = mensagemdeSaida1.querySelector('.texto_lista') as HTMLElement;
    
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: this.mensagemUsuario }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Dados do erro:', errorData); 
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();
      console.log('Resposta da API:', JSON.stringify(data, null, 2));

      const apiResponse = data?.candidates[0]?.content?.parts[0]?.text || 'Resposta não encontrada.';
      
      this.efeitoEscrita(apiResponse, elementoTexto);
    } catch (error) {
      console.log('Erro na API:', error);
      elementoTexto.innerText = 'Desculpe, ocorreu um erro ao obter a resposta.'; 
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
    const html = `<div class="conteudo_mensagem">
                    <p class="texto_lista">${this.mensagemUsuario}</p>
                  </div>`;

    const mensagemdeSaida = this.mensagemCriada(html, 'usuario');
    this.listaChat.nativeElement.appendChild(mensagemdeSaida);

    this.formulario.nativeElement.reset();
    this.mensagemUsuario = '';

    setTimeout(() => this.carregamentoAnimacao(), 500);
  }

  enviarMensagem(event: Event) {
    event.preventDefault();
    console.log('Mensagem do usuário:', this.mensagemUsuario); 
    this.handleOutgoingChat();
  }
 
enviarMensagemDoCard(mensagem: string) {
  this.mensagemUsuario = mensagem; 
  this.enviarMensagem(new Event('submit')); 
}

}
