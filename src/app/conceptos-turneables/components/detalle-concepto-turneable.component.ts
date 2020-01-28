import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';
import { IConceptoTurneable } from '../Interfaces/IConceptoTurneable';

@Component({
    selector: 'app-concepto-turneable-detalle',
    templateUrl: './detalle-concepto-turneable.component.html',
})
export class DetalleConceptoTurneableComponent implements OnInit {
    @Input() conceptoTurneable: IConceptoTurneable;
    @Output() eliminarConceptoTurneable = new EventEmitter<IConceptoTurneable>();
    @Output() editarConceptoTurneable = new EventEmitter<any>();

    auditable;
    nominalizada;
    editable = false;
    paraFalse = 'NO';
    paraTrue = 'SI';

    constructor(
        public plex: Plex,
    ) {
    }

    ngOnInit() {
        this.asignarAtributos();
    }

    editar() {
        if (this.conceptoTurneable && this.conceptoTurneable.id) {
            this.plex.confirm('Guardar cambios de concepto turneable "' +
                this.conceptoTurneable.conceptId + '"', '¿Desea guardar cambios?').then(confirmacion => {
                    if (confirmacion) {
                        const cambios = {
                            noNominalizada: !this.nominalizada,
                            auditable: this.auditable,
                        };
                        this.toggleEdicion();
                        this.editarConceptoTurneable.emit(cambios);
                    }
                });
        } else {
            this.plex.info('danger', 'No es posible editar este Concepto Turneable');
        }
    }

    eliminar() {
        this.eliminarConceptoTurneable.emit(this.conceptoTurneable);
    }

    asignarAtributos() {
        if (this.conceptoTurneable.noNominalizada) {
            this.nominalizada = false;
        } else {
            this.nominalizada = true;
        }

        if (this.conceptoTurneable.auditable) {
            this.auditable = true;
        } else {
            this.auditable = false;
        }
    }

    cancelar() {
        this.asignarAtributos();
        this.toggleEdicion();
    }

    toggleEdicion() {
        this.editable = !this.editable;
    }

    hayCambios() {
        return ((this.conceptoTurneable.noNominalizada !== !this.nominalizada) || (this.conceptoTurneable.auditable !== this.auditable));
    }
}
