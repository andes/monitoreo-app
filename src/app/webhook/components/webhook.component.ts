import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { WebHookService } from '../services/webhook.service';
import { IWebhook } from '../interfaces/IWebhook';

@Component({
    selector: 'app-webkook',
    templateUrl: './webhook.component.html',
    styleUrls: ['./webhook.component.scss']
})

export class WebHookComponent implements OnInit {
    public encontro = false;
    public nuevoHook = false;
    public esEditar = true;
    public filtro = '';
    public filtrado = [];
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
        private webhookService: WebHookService
    ) { }

    ngOnInit() {
        this.filtrarPorNombre('');
        this.webHook = {
            id: '',
            event: '',
            url: '',
            method: 'POST',
            trasform: '',
            active: false,
            name: ''
        };

    }

    cerrar() {
        this.encontro = false;
        this.nuevoHook = false;
        this.esEditar = true;
    }

    nuevo() {
        this.webHook = {
            id: '',
            event: '',
            url: '',
            method: 'POST',
            trasform: '',
            active: false,
            name: ''
        };
        this.webHooks = [];
        this.nuevoHook = true;
        this.esEditar = false;
    }

    agregarWebhook(webhook) {
        if (webhook.trasform !== '') {
            webhook.trasform = webhook.trasform.nombre;
        }
        webhook.method = webhook.method.nombre;
        this.esEditar = false;
        this.webhookService.post(webhook).subscribe(resultado => {
            this.plex.info('info', 'El WebHook ' + (webhook.name) + ' fue agregado');
        });
        this.nuevoHook = false;
        this.encontro = false;
        this.esEditar = true;
        this.filtrarPorNombre(this.filtro);
    }

    editar(id) {
        this.encontro = false;
        this.webHooks = this.webHooks.filter(element => element.id === id);
        if (this.webHooks.length !== 0) {
            this.encontro = true;
            this.webHook = this.webHooks[0];
        }
    }

    editarWebhook(webhook) {
        if (webhook.trasform != null) {
            webhook.trasform = webhook.trasform.nombre;
        }
        webhook.method = webhook.method.nombre;
        this.esEditar = true;
        this.webhookService.patch(webhook.id, webhook).subscribe(resultado => {
            this.plex.info('info', 'El webhook fue editado');
            this.filtrarPorNombre(this.filtro);
            this.nuevoHook = false;
            this.encontro = false;
        });
    }

    borrar(hook) {
        this.plex.confirm(hook.name, '¿Desea eliminar?').then(confirmacion => {
            if (confirmacion) {
                this.webhookService.delete(hook).subscribe(resultado => {
                    this.plex.info('info', 'El Webhook fue eliminado');
                });
            }
            this.nuevoHook = false;
            this.encontro = false;
            this.esEditar = true;
            this.filtrarPorNombre(this.filtro);
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
            this.filtrado = [];
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
