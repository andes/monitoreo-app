import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPacienteApp } from '../interfaces/IPacienteApp';
import { Server } from '@andes/shared';

@Injectable()
export class PacienteAppService {

    private pacienteAppUrl = '/modules/mobileApp/pacienteApp'; // URL to web api

    constructor(private server: Server) { }

    get(params: any): Observable<IPacienteApp[]> {
        return this.server.get(this.pacienteAppUrl, { params, showError: true });
    }

    post(pacienteApp: IPacienteApp): Observable<IPacienteApp[]> {
        return this.server.post(this.pacienteAppUrl, { pacienteApp, showError: true });
    }

    patch(pacienteApp: IPacienteApp): Observable<IPacienteApp> {
        return this.server.patch(this.pacienteAppUrl + `/${pacienteApp._id}`, pacienteApp);
    }
}

