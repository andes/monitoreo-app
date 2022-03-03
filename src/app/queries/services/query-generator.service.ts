import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';
import { IFiltroQuery } from '../interfaces/IFiltroQuery.interface';


@Injectable()
export class QueriesGeneratorService {

    private biUrl = '/bi'; // URL to web api

    constructor(private server: Server) {
    }

    getAllQueries(params): Observable<any> {
        const res = this.server.get(`${this.biUrl}/queries`, { params, showError: true });
        return res;
    }

    descargar(consulta: IFiltroQuery, params) {
        const nombre = consulta.nombre || 'consulta';
        const options: any = { params, responseType: 'blob' };
        return this.server.get(`${this.biUrl}/queries/${nombre}/csv`, options);
    }
}
