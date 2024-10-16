import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage {

  constructor() {}

  toggleDarkMode(event: any) {
    document.body.classList.toggle('dark', event.detail.checked);
  }

}
