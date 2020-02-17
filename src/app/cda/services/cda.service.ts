import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class CdaService {

    // URL to web api
    private CDAGenerate = '/core/mpi/cda/regenerar';
    private CDAUrl = '/modules/cda/';

    constructor(private server: Server) { }

    getCDAList(idPaciente) {
        return this.server.get(this.CDAUrl + 'paciente/' + idPaciente);
    }

    regenerarCda(params: any): Observable<any[]> {
        return this.server.post(this.CDAGenerate, params);
    }
}
