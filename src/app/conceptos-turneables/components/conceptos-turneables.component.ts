import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Plex } from '@andes/plex';
import { IConceptoTurneable } from '../Interfaces/IConceptoTurneable';
import { ConceptoTruneableService } from '../services/concepto-turneable.service';
import { Auth } from '@andes/auth';
import { Router } from '@angular/router';


@Component({
    selector: 'app-conceptos-turneables',
    templateUrl: './conceptos-turneables.component.html',
})

 
export class ConceptosTurneablesComponent implements OnInit, OnDestroy {
    public conceptosTurneables: IConceptoTurneable[];
    public conceptoSeleccionado: IConceptoTurneable;
    private timeoutHandle: number;
    public textoLibre: string = null;
    loading = false;
    agregando = false;
    conceptID: string;
    term: string;
    constructor(
        public plex: Plex,
        private conceptoTurneableService: ConceptoTruneableService,
        private auth: Auth,
        private router: Router
    ) {
    }

    ngOnInit() {
        if (!this.auth.check('monitoreo:conceptosTurneables')) {
            this.router.navigate(['./inicio']);
        }
    }

    ngOnDestroy(): void {
        clearInterval(this.timeoutHandle);
    }

    public buscar() {
        // Cancela la búsqueda anterior

        if (this.timeoutHandle) {
            window.clearTimeout(this.timeoutHandle);
            this.loading = false;
        }

        this.conceptoSeleccionado = null;
        const conceptID = this.conceptID && this.conceptID.trim();
        const term = this.term && this.term.trim();

        if (conceptID || term) {
            this.loading = true;
            this.timeoutHandle = window.setTimeout(() => {
                this.timeoutHandle = null;
                this.conceptoTurneableService.get({
                    conceptId: this.conceptID,
                    term: '^' + this.term,
                }).subscribe(
                    resultado => {
                        this.loading = false;
                        this.conceptosTurneables = resultado;
                    },
                    (err) => {
                        this.loading = false;
                        this.conceptosTurneables = [];
                    }
                );
            }, 200);
        } else {
            this.conceptosTurneables = [];
        }
    }

    onRowClick(concepto: IConceptoTurneable) {
        if (!this.conceptoSeleccionado || this.conceptoSeleccionado.id !== concepto.id) {
            this.agregando = false;
            this.conceptoSeleccionado = concepto;
        } else {
            this.conceptoSeleccionado = null;
        }
    }

    agregar() {
        this.conceptID = null;
        this.term = null;
        this.conceptosTurneables = [];
        this.conceptoSeleccionado = null;
        this.toggleAgregar();
    }

    toggleAgregar() {
        this.agregando = !this.agregando;
    }

    onAgregarConceptoTurneable(conceptoTurneable) {
        this.plex.confirm('Agregar concepto turneable "' + conceptoTurneable.term + '"', '¿Desea agregar?').then(confirmacion => {
            if (confirmacion) {
                this.conceptoTurneableService.post(conceptoTurneable).subscribe(resultado => {
                    this.plex.info('info', 'El concepto turneable fue agregado');
                    this.toggleAgregar();
                });
            }
        });
    }

    onCancelarAgregarConceptoTurneable() {
        this.toggleAgregar();
    }

    onEditarConceptoTurneable(cambios) {
        this.conceptoTurneableService.patch(this.conceptoSeleccionado.id, cambios).subscribe(resultado => {
            this.plex.info('info', 'El concepto turneable fue editado');
            this.conceptoSeleccionado = resultado;
            this.conceptosTurneables.forEach(concepto => {
                if (concepto.id === resultado.id) {
                    concepto = resultado;
                }
            });
            this.buscar();
        });
    }

    onEliminarConceptoTurneable(conceptoTurneable) {
        if (this.conceptoSeleccionado && this.conceptoSeleccionado.id) {
            this.plex.confirm('Eliminar concepto turneable "' + conceptoTurneable.term + '"', '¿Desea eliminar?').then(confirmacion => {
                if (confirmacion) {
                    this.conceptoTurneableService.delete(conceptoTurneable).subscribe(resultado => {
                        this.plex.info('info', 'El Concepto Turneable fue eliminado');
                        this.conceptoSeleccionado = null;
                        let i = 0;
                        let index;
                        this.conceptosTurneables.forEach(concepto => {
                            if (concepto.id === conceptoTurneable.id) {
                                index = i;
                            }
                            i++;
                        });

                        this.conceptosTurneables.splice(index, 1);
                    });
                }
            });
        } else {
            this.plex.info('danger', 'No es posible dar de baja este Concepto Turneable');
        }
    }
}
