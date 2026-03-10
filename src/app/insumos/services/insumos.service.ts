import { Injectable } from '@angular/core';
import { Server, ResourceBaseHttp } from '@andes/shared';
import { IInsumo } from '../interfaces/IInsumo';

@Injectable({ providedIn: 'root' })
export class InsumosService extends ResourceBaseHttp<IInsumo> {
    protected url = '/modules/insumos';
    constructor(protected server: Server) {
        super(server);
    }
}
