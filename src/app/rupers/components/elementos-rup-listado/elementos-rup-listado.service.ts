import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, from } from 'rxjs';
import { IElementoRUP } from 'src/app/shared/IElementoRUP';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { map, switchMap, filter, toArray } from 'rxjs/operators';
import { mergeObject } from '@andes/shared';

export type FilterKey = 'tipo' | 'componente';

@Injectable()
export class ElementosRupListadoService {

    private filtrosAction = new BehaviorSubject({});

    public filtros$ = this.filtrosAction.pipe(
        mergeObject()
    );

    elementosRupVisibles$: Observable<IElementoRUP[]> = this.elemtosRupService.cache$.pipe(
        map(elementos => this.elementosVisibles(elementos))
    );

    elementosRup$: Observable<IElementoRUP[]> = combineLatest([
        this.elementosRupVisibles$,
        this.filtros$
    ]).pipe(
        switchMap(([elementos, filtros]) => {
            return from(elementos).pipe(
                filter(elem => this.checkFilter(elem, filtros)),
                toArray()
            );
        })
    );

    constructor(
        private elemtosRupService: ElementosRupService,
    ) { }

    setFilter(key: FilterKey, value: any) {
        this.filtrosAction.next({ [key]: value });
    }

    /**
     * Son los elementos visibles para el usuario
     */
    elementosVisibles(elementos: IElementoRUP[]) {
        return elementos.filter(e => {
            return e.activo;
        });
    }

    checkFilter(elemento: IElementoRUP, filtros) {
        let pass = true;
        if (filtros.componente) {
            pass = pass && elemento.componente === filtros.componente;
        }

        if (filtros.tipo) {
            pass = pass && elemento.tipo === filtros.tipo;
        }

        return pass;
    }

}
