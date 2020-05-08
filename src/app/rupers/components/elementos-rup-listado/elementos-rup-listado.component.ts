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
        { label: 'ATOMO', handler: () => { this.goto('/rupers/elementos-rup/atomo/nuevo'); } },
        { label: 'MOLECULA', handler: () => { this.goto('/rupers/elementos-rup/molecula/nuevo'); } },
        { label: 'SECCION', handler: () => { this.goto('/rupers/elementos-rup/seccion/nuevo'); } },
        { label: 'PRESTACION', handler: () => { this.goto('/rupers/elementos-rup/prestacion/nuevo'); } }

    ];

    ngOnInit() {
        this.elementosRup = this.actr.snapshot.data.elementos.filter(e => {
            return !!e.updatedAt || !!e.createdAt;
        });
    }

    goto(url) {
        this.router.navigate([url]);
    }
}
