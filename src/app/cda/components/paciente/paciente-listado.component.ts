import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { PacienteBuscarService } from 'src/app/services/paciente-buscar.service';

@Component({
    selector: 'app-paciente-listado',
    templateUrl: 'paciente-listado.html',
    styleUrls: ['paciente-listado.scss']
})
export class PacienteListadoComponent {
    private pacientesInt: any;
    private cargando = false;
    private autoLoads = 0;
    public seleccionado;
    public coloresItems = {
        impar: {
            border: '#00000000',
            hover: '#00a8e099',
            background: '#00a8e01a'
        },
        par: {
            border: '#00000000',
            hover: '#00a8e099',
            background: '#0027381a'
        }
    };
    // Propiedades públicas
    public listado: any[]; // Contiene un listado plano de pacientes
    @Input()
    get pacientes() {
        return this.pacientesInt;
    }
    set pacientes(value) {
        if (value) {
            this.listado = value;
            this.autoLoads = 0;
            this.autoLoad();
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


    constructor(
        private pacienteBuscar: PacienteBuscarService,
        private elementRef: ElementRef
    ) {
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

    /**
     *
     * @param pos posición en el listado
     * @returns color del item
     */
    public colorItem(pos) {
        return (pos % 2 === 0) ? this.coloresItems.par : this.coloresItems.impar;
    }

    onScroll() {
        if (this.cargando) {
            return;
        }
        this.cargando = true;
        this.pacienteBuscar.findByText().subscribe(
            (resultado: any) => {
                if (resultado) {
                    this.listado = this.listado.concat(resultado.pacientes);
                    this.autoLoad();
                }
                this.cargando = false;
            },
            () => this.cargando = false,
            () => this.cargando = false
        );
    }

    private autoLoad() {
        this.autoLoads++;
        if (this.autoLoads > 10) {
            return;
        }
        setTimeout(() => {
            const container = this.elementRef.nativeElement.parentElement;
            if (container && container.scrollHeight <= container.clientHeight) {
                this.onScroll();
            }
        });
    }
}
