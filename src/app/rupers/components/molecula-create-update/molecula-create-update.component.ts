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
            this.moleculaSeleccionado = requerido;
            this.params = requerido.params || {};
            requerido.params = this.params;

            const componenteId = requerido.componente || requerido.concepto.componente || this.getComponente(requerido.concepto); this.tipoAtomo = this.tipoAtomos.find(t => t.id === componenteId) || null;
            this.tituloSidebar = requerido.concepto.term || '-';
            this.nombreOrientativo = requerido.nombre || '';
            this.items = this.params.items || [];
        } else {
            console.warn('❌ requerido sin concepto:', requerido);
        }
    }


    confirmarMolecula() {
        if (this.moleculaSeleccionado) {
            this.plex.toast('success', 'Átomo guardado correctamente');
            this.moleculaSeleccionado = null;
            this.tituloSidebar = '';
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
        // Actualizá el nombre y conceptos de la molécula
        this.elemento.nombre = this.nombre;
        this.elemento.conceptos = [...this.conceptos];

        // Guardá la molécula completa (incluye todos los requeridos y sus params actualizados)
        this.elementosRUPService.save(this.elemento).subscribe(
            (elementoActualizado) => {
                this.plex.toast('success', 'Molécula guardada correctamente');
                // Si querés, podés actualizar this.elemento con el resultado:
                // this.elemento = elementoActualizado;
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
                const conceptoClonado = JSON.parse(JSON.stringify(this.requerido));
                const paramsClonados = elementoRUP.params ? JSON.parse(JSON.stringify(elementoRUP.params)) : {};

                this.elemento.requeridos.push({
                    concepto: conceptoClonado,
                    params: paramsClonados,
                    conceptos: [conceptoClonado], // <-- ESTA LÍNEA ES CLAVE
                    style: { columns: 12 }
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
    getNombreTipoAtomo(id: string): string {
        const tipo = this.tipoAtomos.find(t => t.id === id);
        return tipo ? tipo.nombre : id;
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
    getConceptoSeleccionado() {
        if (this.moleculaSeleccionado?.conceptos && this.moleculaSeleccionado.conceptos.length) {
            return this.moleculaSeleccionado.conceptos[0];
        }
        return this.moleculaSeleccionado?.concepto || null;
    }

    setConceptoSeleccionado(value) {
        if (this.moleculaSeleccionado?.conceptos && this.moleculaSeleccionado.conceptos.length) {
            this.moleculaSeleccionado.conceptos[0] = value;
        } else if (this.moleculaSeleccionado) {
            this.moleculaSeleccionado.concepto = value;
        }
    }
}



function arraymove(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}



