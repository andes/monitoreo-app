import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { Plex } from '@andes/plex';
import { IConceptoTurneable } from '../Interfaces/IConceptoTurneable';

@Component({
    selector: 'app-concepto-turneable-detalle',
    templateUrl: './detalle-concepto-turneable.component.html',
})
export class DetalleConceptoTurneableComponent implements OnInit, OnChanges {
    @Input() conceptoTurneable: IConceptoTurneable;
    @Output() editarConceptoTurneable = new EventEmitter<any>();

    auditable;
    nominalizada;
    agendaDinamica;
    editable = false;
    paraFalse = 'NO';
    paraTrue = 'SI';
    public ambitoActual;
    public ambito;
    public ambitos: any[];

    constructor(
        public plex: Plex,
    ) {
    }

    ngOnInit() {
        this.asignarAtributos();
    }

    ngOnChanges() {
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
                        agendaDinamica: this.agendaDinamica,
                        ambito: this.objectSelect2array(this.ambitoActual),
                    };
                    this.toggleEdicion();
                    this.editarConceptoTurneable.emit(cambios);
                }
            });
        } else {
            this.plex.info('danger', 'No es posible editar este Concepto Turneable');
        }
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

        if (this.conceptoTurneable.agendaDinamica) {
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
            }
        ];
        // guarda el estado previo del ambito
        this.ambitoActual = this.array2objectSelect(this.conceptoTurneable.ambito);
    }

    cancelar() {
        this.asignarAtributos();
        this.toggleEdicion();
    }

    toggleEdicion() {
        this.editable = !this.editable;
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

    // convierte el objeto seleccion en un array
    objectSelect2array(myObjectSelect) {
        let result = [];
        try {
            if (!Array.isArray(myObjectSelect)) { return result; }
        } catch { return result; }
        result = myObjectSelect.map(e => e.id);
        return result;
    }

    // compara dos arrays y retorna true si sus elementos son iguales
    arrayEquals(arr1, arr2) {
        let equal = false;
        try {
            if (!Array.isArray(arr1) || !Array.isArray(arr1)) { return equal; }
        } catch { return equal; }
        if (arr1.length === arr2.length) {
            arr1 = arr1.sort();
            arr2 = arr2.sort();
            equal = arr1.every((value, index) => value === arr2[index]);
        }
        return equal;
    }


    hayCambios() {
        return (
            (this.conceptoTurneable.noNominalizada !== !this.nominalizada) ||
            (this.conceptoTurneable.auditable !== this.auditable) ||
            (this.conceptoTurneable.agendaDinamica !== this.agendaDinamica) ||
            (!this.arrayEquals(this.conceptoTurneable.ambito, this.objectSelect2array(this.ambitoActual)))
        );
    }
}
