import { Component } from '@angular/core';
import { Plex } from '@andes/plex';
import { WebHookService } from '../services/webhook.service';
import { IWebhook } from '../interfaces/IWebhook';

@Component({
    selector: 'app-webkook',
    templateUrl: './webhook.component.html',
})

export class WebHookComponent {
    public encontro = false;
    public nuevoHook = false;
    public esEditar = true;
    public filtro = '';
    public filtrado = [];
    public webHooks: IWebhook[];
    public webHook: IWebhook;
    public opciones: any[] = [{ id: 'POST', nombre: 'POST' }, { id: 'GET', nombre: 'GET' },
    { id: 'PUT', nombre: 'PUT' }, { id: 'PATCH', nombre: 'PATCH' }];

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
            transform: '',
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
            transform: '',
            active: false,
            name: ''
        };
        this.webHooks = [];
        this.nuevoHook = true;
        this.esEditar = false;
    }

    agregarWebhook(webhook) {
        this.esEditar = false;
        webhook.method = webhook.method.nombre;
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
        this.webHooks = this.webHooks.filter(element => element.id == id);
        if (this.webHooks.length != 0) {
            this.encontro = true;
            this.webHook = this.webHooks[0];
        }
    }

    editarWebhook(webhook) {
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

    //Filtrado por expresion regular ingresada
    filtrarPorNombre(event) {
        if (this.filtro != '') {
            this.filtro = event.value;
            const val = this.filtro;
            this.filtrado = [];
            this.webhookService.get(val).subscribe(datos => {
                this.webHooks = datos;
            });
        } else {
            this.webHooks = [];
        }
    }
}
