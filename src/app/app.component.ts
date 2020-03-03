import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private menuList = [];

  constructor(public server: Server, public plex: Plex, public auth: Auth) {
    server.setBaseURL(environment.API);

    this.plex.updateTitle('ANDES | Monitoreo App');
    const token = this.auth.getToken();
    if (token) {
      this.auth.session().subscribe(() => {
        // Inicializa el menú
        this.crearMenu();
      });
    }
  }

  public crearMenu() {
    this.menuList = [];
    if (this.auth.loggedIn()) {
      this.auth.organizaciones().subscribe(data => {
        if (data.length > 1) {
          this.menuList = [{ label: 'Seleccionar Organización', icon: 'home', route: '/login/select-organizacion' }, ...this.menuList];
          this.plex.updateMenu(this.menuList);
        }
      });
    }
    this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
    this.menuList.push({ label: 'Webhooks', icon: 'hook', route: '/webhook' });
    this.menuList.push({ label: 'Conceptos Turneables', icon: 'clipboard-check', route: '/conceptos-turneables' });
    this.menuList.push({ label: 'Monitoreo Activaciones', icon: 'cellphone-basic', route: '/monitor-activaciones' });
    this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login/logout' });
    this.plex.updateMenu(this.menuList);
  }
}
