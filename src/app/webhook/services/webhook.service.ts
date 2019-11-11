import { Observable } from 'rxjs/Observable';
import { IWebhook } from '../interfaces/IWebhook';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class WebHookService {
    private webHookUrl = '/modules/webhook'; 

    constructor(private server: Server) { }

    getAll() {
        return this.server.get(this.webHookUrl);
    }

    post(webHook): Observable<IWebhook> {
        return this.server.post(this.webHookUrl + '/nuevo', webHook);
    }

    patch(id: String, cambios: any, options: any = {}): Observable<IWebhook> {
        return this.server.patch(this.webHookUrl +'/editar/'+`${id}`, cambios);
    }

    delete(webHook: IWebhook): Observable<any> {
        return this.server.delete(this.webHookUrl+'/eliminar/'+`${webHook.id}`);
    }
    
    get(nombre: String): Observable<IWebhook> {
        return this.server.get(this.webHookUrl +'/filtro/'+`${nombre}`);
    }


    


}
