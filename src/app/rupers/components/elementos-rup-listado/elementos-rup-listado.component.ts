import { Auth } from '@andes/auth';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IElementoRUP } from 'src/app/shared/IElementoRUP';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { ElementosRupListadoService } from './elementos-rup-listado.service';

@Component({
    selector: 'rup-elementos-rup-listado',
    templateUrl: 'elementos-rup-listado.component.html',
    providers: [ElementosRupListadoService]
})
export class RUPElementosRupListadoComponent implements OnInit {
    elementosRup$: Observable<IElementoRUP[]>;
    constructor(
        private router: Router,
        private listadoService: ElementosRupListadoService,
        private elementosRupService: ElementosRupService,
        private auth: Auth
    ) { }

    public items = [
        { label: 'ATOMO', handler: () => { this.goto('/rupers/elementos-rup/atomo/nuevo'); } },
        { label: 'MOLECULA', handler: () => { this.goto('/rupers/elementos-rup/molecula/nuevo'); } },
        { label: 'SECCION', handler: () => { this.goto('/rupers/elementos-rup/seccion/nuevo'); } },
        { label: 'PRESTACION', handler: () => { this.goto('/rupers/elementos-rup/prestacion/nuevo'); } }

    ];

    ngOnInit() {
        if (!this.auth.check('monitoreo:rupers')) {
            return this.router.navigate(['./inicio']);
        }
        this.elementosRup$ = this.listadoService.elementosRup$;
        this.elementosRupService.refresh.next(null);
    }

    goto(url) {
        this.router.navigate([url]);
    }
}
