import { Server, Cache } from '@andes/shared';
import { Injectable } from '@angular/core';

@Injectable()
export class OrganizacionService {
    private organizacionUrl = '/core/tm/organizaciones';  // URL to web api
    constructor(public server: Server) { }

    @Cache({ key: true })
    configuracion(id: string) {
        return this.server.get(`${this.organizacionUrl}/${id}/configuracion`);
    }

}
