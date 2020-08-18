import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { AppComponent } from '../../../app.component';
import { OrganizacionService } from '../../../services/organizacion.service';

@Component({
    templateUrl: 'select-organizacion.html'
})
export class SelectOrganizacionComponent implements OnInit {
    public organizaciones = null;
    public organizacionElegida;
    constructor(
        private plex: Plex,
        private auth: Auth,
        private router: Router,
        public appComponent: AppComponent,
        public organizacionService: OrganizacionService
    ) { }

    ngOnInit() {
        this.plex.updateTitle('Seleccione una organización');
        this.auth.organizaciones().subscribe(data => {
            if (data) {
                this.organizaciones = data;
                if (this.organizaciones.length === 1) {
                    // si la organzación es una solo, entonces ingresa sólo a esa
                    this.seleccionar(this.organizaciones[0]);
                }
            } else {
                this.plex.info('danger', 'El usuario no tiene ningún permiso asignado');
            }
        });
    }

    seleccionar(organizacion) {
        this.auth.setOrganizacion(organizacion).subscribe(() => {
            this.router.navigate(['home']);
        }, (err) => {
            this.plex.info('danger', 'Error al seleccionar organización');
        });
    }

}
