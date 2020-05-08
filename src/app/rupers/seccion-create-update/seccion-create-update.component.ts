import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { SnomedService } from 'src/app/shared/snomed.service';
import { Unsubscribe } from '@andes/shared';
import { ElementosRupService } from '../elementos-rup.service';

@Component({
    selector: 'rup-seccion-create-update',
    templateUrl: './seccion-create-update.component.html'
})
export class RUPSeccionCreateUpdateComponent implements OnInit {
    directionType = [
        { id: 'vertical', label: 'Vertical' },
        { id: 'horizontal', label: 'Horizontal' }
    ];

    elementosRup = [];
    public id: string;

    private elementoSeccion = null;

    public elemento = null;
    public concepto: ISnomedConcept;

    titulo = 'Nueva sección';

    constructor(
        private actr: ActivatedRoute,
        private snomedService: SnomedService,
        private elementosRUPService: ElementosRupService,
        private router: Router
    ) { }

    ngOnInit() {
        this.elementosRup = this.actr.snapshot.data.elementos;
        this.id = this.actr.snapshot.params.id;
        this.elementoSeccion = this.elementosRup.find(e => e.componente === 'SeccionComponent');

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
            componente: 'SeccionadoComponent',
            conceptos: [],
            requeridos: [],
            esSolicitud: false,
            tipo: 'molecula',
            activo: true,
            defaultFor: []
        };
    }

    @Unsubscribe()
    searchConcept($event) {
        if ($event.query.length > 3) {
            const query = {
                search: $event.query,
                semanticTag: ['procedimiento', 'elemento de registro']
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
        this.elemento.requeridos.forEach((elem) => elem.elementoRUP = this.elementoSeccion.id);
        this.elementosRUPService.save(this.elemento).subscribe(() => {
            this.router.navigate(['/elementos-rup'], { replaceUrl: true });
        });
    }

    nuevoRequerido() {
        return {
            elementoRUP: this.elementoSeccion.id,
            concepto: null,
            params: {
                showText: true,
                textRequired: true,
                conceptsRequired: false,
                icon: 'icon-andes-documento'
            }
        };
    }

    onAdd() {
        const nuevoRequerido = this.nuevoRequerido();
        this.elemento.requeridos.push(nuevoRequerido);
    }
}
