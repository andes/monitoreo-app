import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable({ providedIn: 'root' })
export class SnomedService {
    private snomedURL = '/core/term/snomed';
    private snomedURLexpression = '/core/term/snomed/expression';

    constructor(private server: Server) {
    }

    get(params: any): Observable<any[]> {
        return this.server.get(this.snomedURL, { params, showError: true });
    }

    getCie10(params: any): Observable<any> {
        return this.server.get(this.snomedURL + '/map', { params, showError: true });
    }

    getQuery(params: any): Observable<any[]> {
        return this.server.get(this.snomedURLexpression, { params, showError: true });
    }

    getConcepts(sctids): Observable<any[]> {
        return this.server.get(this.snomedURL + '/concepts', { params: { sctids }, showError: true });
    }
}
