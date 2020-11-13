import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';
import { Observable } from 'rxjs';

@Injectable()
export class FuentesAutenticasService {
    protected url = '/core-v2/mpi/';
    constructor(protected server: Server) { }

    renaperStatus(): Observable<any> {
        return this.server.get(`${this.url}renaper/status`);
    }

    sisaStatus(): Observable<any> {
        return this.server.get(`${this.url}sisa/status`);
    }
}
