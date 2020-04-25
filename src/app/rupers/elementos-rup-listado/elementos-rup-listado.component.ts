import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rup-elementos-rup-listado',
    templateUrl: 'elementos-rup-listado.component.html',
})
export class RUPElementosRupListadoComponent implements OnInit {
    elementosRup = [];
    constructor(
        private actr: ActivatedRoute,
        private router: Router
    ) { }

    public items = [
        { label: 'SECCION', handler: () => { this.goto('/elementos-rup/seccion/nuevo'); } },
        { label: 'PRESTACION', handler: () => { this.goto('/elementos-rup/prestacion/nuevo'); } }

    ];

    ngOnInit() {
        this.elementosRup = this.actr.snapshot.data.elementos.filter(e => {
            return e.componente === 'SeccionadoComponent' || e.tipo === 'prestacion';
        });
    }

    goto(url) {
        this.router.navigate([url]);
    }
}
