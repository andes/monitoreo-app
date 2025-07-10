import { Plex } from '@andes/plex';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';
import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { SnomedService } from 'src/app/shared/snomed.service';
import { IConceptoTurneable } from '../Interfaces/IConceptoTurneable';
import { ConceptoTruneableService } from '../services/concepto-turneable.service';

@Component({
    selector: 'app-concepto-turneable-nuevo',
    templateUrl: './nuevo-concepto-turneable.component.html',
})
export class NuevoConceptoTurneableComponent implements OnInit {
    @ViewChild('modal', { static: true }) modal: PlexModalComponent;
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
        agendaDinamica: null,
        ambito: null,
    };
    agendaDinamica;
    public ambitoActual;
    public ambito;
    public ambitos: any[];

    nominalizada = false;
    auditable = false;
    loading = false;

    constructor(
        public plex: Plex,
        private snomedService: SnomedService,
        private conceptoTurneableService: ConceptoTruneableService,
    ) {
    }
    ngOnInit() {
        this.asignarAtributos();
    }

    mostrarMensaje() {
        this.plex.info('warning', 'Ya existe un concepto turneable para el conceptId seleccionado. Para mayor información comunicarse con <b>soporteandes@neuquen.gov.ar</b>.', 'Información');
    }

    asignarAtributos() {
        if (this.nuevoConceptoTurneable.noNominalizada) {
            this.nominalizada = false;
        } else {
            this.nominalizada = true;
        }

        if (this.nuevoConceptoTurneable.auditable) {
            this.auditable = true;
        } else {
            this.auditable = false;
        }

        if (this.nuevoConceptoTurneable.agendaDinamica) {
            this.agendaDinamica = true;
        } else {
            this.agendaDinamica = false;
        }
        // carga los posibles ambitos
        this.ambitos = [
            {
                id: 'ambulatorio',
                nombre: 'AMBULATORIO'
            },
            {
                id: 'internacion',
                nombre: 'INTERNACIÓN'
            },
            {
                id: 'quirofano',
                nombre: 'QUIRÓFANO'
            },
            {
                id: 'guardia',
                nombre: 'GUARDIA'
            },
            {
                id: 'pre-hospitalario',
                nombre: 'PRE-HOSPITALARIO'
            },
            {
                id: 'hospital-de-dia',
                nombre: 'HOSPITAL DE DÍA'
            },
            {
                id: 'domiciliario',
                nombre: 'DOMICILIARIO'
            }
        ];
        this.ambitoActual = (this.nuevoConceptoTurneable.ambito || []).map(id => this.ambitos.find(a => a.id === id)).filter(a => !!a);

    }

    // convierte un array a un objeto seleccion
    array2objectSelect(my_array) {
        let result = [];
        try {
            if (!Array.isArray(my_array)) {
                return result;
            }
        } catch { return result; }
        result = my_array.map(e => ({ id: e, nombre: e.toUpperCase() }));
        return result;
    }
    buscarConcepto(concepto: IConceptoTurneable) {
        const existe = new Subject<boolean>();

        this.conceptoTurneableService.get({
            conceptId: concepto.conceptId
        }).subscribe(
            resultado => existe.next(resultado.length > 0),
            () => existe.next(true)
        );

        return existe.asObservable();
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

    seleccionarConcepto(concepto: IConceptoTurneable) {
        this.buscarConcepto(concepto).subscribe(existe => {
            if (existe) { this.mostrarMensaje(); } else {
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
        });
    }

    agregar() {
        this.nuevoConceptoTurneable.ambito = (this.ambitoActual || []).map(a => a.id);

        this.nuevoConceptoTurneable.noNominalizada = !this.nominalizada;
        this.nuevoConceptoTurneable.auditable = this.auditable;
        this.agregarConceptoTurneable.emit(this.nuevoConceptoTurneable);
    }

    cancelarAgregar() {
        this.cancelarAgregarConceptoTurneable.emit();
    }
}
