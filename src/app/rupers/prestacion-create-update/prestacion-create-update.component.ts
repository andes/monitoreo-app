import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnomedService } from 'src/app/shared/snomed.service';
import { ElementosRupService } from '../elementos-rup.service';
import { Unsubscribe } from '@andes/shared';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';

@Component({
    selector: 'rup-prestacion-create-update',
    templateUrl: './prestacion-create-update.component.html'
})
export class RUPPrestacionCreateUpdateComponent implements OnInit {
    titulo = 'Nueva prestación';
    elementosRup = [];
    public id: string;
    public elemento;
    public concepto;
    public requerido: ISnomedConcept;
    public sugerido: ISnomedConcept;

    constructor(
        private actr: ActivatedRoute,
        private snomedService: SnomedService,
        private elementosRUPService: ElementosRupService,
        private router: Router
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
            componente: 'PRESTACION',
            conceptos: [],
            requeridos: [],
            esSolicitud: false,
            tipo: 'prestacion',
            activo: true,
            defaultFor: [],
            frecuentes: []
        };
    }

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

    onSave() {
        this.elemento.conceptos = [this.concepto];
        // this.elemento.requeridos.forEach((elem) => elem.elementoRUP = this.elementoSeccion.id);
        this.elementosRUPService.save(this.elemento).subscribe(() => {
            this.router.navigate(['/elementos-rup'], { replaceUrl: true });
        });
    }

    onAddSugerido() {
        if (this.sugerido) {
            this.elemento.frecuentes.push(this.sugerido);
            this.sugerido = null;
        }
    }

    onAddRequerido() {
        if (this.requerido) {
            this.elemento.requeridos.push({ concepto: this.requerido });
            this.requerido = null;
        }
    }


}
