import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';
import { SnomedService } from 'src/app/shared/snomed.service';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { IConceptoTurneable } from '../Interfaces/IConceptoTurneable';

@Component({
    selector: 'app-concepto-turneable-nuevo',
    templateUrl: './nuevo-concepto-turneable.component.html',
})
export class NuevoConceptoTurneableComponent implements OnInit {
    @Output() agregarConceptoTurneable = new EventEmitter<IConceptoTurneable>();
    @Output() cancelarAgregarConceptoTurneable = new EventEmitter<any>();

    private timeoutHandle: number;
    term: string;
    conceptosSnomed: ISnomedConcept[];
    conceptoSnomedSeleccionado: ISnomedConcept;
    nuevoConceptoTurneable: IConceptoTurneable = {
        id: null,
        conceptId: null,
        term: null,
        fsn: null,
        semanticTag: null,
        noNominalizada: null,
        auditable: null,
        ambito: null,
    };
    nominalizada = false;
    auditable = false;
    loading = false;

    constructor(
        public plex: Plex,
        private snomedService: SnomedService,
    ) {
    }

    ngOnInit() {

    }

    buscar() {
        // Cancela la búsqueda anterior
        if (this.timeoutHandle) {
            window.clearTimeout(this.timeoutHandle);
            this.loading = false;
        }

        this.conceptoSnomedSeleccionado = null;
        const term = this.term && this.term.trim();

        if (term) {
            this.loading = true;
            this.timeoutHandle = window.setTimeout(() => {
                this.timeoutHandle = null;
                const query = {
                    search: this.term,
                    semanticTag: ['procedimiento']
                };
                this.snomedService.get(query).subscribe((resultado: ISnomedConcept[]) => {
                    this.loading = false;
                    this.conceptosSnomed = resultado;
                });
            }, 200);
        } else {
            this.conceptosSnomed = [];
        }
    }

    onRowClick(concepto: IConceptoTurneable) {
        if (!this.conceptoSnomedSeleccionado || this.conceptoSnomedSeleccionado.id !== concepto.id) {
            this.conceptoSnomedSeleccionado = concepto;
            this.nuevoConceptoTurneable.conceptId = this.conceptoSnomedSeleccionado.conceptId;
            this.nuevoConceptoTurneable.term = this.conceptoSnomedSeleccionado.term;
            this.nuevoConceptoTurneable.fsn = this.conceptoSnomedSeleccionado.fsn;
            this.nuevoConceptoTurneable.semanticTag = this.conceptoSnomedSeleccionado.semanticTag;
        } else {
            this.conceptoSnomedSeleccionado = null;
        }
    }

    agregar() {
        this.nuevoConceptoTurneable.noNominalizada = !this.nominalizada;
        this.nuevoConceptoTurneable.auditable = this.auditable;
        this.agregarConceptoTurneable.emit(this.nuevoConceptoTurneable);
    }

    cancelarAgregar() {
        this.cancelarAgregarConceptoTurneable.emit();
    }


}
