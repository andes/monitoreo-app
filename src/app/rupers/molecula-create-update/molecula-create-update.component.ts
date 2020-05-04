import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnomedService } from 'src/app/shared/snomed.service';
import { ElementosRupService } from '../elementos-rup.service';
import { Unsubscribe } from '@andes/shared';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { Plex } from '@andes/plex';

@Component({
    selector: 'rup-molecula-create-update',
    templateUrl: './molecula-create-update.component.html'
})
export class RUPMoleculaCreateUpdateComponent implements OnInit {
    titulo = 'Nueva molecula';
    elementosRup = [];
    public id: string;
    public elemento;
    public concepto;
    public requerido: ISnomedConcept;

    constructor(
        private actr: ActivatedRoute,
        private snomedService: SnomedService,
        private elementosRUPService: ElementosRupService,
        private router: Router,
        private plex: Plex
    ) { }

    ngOnInit() {
        this.elementosRup = this.actr.snapshot.data.elementos;
        this.id = this.actr.snapshot.params.id;

        if (this.id) {
            this.elemento = this.elementosRup.find(e => e.id === this.id);
            this.titulo = this.elemento.conceptos[0].term;
            this.concepto = this.elemento.conceptos[0];
        } else {
            this.createElemento();
        }

    }

    createElemento() {
        this.elemento = {
            componente: 'MoleculaBaseComponent',
            conceptos: [],
            requeridos: [],
            esSolicitud: false,
            tipo: 'molecula',
            activo: true,
            defaultFor: [],
            frecuentes: []
        };
    }

    @Unsubscribe()
    searchConcept($event) {
        if ($event.query.length > 3) {
            const query = {
                search: $event.query
            };
            this.snomedService.get(query).subscribe((conceptos: ISnomedConcept[]) => {
                $event.callback(conceptos);
            });
        } else {
            $event.callback([]);
        }
    }

    onSave() {
        this.elemento.conceptos = [this.concepto];
        // this.elemento.requeridos.forEach((elem) => elem.elementoRUP = this.elementoSeccion.id);
        this.elementosRUPService.save(this.elemento).subscribe(() => {
            this.router.navigate(['/elementos-rup'], { replaceUrl: true });
        });
    }

    onAddRequerido() {
        if (this.requerido) {
            const elementoRUP = this.elementosRUPService.buscarElemento(this.requerido, false);
            if (elementoRUP) {
                this.elemento.requeridos.push({
                    elementoRUP: elementoRUP.id,
                    concepto: this.requerido,
                    style: {
                        columns: 12
                    },
                    // Obligatorio por ahora
                    params: elementoRUP.params
                });
                this.requerido = null;
            } else {
                this.plex.toast('danger', 'Concepto no tiene implementacion');
            }
        }
    }

    getComponente(concepto: ISnomedConcept) {
        const elementoRUP = this.elementosRUPService.buscarElemento(concepto, false);
        return elementoRUP.componente;
    }

}
