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

        this.plex.updateTitle('ANDES | Monitoreo');
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
                    this.menuList = [{ label: 'Seleccionar Organización', icon: 'hospital-building', route: '/login/select-organizacion' },
                    ...this.menuList];
                    this.plex.updateMenu(this.menuList);
                }
            });
        }
        this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
        if (this.auth.check('monitoreo:webhook')) {
            this.menuList.push({ label: 'Webhooks', icon: 'hook', route: '/webhook' });

        }
        if (this.auth.check('monitoreo:conceptosTurneables')) {
            this.menuList.push({ label: 'Conceptos Turneables', icon: 'clipboard-check', route: '/conceptos-turneables' });
        }
        if (this.auth.check('monitoreo:monitoreoActivaciones')) {
            this.menuList.push({ label: 'Monitoreo Activaciones', icon: 'cellphone-basic', route: '/monitor-activaciones' });
        }
        if (this.auth.check('monitoreo:webhookLog')) {
            this.menuList.push({ label: 'WebhookLogs', icon: 'webhook', route: '/webhooklog' });
        }
        if (this.auth.check('monitoreo:buscadorSnomed')) {
            this.menuList.push({ label: 'Buscador SNOMESeleccionarD', icon: 'magnify', route: '/buscador-snomed' });
        }
        if (this.auth.check('monitoreo:biQueries')) {
            this.menuList.push({ label: 'BI Queries', icon: 'database-search', route: '/queries' });
        }
        if (this.auth.check('monitoreo:regenerarCda')) {
            this.menuList.push({ label: 'Regenerar CDAs', icon: 'refresh', route: '/cda-regenerar' });
        }
        if (this.auth.check('monitoreo:novedades')) {
            this.menuList.push({ label: 'Novedades', icon: 'bell-outline', route: '/novedades' });
        }
        this.menuList.push({ label: 'Módulos', icon: 'card-plus', route: '/modulos' });
        this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login/logout' });
        this.plex.updateMenu(this.menuList);
    }
}
