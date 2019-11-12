import { Observable } from 'rxjs/Observable';
import { IWebhook } from '../interfaces/IWebhook';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class WebHookService {
    private webHookUrl = '/modules/webhook'; 

    constructor(private server: Server) { }

    getAll() {
        return this.server.get(this.webHookUrl + '/webhooks/');
    }

    post(webHook): Observable<IWebhook> {
        return this.server.post(this.webHookUrl + '/webhooks/', webHook);
    }

    patch(id: String, cambios: any, options: any = {}): Observable<IWebhook> {
        return this.server.patch(this.webHookUrl +'/webhooks/'+`${id}`, cambios);
    }

    delete(webHook: IWebhook): Observable<any> {
        return this.server.delete(this.webHookUrl+'/webhooks/'+`${webHook.id}`);
    }
    
    get(nombre: String): Observable<IWebhook[]> {
        return this.server.get(this.webHookUrl +'/webhooks/'+`${nombre}`);
    }


    


}
