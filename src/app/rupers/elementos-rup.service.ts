import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server, cache } from '@andes/shared';

@Injectable({ providedIn: 'root' })
export class ElementosRupService extends ResourceBaseHttp {
    protected url = '/modules/rup/elementos-rup';

    public cache$ = this.search({ limit: 1000 }).pipe(cache());

    constructor(protected server: Server) {
        super(server);
    }
}
