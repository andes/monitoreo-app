import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { WebHookService } from '../services/webhook.service';
import { IWebhook } from '../interfaces/IWebhook';
import { Auth } from '@andes/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-webkook',
    templateUrl: './webhook.component.html',
    styleUrls: ['./webhook.component.scss']
})

export class WebHookComponent implements OnInit {
    public filtro = '';
    public webHooks: IWebhook[];
    public webHook: IWebhook;
    private scrollEnd = false;
    public params = {
        skip: 0,
        limit: 10
    };
    public opciones: any[] = [{ id: 'POST', nombre: 'POST' }, { id: 'GET', nombre: 'GET' },
                              { id: 'PUT', nombre: 'PUT' }, { id: 'PATCH', nombre: 'PATCH' }];

    public opcionesTrasform: any[] = [{ id: 'fhir', nombre: 'fhir' }];

    constructor(
        public plex: Plex,
        private webhookService: WebHookService,
        private auth: Auth,
        private router: Router
    ) { }

    ngOnInit() {
        if (!this.auth.check('monitoreo:webhook')) {
            this.router.navigate(['./inicio']);
        }
        this.filtrarPorNombre('');
        this.webHook = {
            id: '',
            event: '',
            url: '',
            method: '',
            trasform: '',
            active: false,
            nombre: ''
        };
    }

    cerrar() {
        this.webHook.method = '';
    }

    nuevo() {
        this.webHook = {
            id: '',
            event: '',
            url: '',
            method: 'POST',
            trasform: '',
            active: false,
            nombre: ''
        };
    }

    editar(id) {
        this.webHooks = this.webHooks.filter(element => element.id === id);
        if (this.webHooks.length !== 0) {
            this.webHook = this.webHooks[0];
        }
    }

    creaModificaWebhook(webhook) {
        if (webhook.trasform != null) {
            webhook.trasform = webhook.trasform.nombre;
        }
        webhook.method = webhook.method.nombre;
        if (webhook.id === '') {
            this.webhookService.post(webhook).subscribe(resultado => {
                this.plex.info('info', 'El WebHook ' + (webhook.name) + ' fue agregado');
                this.filtrarPorNombre(this.filtro);
            });
        } else {
            this.webhookService.patch(webhook.id, webhook).subscribe(resultado => {
                this.plex.info('info', 'El webhook fue editado');
                this.webHook.method = '';
                this.filtrarPorNombre(webhook.name);
            });
        }
    }

    borrar(hook) {
        this.plex.confirm(hook.name, '¿Desea eliminar?').then(confirmacion => {
            if (confirmacion) {
                this.webhookService.delete(hook).subscribe(resultado => {
                    this.plex.info('info', 'El Webhook fue eliminado');
                    this.filtrarPorNombre(this.filtro);
                });
            }
        });
    }

    // Filtrado por expresion regular ingresada
    filtrarPorNombre(event) {
        this.webHooks = [];
        this.params.skip = 0;
        this.scrollEnd = false;
        if (event !== '') {
            this.filtro = event;
            const val = this.filtro;
            this.webhookService.get(val, this.params).subscribe(datos => {
                this.webHooks = datos;
                this.params.skip = this.webHooks.length;
            });
        }
    }

    onScroll() {
        if (!this.scrollEnd) {
            this.scroller(this.filtro);
        }
    }

    scroller(val) {
        this.webhookService.get(val, this.params).subscribe(datos => {
            this.webHooks = this.webHooks.concat(datos);
            this.params.skip = this.webHooks.length;
            if (datos.length < this.params.limit) {
                this.params.skip = 0;
                this.scrollEnd = true;
            }
        });
    }
}
