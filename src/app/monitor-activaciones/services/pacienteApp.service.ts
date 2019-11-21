import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPacienteApp } from '../interfaces/IPacienteApp';
import { Server } from '@andes/shared';

@Injectable()
export class PacienteAppService {

    private pacienteAppUrl = '/modules/mobileApp/pacienteApp';  // URL to web api

    constructor(private server: Server) { }

    get(params: any): Observable<IPacienteApp[]> {
        return this.server.get(this.pacienteAppUrl + `?documento=${params.documento}`, { showError: true });
    }


}

