import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnomedService } from 'src/app/shared/snomed.service';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { Unsubscribe } from '@andes/shared';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { Plex } from '@andes/plex';
import { take } from 'rxjs/operators';

@Component({
    selector: 'rup-molecula-create-update',
    templateUrl: './molecula-create-update.component.html'
})
export class RUPMoleculaCreateUpdateComponent implements OnInit {
    titulo = 'Nueva molecula';
    elementosRup = [];

    public id: string;

    public elemento;


    public conceptos: ISnomedConcept[] = [];


    public requerido: ISnomedConcept;

    moleculaSeleccionado: any = null;



    nombre = '';

    nombreOrientativo = '';



    items: any[] = [];



    componenteSeleccionadoId = '';



    tituloSidebar = '';

    params: any = {};

    valorNumericoType = [
        { id: 'integer', label: 'Entero' },
        { id: 'float', label: 'Decimales' }
    ];

    checkOrientacionType = [
        { id: 'vertical', label: 'Vertical' },
        { id: 'horizontal', label: 'Horizontal' }
    ];

    tipoAtomo: { id: string; nombre: string } = null;

    tipoAtomos = [
        { id: 'SelectOrganizacionComponent', nombre: 'Select Organizaciones' },
        { id: 'SelectProfesionalComponent', nombre: 'Select Profesionales' },
        { id: 'SelectSnomedComponent', nombre: 'Select Snomed Concept' },
        { id: 'SelectStaticoComponent', nombre: 'Select Estatico' },
        { id: 'ObservacionesComponent', nombre: 'Observaciones' },
        { id: 'ValorNumericoComponent', nombre: 'Valor Numerico' },
        { id: 'ChecklistComponent', nombre: 'CheckList' }
    ];


    constructor(
        private actr: ActivatedRoute,
        private snomedService: SnomedService,
        private elementosRUPService: ElementosRupService,
        private router: Router,
        private plex: Plex,

    ) { }



    ngOnInit() {
        this.id = this.actr.snapshot.params.id;




        if (this.id) {
            this.elementosRUPService.cache$.pipe(take(1)).subscribe((elementosRup: any) => {




                this.elementosRup = elementosRup;


                this.elemento = this.elementosRup.find(e => e.id === this.id);



                this.conceptos = [...(this.elemento.conceptos || [])];

                this.params = { ...this.elemento.params };
                this.items = this.params.items ? [...this.params.items] : [];

                this.tipoAtomo = this.tipoAtomos.find(t => t.id === this.elemento.componente) || null;
                this.titulo = this.elemento.conceptos[0].term;
                this.conceptos = [...(this.elemento.conceptos || [])];


                this.nombre = this.elemento.nombre;

                const oid = this.elemento.conceptos[0]?._id?.$oid;


                // Buscar el elemento por OID
                const elementoPorOid = this.elementosRup.find(e =>
                    e.conceptos && e.conceptos[0] && e.conceptos[0]._id && e.conceptos[0]._id.$oid === oid
                );


                // Acceder a los params de ese elemento
                if (elementoPorOid && elementoPorOid.params) {
                    this.params = elementoPorOid.params;

                } else {
                    this.params = this.elemento.params || {};
                }


                this.componenteSeleccionadoId = this.elemento.componente;

                this.tipoAtomo = this.tipoAtomos.find(t => t.id === this.elemento.componente);

            });
        } else {

            this.createElemento();


        }

    }
    abrirMolecula(requerido: any) {
        if (requerido && requerido.concepto) {

            const elementoRUP = this.elementosRUPService.buscarElemento(requerido.concepto, false);

            if (!elementoRUP) {
                this.plex.toast('danger', 'No se encontró el elemento RUP completo para este requerido');
                return;
            }

            this.moleculaSeleccionado = elementoRUP;
            this.params = elementoRUP.params || {}; // <-- SIEMPRE desde el elemento completo

            this.tipoAtomo = this.tipoAtomos.find(t => t.id === elementoRUP.componente) || null;
            this.tituloSidebar = requerido.concepto.term || '-';
            this.nombreOrientativo = elementoRUP.nombre || '';
            this.items = this.params.items || [];


        } else {
            console.warn('❌ requerido sin concepto:', requerido);
        }
    }


    confirmarMolecula() {
        if (this.moleculaSeleccionado) {
            this.requerido = this.moleculaSeleccionado;
            this.nombre = this.moleculaSeleccionado.term || '';
            this.moleculaSeleccionado = null;
        }

    }


    getElementoRupCompleto(requerido: any) {
        return this.elementosRup.find(e =>
            e.conceptos && e.conceptos[0] && e.conceptos[0].conceptId === requerido.concepto.conceptId
        );
    }

    createElemento() {
        this.elemento = {
            nombre: this.nombre,
            componente: 'MoleculaBaseComponent',
            conceptos: [],
            requeridos: [],
            esSolicitud: false,
            tipo: 'molecula',
            activo: true,
            defaultFor: [],
            frecuentes: [],
            params: {}
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

        this.elemento.nombre = this.nombre;
        this.elemento.conceptos = [...this.conceptos];


        if (this.moleculaSeleccionado && this.moleculaSeleccionado.id) {
            this.moleculaSeleccionado.params = { ...this.params };
            this.moleculaSeleccionado.nombre = this.nombreOrientativo;
            this.elementosRUPService.save({
                ...this.moleculaSeleccionado,
                params: { ...this.moleculaSeleccionado.params }
            }).subscribe(
                (atomoActualizado) => {
                    this.moleculaSeleccionado = atomoActualizado;
                    this.plex.toast('success', 'Átomo guardado correctamente');
                },
                (err) => {
                    this.plex.toast('danger', 'Error al guardar el átomo');
                }
            );
        }

        // ...lógica de guardado de la molécula...
        this.elementosRUPService.save(this.elemento).subscribe(
            (elementoActualizado) => {
                // ...actualización en memoria...
            },
            (err) => {
                this.plex.toast('danger', 'Error al guardar la molécula');
            }
        );
    }

    volver() {
        this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
    }

    onAddRequerido() {
        if (this.requerido) {
            const elementoRUP = this.elementosRUPService.buscarElemento(this.requerido, false);
            if (elementoRUP) {
                this.elemento.requeridos.push({
                    concepto: this.requerido,
                    style: {
                        columns: 12
                    },
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


    getComponenteRequeridoSeleccionado(): string {
        const concepto = this.moleculaSeleccionado?.requerido?.concepto;
        if (!concepto) {
            return '';
        }

        const elementoRUP = this.elementosRUPService.buscarElemento(concepto, false);
        return elementoRUP?.componente || '';
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

    onRemoveRequerido(index: number) {
        this.elemento.requeridos.splice(index, 1);
        this.elemento.requeridos = [...this.elemento.requeridos];
    }

}



function arraymove(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}



