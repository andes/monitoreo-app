import { Component, Input } from '@angular/core';

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

    constructor() {
    }
}
