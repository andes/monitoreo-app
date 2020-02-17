import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';

@Component({
    selector: 'app-paciente-listado',
    templateUrl: 'paciente-listado.html',
    styleUrls: ['paciente-listado.scss']
})
export class PacienteListadoComponent {
    private pacientesInt: any;
    private seleccionado;

    // Propiedades públicas
    public listado: any[]; // Contiene un listado plano de pacientes


    @Input()
    get pacientes() {
        return this.pacientesInt;
    }
    set pacientes(value) {
        if (value) {
            this.listado = value;
        }
    }
    /**
     * Indica si selecciona automáticamente el primer paciente de la lista
     *
     */
    @Input() autoselect = false;
    /**
     * Indica como se muestra la tabla de resultados
     */
    @Input() type: 'default' | 'sm' = 'default';
    /**
     * Evento que se emite cuando se selecciona un paciente
     */
    @Output() selected: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Evento que se emite cuando el mouse está sobre un paciente
     */
    @Output() hover: EventEmitter<any> = new EventEmitter<any>();


    constructor(private plex: Plex) {
    }

    public seleccionar(paciente) {
        if (this.seleccionado !== paciente) {
            this.seleccionado = paciente;
            this.selected.emit(this.seleccionado);
        } else {
            this.seleccionado = null;
            this.selected.emit(null);
        }
    }

    public hoverPaciente(paciente) {
        this.hover.emit(paciente);
    }
}
