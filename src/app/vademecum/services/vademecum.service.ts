import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IVademecumEntry } from '../interfaces/IVademecum';

@Injectable({ providedIn: 'root' })
export class VademecumService {
    private url = '/vademecum';

    constructor(private server: Server) { }

    searchMedications(params: { q?: string; limit?: number; status?: string }): Observable<IVademecumEntry[]> {
        return this.server.get(`${this.url}/medications`, { params }).pipe(
            map((res: any) => (res && res.data) ? res.data : (Array.isArray(res) ? res : []))
        );
    }

    getMedicationById(id: number): Observable<IVademecumEntry> {
        return this.server.get(`${this.url}/medications/${id}`).pipe(
            map((res: any) => (res && res.data) ? res.data : res)
        );
    }
}
