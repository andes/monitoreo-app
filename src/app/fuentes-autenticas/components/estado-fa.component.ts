import { Component, OnInit } from '@angular/core';
import { FuentesAutenticasService } from '../services/fuentes-autenticas.service';

@Component({
    selector: 'app-estado-fa',
    templateUrl: './estado-fa.html'
})

export class EstadoFuentesAutenticasComponent implements OnInit {
    renaperStatus = false;
    sisaStatus = false;
    loadingRenaper = false;
    loadingSisa = false;

    constructor(private faService: FuentesAutenticasService) { }

    ngOnInit() {
        this.checkStatus('sisa');
        this.checkStatus('renaper');
    }

    checkStatus(opt: string) {
        switch (opt) {
            case 'renaper': {
                this.loadingRenaper = true;
                this.faService.renaperStatus().subscribe(resp => {
                    this.renaperStatus = resp === 200;
                    this.loadingRenaper = false;
                });
                break;
            }
            case 'sisa': {
                this.loadingSisa = true;
                this.faService.sisaStatus().subscribe(resp => {
                    this.sisaStatus = resp === 200;
                    this.loadingSisa = false;
                });
                break;
            }
        }
    }
}
