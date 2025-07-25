import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { SnomedService } from 'src/app/shared/snomed.service';
import { Unsubscribe } from '@andes/shared';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { take } from 'rxjs/operators';
import { Plex } from '@andes/plex';

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
    public nombre: string;

    private elementoSeccion = null;

    public elemento = null;
    public concepto: ISnomedConcept;

    titulo = 'Nueva sección';
    tipoVisualizacion: string = null;
    constructor(
        private actr: ActivatedRoute,
        private snomedService: SnomedService,
        private elementosRUPService: ElementosRupService,
        private router: Router,
        private plex: Plex
    ) { }

    ngOnInit() {
        this.id = this.actr.snapshot.params.id;

        this.elementosRUPService.cache$.pipe(take(1)).subscribe((elementosRup: any) => {
            this.elementosRup = elementosRup;
            this.elementoSeccion = this.elementosRup.find(e => e.componente === 'SeccionComponent');
            if (this.id) {
                this.elemento = this.elementosRup.find(e => e.id === this.id);
                this.titulo = this.elemento.conceptos[0].term;
                this.concepto = this.elemento.conceptos[0];
                this.nombre = this.elemento.nombre;
            } else {
                this.createElemento();
            }
        });
    }

    createElemento() {
        this.elemento = {
            nombre: '',
            componente: 'SeccionadoComponent',
            conceptos: [],
            requeridos: [],
            esSolicitud: false,
            tipo: 'molecula',
            activo: true,
            defaultFor: [],
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
        this.elemento.nombre = this.nombre;
        this.elemento.conceptos = [this.concepto];
        this.elemento.requeridos.forEach((elem) => elem.elementoRUP = this.elementoSeccion.id);
        this.elementosRUPService.save(this.elemento).subscribe(() => {
            this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
        });
    }

    volver() {
        this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
    }

    nuevoRequerido() {
        return {
            elementoRUP: this.elementoSeccion.id,
            concepto: null,
            params: {
                showText: false,
                textRequired: false,
                conceptsRequired: false,

            },
            selected: false
        };
    }

    onAdd() {
        if (this.tipoVisualizacion === 'tabs' && this.elemento.requeridos.length >= 6) {
            this.plex.toast('warning', 'Recordar que no se pueden agregar más de 6 secciones');
            return;
        }
        const nuevoRequerido = this.nuevoRequerido();
        this.elemento.requeridos.push(nuevoRequerido);
    }
    async onVisualizacionChange(nuevoTipo: 'tabs' | 'dropdown') {
        if (nuevoTipo === 'tabs' && this.elemento.requeridos.length > 6) {
            const confirmado = await this.plex.confirm('Cambio a Tabs', 'Hay más de 6 secciones. ¿Deseás recortar a las primeras 6?');
            if (confirmado) {
                this.elemento.requeridos = this.elemento.requeridos.slice(0, 6);
                this.tipoVisualizacion = nuevoTipo;
            } else {
                // Cancelar el cambio
                this.tipoVisualizacion = 'dropdown';
            }
        } else {
            this.tipoVisualizacion = nuevoTipo;
        }
    }


    onElementoRUPChange(requerido: any) {

        if (requerido.params.elementoRUP) {
            requerido.params.showText = false;
            requerido.params.textRequired = false;
            requerido.params.conceptsRequired = false;
        }
    }


}
