import { VacunasService } from './../services/vacunas.service';
import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { Router } from '@angular/router';
import { CdaService } from '../services/cda.service';
import { Auth } from '@andes/auth';
import { forkJoin, of } from 'rxjs';
import { switchMap, mergeMap, map, find } from 'rxjs/operators';


const sizeSide = 12;
@Component({
    selector: 'app-regenerar-registros',
    templateUrl: './regenerar-registros.html',
    styleUrls: []
})


export class RegenerarRegistrosComponent implements OnInit {
    listaPacientes: any = [];
    loading = false;
    searchClear = true;    // True si el campo de búsqueda se encuentra vacío
    side = sizeSide;
    pacienteSelected = null;
    listaCDA = [];
    public disabledBtnCDA = false;
    public disabledBtnVacunas = false;

    constructor(
        private plex: Plex,
        private router: Router,
        private cdaService: CdaService,
        private auth: Auth,
        private vacunasService: VacunasService) {
    }

    ngOnInit() {
        if (!this.auth.check('monitoreo:regenerarCda')) {
            this.router.navigate(['./inicio']);
        }
    }

    onSearchStart() {
        this.loading = true;
    }

    onSearchEnd(pacientes: any[]) {
        this.searchClear = false;
        this.loading = false;
        this.listaPacientes = pacientes;
        this.side = sizeSide;
    }

    onSearchClear() {
        this.searchClear = true;
        this.listaPacientes = [];
        this.side = sizeSide;
    }

    seleccionar(paciente) {
        this.disabledBtnCDA = false;
        if (paciente) {
            this.pacienteSelected = paciente;
            this.side = 7;
            this.refreshCDA();
        } else {
            this.side = sizeSide;
        }
    }

    regenerarCDA() {
        // deshabilitamos boton regenerar por unos segundos
        this.disabledBtnCDA = true;
        this.cdaService.regenerarCda({ paciente: this.pacienteSelected }).subscribe();
        window.setTimeout(() => {
            this.disabledBtnCDA = false;
        }, 900);
    }

    registrarVacunas() {
        // deshabilitamos boton registrar vacunas por unos segundos
        this.disabledBtnVacunas = true;
        this.vacunasService.registrarVacunas({ paciente: this.pacienteSelected }).subscribe((resultado: any) => {
            if (resultado.success) {
                this.plex.toast('success', 'Las vacunas han sido registradas con éxito.');
            }
            this.disabledBtnVacunas = false;
        });
    }

    refreshCDA() {
        forkJoin(
            this.cdaService.getCDAList(this.pacienteSelected.id),
            this.vacunasService.get(this.pacienteSelected.id)
        ).subscribe(([cda, vacunas]) => {
            let listado = [];
            cda.map(cda => {
                let vacunaCorrespondiente = vacunas.find(vac => vac.idvacuna.toString() === cda.extras.id);
                if (vacunaCorrespondiente) {
                    listado.push({ cda, vacuna: vacunaCorrespondiente });
                }
            });
            this.listaCDA = listado;
        });
    }

    // Borra la vacuna seleccionada y su cda
    deleteRegistro(event) {
        if (event) {
            this.plex.confirm(event.vacuna.vacuna + ' ' + event.vacuna.dosis, '¿Desea eliminar?').then(confirmacion => {
                if (confirmacion) {
                    forkJoin([
                        this.vacunasService.deleteVacuna(event.cda.extras.id),
                        this.cdaService.deleteCda(event.cda.cda_id)
                    ]).subscribe(([vacuna, cda]) => {
                        if (vacuna.success && cda.success) {
                            this.refreshCDA();
                            this.plex.toast('success', 'Registro eliminado con éxito');
                        }
                    }, error => {
                        this.plex.info('danger', 'Ha habido un error realizando la operación');
                    });
                }
            });
        }
    }
}
