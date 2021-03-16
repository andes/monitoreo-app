import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class VacunasService {


    private VacunasUrl = '/modules/vacunas';

    constructor(private server: Server) { }

    registrarVacunas(params: any): Observable<any[]> {
        return this.server.post(`${this.VacunasUrl}/paciente`, params);
    }
}
