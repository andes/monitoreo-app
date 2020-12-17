import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnomedService } from 'src/app/shared/snomed.service';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { Unsubscribe } from '@andes/shared';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { IElementoRUP } from 'src/app/shared/IElementoRUP';
import { take } from 'rxjs/operators';

@Component({
    selector: 'rup-prestacion-create-update',
    templateUrl: './prestacion-create-update.component.html'
})
export class RUPPrestacionCreateUpdateComponent implements OnInit {
    titulo = 'Nueva prestación';
    elementosRup = [];
    public id: string;
    public nombre: string;
    public elemento: IElementoRUP;
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
        this.id = this.actr.snapshot.params.id;

        if (this.id) {
            this.elementosRUPService.cache$.pipe(take(1)).subscribe((elementosRup: any) => {
                this.elementosRup = elementosRup;
                this.elemento = this.elementosRup.find(e => e.id === this.id);
                this.titulo = this.elemento.conceptos[0].term;
                this.concepto = this.elemento.conceptos[0];
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
            tipo: 'prestacion',
            activo: true,
            defaultFor: [],
            frecuentes: []
        } as any;
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
        this.elemento.nombre = this.nombre;
        this.elemento.conceptos = [this.concepto];
        // this.elemento.requeridos.forEach((elem) => elem.elementoRUP = this.elementoSeccion.id);
        this.elementosRUPService.save(this.elemento).subscribe(() => {
            this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
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

    onRemoveRequerido(index: number) {
        this.elemento.requeridos.splice(index, 1);
        this.elemento.requeridos = [...this.elemento.requeridos];
    }

    onRemoveSugerido(index: number) {
        this.elemento.frecuentes.splice(index, 1);
        this.elemento.frecuentes = [...this.elemento.frecuentes];
    }

    onUpRequerido(index: number) {
        if (index > 0) {
            arraymove(this.elemento.requeridos, index, index - 1);
        }
        this.elemento.requeridos = [...this.elemento.requeridos];
    }

    onDownRequerido(index: number) {
        if (index < this.elemento.requeridos.length - 1) {
            arraymove(this.elemento.requeridos, index, index + 1);
        }
        this.elemento.requeridos = [...this.elemento.requeridos];
    }

    onUpSugerido(index: number) {
        if (index > 0) {
            arraymove(this.elemento.frecuentes, index, index - 1);
        }
        this.elemento.frecuentes = [...this.elemento.frecuentes];
    }

    onDownSugerido(index: number) {
        if (index < this.elemento.frecuentes.length - 1) {
            arraymove(this.elemento.frecuentes, index, index + 1);
        }
        this.elemento.frecuentes = [...this.elemento.frecuentes];
    }
}

function arraymove(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
