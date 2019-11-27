import { IWebhooklog } from '../interfaces/IWebhook-log';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class WebhookLogService {

    // URL to web api
    private webhlUrl = '/modules/webhooklogs';

    constructor(private server: Server) { }

    getById(id: any): Observable<IWebhooklog> {
        const res = this.server.get(this.webhlUrl + '/' + id);
        return res;
    }

    /**
     *
     * @param busq realiza busqueda por event y URL (faltaría agregar por fecha)
     */

    getAllSinFechas(query: any): Observable<IWebhooklog[]> {
        let busq = '';
        let url = this.webhlUrl;
        if (JSON.stringify(query) !== JSON.stringify({})) {
            url = url + `?skip=${query.skip}` + `&limit=${query.limit}`;
            if (query.search) {
                busq = `&search=^${query.search}`;
            }
            return this.server.get(url + busq, { showError: true });
        } else {
            return this.server.get(url, { showError: true });
        }
    }

    getAll(query: any): Observable<IWebhooklog[]> {
        let fI = '';
        let busq = '';
        let url = this.webhlUrl;
        if (JSON.stringify(query) !== JSON.stringify({})) {
            url = url + `?skip=${query.skip}` + `&limit=${query.limit}`;
            if (query.search) {
                busq = `&search=^${query.search}`;
            }
            if (query.fecha) {
                fI = (query.search) ? '&' : '?';
                fI = fI + `fecha=${query.fecha}`;
            }
            return this.server.get(url + busq + fI, { showError: true });
        } else {
            return this.server.get(url, { showError: true });
        }
    }
}
