import { Injectable, Input } from '@angular/core';
import { Auth } from '@andes/auth';
import { Server } from '@andes/shared';
import { environment } from 'src/environments/environment';

@Injectable()
export class AdjuntosService {

    @Input() url = '/modules/restriccion-huds';

    private apiUri = environment.API;

    constructor(private server: Server, public auth: Auth) { }

    /*
     * @param params.id id devuelto por el metodo post.
     * @param params.estado estado para filtrar.
     */

    get(params) {
        return this.server.get(this.url, { params });
    }

    delete(id) {
        return this.server.delete(this.url + '/store/' + id);
    }

    upload(file, metadata) {
        return this.server.post(this.url + '/store', { file, metadata });
    }

    generateToken() {
        return this.server.post('/auth/file-token', {});
    }

    getUrlArchivo(id, fileToken) {
        return this.apiUri + this.url + '/store/' + id + '?token=' + fileToken;
    }
}
