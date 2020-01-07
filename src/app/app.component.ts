import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private menuList = [];

  constructor(public server: Server, public plex: Plex) {
    server.setBaseURL(environment.API);
    // Si pide loguearse al inicio de la app cambiar server.setBaseURL(environment.HOST) por 
    // server.setBaseURL(environment.HOST + environment.API)
    // una vez logueado dejar como está para poder usar API_BI
    this.crearMenu();
    this.plex.updateTitle('ANDES | Monitoreo App');
  }

  public crearMenu() {
    this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
    this.menuList.push({ label: 'Webhooks', icon: 'hook', route: '/webhook' });
    this.menuList.push({ label: 'Conceptos Turneables', icon: 'clipboard-check', route: '/conceptos-turneables' });
    this.menuList.push({ label: 'Monitoreo Activaciones', icon: 'cellphone-basic', route: '/monitor-activaciones' });
    this.menuList.push({ label: 'WebhookLogs', icon: 'webhook', route: '/webhooklog' });
    this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login' });
    this.plex.updateMenu(this.menuList);
  }
}
