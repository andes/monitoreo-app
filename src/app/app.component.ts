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
    this.crearMenu();
  }

  public crearMenu() {
    this.menuList.push({ label: 'Webhooks', icon: 'hook', route: '/webhook' });
    this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login' });
    this.plex.updateMenu(this.menuList);
  }
}
