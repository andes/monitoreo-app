
import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { ISnomedConcept } from '../shared/ISnomedConcept';
import { SnomedService } from '../shared/snomed.service';
import { Router } from '@angular/router';
import { Auth } from '@andes/auth';

@Component({
    selector: 'app-buscador-snomed',
    templateUrl: './buscador-snomed.component.html'
})
export class BuscadorSnomedComponent implements OnInit {
    searchTerm: string;
    busqueda: string;
    conceptos: ISnomedConcept[];

    constructor(
        private plex: Plex,
        private snomedService: SnomedService,
        private router: Router,
        private auth: Auth
    ) { }

    ngOnInit() {
        if (!this.auth.check('monitoreo:buscadorSnomed')) {
            this.router.navigate(['./inicio']);
        }
    }

    buscarConcepto() {
        if (this.searchTerm.match(/<<\s{1,}/)) {
            this.searchTerm = '';
            return;
        }
        const query = {
            search: this.searchTerm
        };
        this.snomedService.get(query).subscribe((resultado: ISnomedConcept[]) => {
            this.conceptos = resultado;
        });
    }

}
