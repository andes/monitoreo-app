import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PacienteBuscarService } from '../../../services/paciente-buscar.service';

@Component({
    selector: 'app-paciente-buscar',
    templateUrl: './paciente-buscar.html',
    styleUrls: []
})
export class PacienteBuscarComponent implements OnInit {
    private timeoutHandle: number;
    public textoBuscar: string = null;
    public autoFocus = 0;

    // Eventos
    @Output() searchStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() searchEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() searchClear: EventEmitter<any> = new EventEmitter<any>();

    constructor(private pacienteBuscar: PacienteBuscarService) {
    }

    ngOnInit() {
    }

    buscar() {
    // Cancela la búsqueda anterior
        if (this.timeoutHandle) {
            window.clearTimeout(this.timeoutHandle);
        }

        const textoBuscar = this.textoBuscar && this.textoBuscar.trim();

        // Inicia búsqueda
        if (textoBuscar) {
            this.timeoutHandle = window.setTimeout(() => {
                this.searchStart.emit();
                this.timeoutHandle = null;

                // Busca por texto libre
                const resultado = this.pacienteBuscar.search(textoBuscar);
                if (resultado) {
                    resultado.subscribe(
                        (data: any) => {
                            this.searchEnd.emit({ pacientes: data?.pacientes || [], err: data?.err });
                        },
                        (err) => this.searchEnd.emit({ pacientes: [], err })
                    );
                } else {
                    this.searchClear.emit();
                }
            }, 200);
        } else {
            this.searchClear.emit();
        }
    }
}
