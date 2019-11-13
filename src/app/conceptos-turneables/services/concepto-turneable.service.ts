import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';
import { IConceptoTurneable } from '../Interfaces/IConceptoTurneable';

@Injectable()
export class ConceptoTruneableService {
    private conceptoTurneableUrl = '/core/tm/conceptosTurneables';  // URL to web api

    constructor(private server: Server) { }

    get(params: any): Observable<IConceptoTurneable[]> {
        return this.server.get(`${this.conceptoTurneableUrl}`, { params, showError: true });
    }

    getById(id: String): Observable<IConceptoTurneable> {
        return this.server.get(`${this.conceptoTurneableUrl}/${id}`, null);
    }

    post(conceptoTurneable: IConceptoTurneable): Observable<IConceptoTurneable> {
        return this.server.post(this.conceptoTurneableUrl, conceptoTurneable);
    }

    put(conceptoTurneable: IConceptoTurneable): Observable<IConceptoTurneable> {
        return this.server.put(`${this.conceptoTurneableUrl}/${conceptoTurneable.id}`, conceptoTurneable);
    }

    patch(id: String, cambios: any, options: any = {}): Observable<IConceptoTurneable> {
        return this.server.patch(`${this.conceptoTurneableUrl}/${id}`, cambios);
    }

    delete(conceptoTurneable: IConceptoTurneable): Observable<any> {
        return this.server.delete(`${this.conceptoTurneableUrl}/${conceptoTurneable.id}`);
    }
}