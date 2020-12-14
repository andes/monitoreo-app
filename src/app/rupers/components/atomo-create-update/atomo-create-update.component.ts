import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnomedService } from 'src/app/shared/snomed.service';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { Unsubscribe } from '@andes/shared';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { take } from 'rxjs/operators';

@Component({
    selector: 'rup-atomo-create-update',
    templateUrl: 'atomo-create-update.component.html'
})
export class RUPAtomoCreateUpdateComponent implements OnInit {

    valorNumericoType = [
        { id: 'integer', label: 'Entero' },
        { id: 'float', label: 'Decimales' }
    ];

    tipoAtomos = [
        { id: 'SelectOrganizacionComponent', nombre: 'Select Organizaciones' },
        { id: 'SelectProfesionalComponent', nombre: 'Select Profesionales' },
        { id: 'SelectSnomedComponent', nombre: 'Select Snomed Concept' },
        { id: 'SelectStaticoComponent', nombre: 'Select Estatico' },
        { id: 'ObservacionesComponent', nombre: 'Observaciones' },
        { id: 'ValorNumericoComponent', nombre: 'Valor Numerico' }
    ];

    tipoAtomo: { id: string, nombre: string } = null;

    titulo = 'Nuevo átomo';
    elementosRup = [];
    public id: string;
    public nombre: string;
    public elemento;
    public concepto;

    params: { [key: string]: any } = {};

    constructor(
        private actr: ActivatedRoute,
        private snomedService: SnomedService,
        private elementosRUPService: ElementosRupService,
        private router: Router
    ) { }

    @Unsubscribe()
    searchConcept($event) {
        if ($event.query.length > 3) {
            const query = {
                search: $event.query,
                // semanticTag: ['procedimiento', 'elemento de registro']<
            };
            this.snomedService.get(query).subscribe((conceptos: ISnomedConcept[]) => {
                $event.callback(conceptos);
            });
        } else {
            $event.callback([]);
        }
    }

    ngOnInit() {
        this.id = this.actr.snapshot.params.id;

        if (this.id) {
            this.elementosRUPService.cache$.pipe(take(1)).subscribe((elementosRup: any) => {
                this.elementosRup = elementosRup;
                this.elemento = this.elementosRup.find(e => e.id === this.id);
                this.titulo = this.elemento.conceptos[0].term;
                this.concepto = this.elemento.conceptos[0];
                this.params = this.elemento.params || {};
                this.tipoAtomo = this.tipoAtomos.find(item => item.id === this.elemento.componente);
                this.nombre = this.elemento.nombre;
            });
        } else {
            this.createElemento();
        }

    }

    createElemento() {
        this.elemento = {
            nombre: '',
            componente: 'PRESTACION',
            conceptos: [],
            requeridos: [],
            esSolicitud: false,
            tipo: 'atomo',
            activo: true,
            defaultFor: [],
            frecuentes: []
        };
    }

    onSave() {
        this.elemento.conceptos = [this.concepto];
        this.elemento.componente = this.tipoAtomo.id;
        this.elemento.params = this.params;
        this.elemento.nombre = this.nombre;
        this.elementosRUPService.save(this.elemento).subscribe(() => {
            this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
        });
    }
}
