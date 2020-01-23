import { IRegistroNovedades } from '../interfaces/IRegistroNovedades.interface';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';
import { IModuloAndes } from '../interfaces/IModuloAndes.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class RegistroNovedadesService {

    // URL to web api
    private url = '/modules/registro-novedades';
    private apiUri = environment.API;

    constructor(private server: Server) { }
    getAll(params): Observable<IRegistroNovedades[]> { // se obtienen los registros de novedades
        return this.server.get(this.url + `/novedades`, { params, showError: true });
    }

    postNuevoRegistro(newregNov: IRegistroNovedades): Observable<IRegistroNovedades[]> {
        return this.server.post(this.url + `/novedades`, { newregNov, showError: true });
    }
    patch(editNov: IRegistroNovedades): Observable<IRegistroNovedades> {
        const id = editNov._id;
        return this.server.patch(this.url + `/novedades/${id}`, editNov);
    }
    getAllModulos(): Observable<IModuloAndes[]> { // se obtienen todos los módulos de Andes
        return this.server.get(this.url + `/modulo_andes`, { showError: true });
    }

    getUrlImage(id, fileToken) {
        return this.apiUri + this.url + '/store/' + id + '?token=' + fileToken;
    }
}
