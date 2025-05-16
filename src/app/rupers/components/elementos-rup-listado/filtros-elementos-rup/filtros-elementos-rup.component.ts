import { Component } from '@angular/core';
import { ElementosRupListadoService, FilterKey } from '../elementos-rup-listado.service';
import { switchMap, distinct, map, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { SnomedService } from 'src/app/shared/snomed.service';

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

    conceptos: ISnomedConcept[] = [];
    snomedSearchTerm: string = '';

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
    busqueda: string = '';


    constructor(private listadoService: ElementosRupListadoService, private snomedService: SnomedService) { }

    onChange(key: FilterKey, { value }: { value: PlexSelectItem }) {

        this.listadoService.setFilter(key, value && value.id);

    }

    buscarConcepto() {
        if (!this.snomedSearchTerm || this.snomedSearchTerm.match(/<<\s{1,}/)) {
            this.snomedSearchTerm = '';
            return;
        }

        const query = {
            search: this.snomedSearchTerm
        };

        this.snomedService.get(query).subscribe((resultado: ISnomedConcept[]) => {
            this.conceptos = resultado;
            console.log('ENTRÓ');
            console.log(resultado);
        });
    }

    seleccionarConcepto(concepto: ISnomedConcept) {
        console.log('Seleccionaste:', concepto);
    }

    onSearchChange() {
        const termino = this.busqueda?.toLowerCase().trim();
        if (!termino) {
            this.listadoService.setFilter('concepto', null);
            return;
        }

        // Le pasamos el término al filtro del servicio
        this.listadoService.setFilter('concepto', termino);
    }


}
