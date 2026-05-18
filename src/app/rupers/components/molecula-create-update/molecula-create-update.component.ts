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
    titulo = 'Nueva molécula';
    elementosRup = [];
    public id: string;
    public elemento;
    public conceptos: ISnomedConcept[] = [];
    public requerido: ISnomedConcept;
    public conceptosPrevios: any[] = [];
    moleculaSeleccionado: any = null;
    nombre = '';
    nombreOrientativo = '';
    items: any[] = [];
    componenteSeleccionadoId = '';
    tituloSidebar = '';
    isMoleculaSeleccionada = false;
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
        this.elementosRUPService.cache$.pipe(take(1)).subscribe((elementosRup: any) => {
            this.elementosRup = elementosRup;
            if (this.id) {
                this.elemento = this.elementosRup.find(e => e.id === this.id);
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
                this.params = elementoPorOid?.params ?? (this.elemento.params || {});
                this.componenteSeleccionadoId = this.elemento.componente;
                this.tipoAtomo = this.tipoAtomos.find(t => t.id === this.elemento.componente);
            } else {
                this.createElemento();
            }
            this.conceptosPrevios = [...this.conceptos];
        });
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

            const elementoCompleto = this.getElementoRupCompleto(requerido);
            this.isMoleculaSeleccionada = elementoCompleto?.tipo === 'molecula' || componenteId === 'MoleculaBaseComponent';
        } else {
            this.plex.toast('❌ requerido sin concepto:', requerido);
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
        if ($event.query && $event.query.length > 3) {
            const query = { search: $event.query };
            this.snomedService.get(query).subscribe((conceptos: ISnomedConcept[]) => {
                const conceptosValidos = (conceptos || []).filter(c => !!c && !!c.conceptId);
                const fusion = [
                    ...this.conceptos,
                    ...conceptosValidos.filter(c => !this.conceptos.some(sel => sel.conceptId === c.conceptId))
                ];

                $event.callback(fusion);
            });
        } else {
            $event.callback(this.conceptos || []);
        }
    }
    async onConceptosChange(nuevos: ISnomedConcept[]) {
        const eliminados = this.conceptosPrevios.filter(
            c => !nuevos.some(n => n.conceptId === c.conceptId)
        );
        if (eliminados.length > 0) {
            const conceptoEliminado = eliminados[0];
            const confirmacion = await this.plex.confirm(
                `¿Estás seguro que deseas eliminar el concepto: ${conceptoEliminado.term} (${conceptoEliminado.semanticTag})?`,
                'Confirmar eliminación'
            );

            if (!confirmacion) {
                this.plex.toast('warning', 'Eliminación cancelada.', 'Cancelado');
                this.conceptos = [...this.conceptosPrevios];
                return;
            }
        }
        const agregados = nuevos.filter(
            n => !this.conceptosPrevios.some(c => c.conceptId === n.conceptId)
        );

        if (agregados.length > 0) {
            agregados.forEach(a => {
            });
        }
        this.conceptosPrevios = [...nuevos];
        this.conceptos = [...nuevos];
    }



    onSave() {
        this.elemento.nombre = this.nombre;

        const originalConceptosIds = (this.elemento.conceptos || []).map(c => String(c.conceptId));

        this.elemento.conceptos = [...this.conceptos];
        const conceptosIds = this.conceptos.map(c => String(c.conceptId));
        const isNew = !this.id && !this.elemento.id && !this.elemento._id;
        const conceptosAValidar = isNew ? conceptosIds : conceptosIds.filter(id => !originalConceptosIds.includes(id));

        const idActual = String(this.id || (this.elemento && typeof this.elemento.id === 'string' ? this.elemento.id : undefined) || (this.elemento && this.elemento._id ? (this.elemento._id.$oid || this.elemento._id) : undefined));

        let conceptoDuplicado = null;

        if (conceptosAValidar.length > 0) {
            conceptoDuplicado = this.elementosRup
                .filter(e => {
                    const eId = String(e.id || (e._id ? (e._id.$oid || e._id) : undefined) || (e.concepto && e.concepto.conceptId)); // fallback
                    return eId !== idActual && eId !== 'undefined';
                })
                .map(e => e.conceptos || [])
                .reduce((acc, val) => acc.concat(val), [])
                .find(c => conceptosAValidar.includes(String(c.conceptId)));
        }

        if (!this.conceptos || this.conceptos.length === 0) {
            this.plex.toast('danger', 'La molécula debe tener al menos un concepto.');
            return;
        }

        this.elemento.conceptos = [...this.conceptos];
        const conceptosIdsSeleccionados = this.conceptos
            .map(c => String(c.conceptId))
            .filter(id => !!id);

        conceptoDuplicado = this.elementosRup
            .filter(e => e.id !== this.id)
            .reduce((acc, e) => acc.concat(e.conceptos || []), [])
            .find(c => conceptosIdsSeleccionados.includes(String(c.conceptId)));
        if (conceptoDuplicado) {
            const rupersDuplicados = this.elementosRup
                .filter(e =>
                    e.id !== this.id &&
                    (e.conceptos || []).some(c => String(c.conceptId) === String(conceptoDuplicado.conceptId))
                );

            const nombresRuper = rupersDuplicados.map(e => `<b>${e.nombre || 'SIN NOMBRE'}</b>`).join('; ') || 'desconocido';

            this.plex.confirm(
                `El concepto "${conceptoDuplicado.fsn}" ya existe en los Ruper: ${nombresRuper}.<br>¿Deseas igualmente agregarlo aquí?`,
                'Concepto duplicado'
            ).then(confirmado => {
                if (confirmado) {
                    this.guardarMolecula();
                } else {
                    this.plex.toast('info', 'Operación cancelada por el usuario');
                }
            });
            return;
        } else {
            this.guardarMolecula();
        }
    }

    guardarMolecula() {
        this.elementosRUPService.save(this.elemento).subscribe(
            () => {
                this.plex.toast('success', 'Molécula guardada correctamente');
                this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
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
                this.plex.toast('success', 'Concepto agregado correctamente');
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
        this.plex.toast('success', 'Concepto eliminado correctamente');
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



