import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';

@Component({
    selector: 'app-cda-listado',
    templateUrl: './cda-listado.html'
})
export class CDAListadoComponent {
    private cdaInt: any;
    public listado: any[]; // Contiene un listado de cdas

    @Input()
    get listaCda() {
        return this.cdaInt;
    }
    set listaCda(value) {
        if (value) {
            this.listado = value;
        }
    }
    /**
     * Indica como se muestra la tabla de resultados
     */
    @Input() type: 'default' | 'sm' = 'default';

    @Output() delete: EventEmitter<any> = new EventEmitter<any>();

    constructor(private plex: Plex) {
    }
}
