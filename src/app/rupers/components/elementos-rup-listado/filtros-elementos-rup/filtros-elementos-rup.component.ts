import { Component } from '@angular/core';
import { ElementosRupListadoService, FilterKey } from '../elementos-rup-listado.service';
import { switchMap, distinct, map, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

export interface PlexSelectItem {
    id: string;
    nombre: string;
}

// type KEYS = keyof (typeof RUPFiltrosElementosRupComponent.filtros);

@Component({
    selector: 'rup-filtros-elementos-rup',
    templateUrl: 'filtros-elementos-rup.component.html'
})
export class RUPFiltrosElementosRupComponent {

    tipos$ = this.listadoService.elementosRup$.pipe(
        switchMap(elementos => {
            return from(elementos).pipe(
                map(e => e.tipo),
                distinct(),
                map(key => ({ id: key, nombre: key })),
                toArray()
            );
        })
    );

    componente$ = this.listadoService.elementosRup$.pipe(
        switchMap(elementos => {
            return from(elementos).pipe(
                map(e => e.componente),
                distinct(),
                map(key => ({ id: key, nombre: key })),
                toArray()
            );
        })
    );

    tipoSelected: PlexSelectItem = null;

    componenteSelected: PlexSelectItem = null;

    constructor(private listadoService: ElementosRupListadoService) { }

    onChange(key: FilterKey, { value }: { value: PlexSelectItem }) {

        this.listadoService.setFilter(key, value && value.id);

    }

}
