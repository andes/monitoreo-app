import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class PacienteService {

    // URL to web api
    private pacienteUrl = '/core-v2/mpi/pacientes';

    constructor(private server: Server) { }
    get(params: any): Observable<any[]> { // se obtienen los registros de novedades
        return this.server.get(this.pacienteUrl, { params });
    }
}
