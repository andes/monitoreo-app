import { Component } from '@angular/core';
import { Plex } from '@andes/plex';
import { WebHookService } from '../services/webhook.service';
import { IWebhook } from '../interfaces/IWebhook';

@Component({
    selector: 'app-webkook',
    templateUrl: './webhook.component.html',
})

export class WebHookComponent{
    public encontro=false;
    public nuevoHook=false;
    public esEditar=true;
    public filtro='';
    public filtrado=[];
    public hooks;
    public webHooks: IWebhook[];
    public webHook: IWebhook;
    public opciones:any[] = [{id:'POST', nombre: 'POST' }, {id:'GET', nombre: 'GET' },
    {id:'PUT', nombre: 'PUT' }, {id:'PATCH', nombre: 'PATCH' }];

    constructor(
        public plex: Plex,
        private webhookService: WebHookService
    ) {
    }

    ngOnInit() {
        this.filtrarPorNombre('');
        this.hooks=[{
            name:'',
            event:'',
            url:'',
            method:'',
            active:false
        }];
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

    editar(id){
        this.encontro=false;
        this.webHooks = this.hooks.filter(element => element.id == id );
        if(this.webHooks.length!=0){
            this.encontro=true;
            this.webHook=this.webHooks[0];
        }
    }   

    cerrar(){
        this.encontro=false;
        this.nuevoHook=false;
        this.esEditar=true;
    }
    
    nuevo(){
        this.webHook = {
            id: '',
            event: '',
            url: '',
            method: 'POST',
            transform: '',
            active: false,
            name: ''
        };
        this.webHooks=[];
        this.nuevoHook=true;
        this.esEditar=false;
    }

    borrar(hook){
        this.plex.confirm(hook.nombre || hook.name, '¿Desea eliminar?').then(confirmacion => {
            if (confirmacion) {
                this.webhookService.delete(hook).subscribe(resultado => {
                    this.plex.info('info', 'El Webhook fue eliminado');
                });
            }
            this.nuevoHook=false;
            this.encontro=false;
            this.esEditar=true;
            this.filtrarPorNombre(this.filtro);
        });
    }
    //Trae todos los webhooks
    obtenerHooks(){
        this.webhookService.getAll().subscribe(datos => {
            this.webHooks=datos;
            this.filtrado=this.hooks;
        });
    }

    agregarWebhook(webhook) {
    this.esEditar=false;
        this.webhookService.post(webhook).subscribe(resultado => {
            this.plex.info('info', 'El WebHook '+(webhook.nombre||webhook.name)+ ' fue agregado');
        });

        this.nuevoHook=false;
        this.encontro=false;
        this.esEditar=true;
        this.filtrarPorNombre(this.filtro);
    }

    EditarWebhook(webhook) {
        this.esEditar=true;
        this.webhookService.patch(webhook.id, webhook).subscribe(resultado => {
            this.plex.info('info', 'El webhook fue editado');
            this.filtrarPorNombre(this.filtro);
            this.nuevoHook=false;
            this.encontro=false;
        });
    }

    //Filtrado por expresion regular ingresada
    filtrarPorNombre(event){
        if(this.filtro!=''){
            this.filtro=event.value;
            let val=this.filtro;
            this.filtrado=[];
                this.webhookService.get(val).subscribe(datos => {
                    this.hooks=datos;
                    this.webHooks=this.hooks;
                });
        }
        else{
            this.webHooks=[];
        }
    }

    onScroll(){
        console.log('scroll');
    }

}