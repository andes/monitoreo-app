import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ElementosRupService } from './elementos-rup.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ElementosRupResolver implements Resolve<any[]> {
    constructor(private service: ElementosRupService) { }
    resolve(): Observable<any> {
        return this.service.cache$;
    }
}
