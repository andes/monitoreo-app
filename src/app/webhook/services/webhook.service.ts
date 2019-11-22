import { Observable } from 'rxjs/Observable';
import { IWebhook } from '../interfaces/IWebhook';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class WebHookService {
    private webHookUrl = '/modules/webhook';

    constructor(private server: Server) { }

    get(name) {
        return this.server.get(`${this.webHookUrl}/webhook?name=^${name}`);
    }

    post(webHook): Observable<IWebhook> {
        return this.server.post(`${this.webHookUrl}/webhook/`, webHook);
    }

    patch(id, cambios: any, options: any = {}): Observable<IWebhook> {
        return this.server.patch(`${this.webHookUrl}/webhook/${id}`, cambios);
    }

    delete(webHook: IWebhook): Observable<any> {
        return this.server.delete(`${this.webHookUrl}/webhook/${webHook.id}`);
    }
}
