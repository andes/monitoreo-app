import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISendMessageCache } from '../interfaces/ISendMessageCache';
import { Server } from '@andes/shared';

@Injectable()
export class SendMessageCacheService {

    private sendMessageCacheUrl = '/modules/mobileApp/sendMessageCache';  // URL to web api

    constructor(private server: Server) { }

    get(params: any): Observable<ISendMessageCache[]> {
        return this.server.get(this.sendMessageCacheUrl, { params, showError: true });
    }


}

