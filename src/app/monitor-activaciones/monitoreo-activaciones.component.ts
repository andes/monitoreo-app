
import { ISendMessageCache } from './interfaces/ISendMessageCache';
import { IPacienteApp } from './interfaces/IPacienteApp';
import { PacienteAppService } from './services/pacienteApp.service';
import { SendMessageCacheService } from './services/sendMessageCache.service';
import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { IDevice } from './interfaces/IDevice';
import { Auth } from '@andes/auth';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { EMPTY, from } from 'rxjs';

@Component({
    selector: 'app-monitoreo-activaciones',
    templateUrl: './monitoreo-activaciones.component.html',
})
export class MonitoreoActivacionesComponent implements OnInit {
    loader = false;
    documentoEmail: string;
    resultadoBusqueda;
    resultadoMensajes;
    pacienteApp: IPacienteApp;
    pacienteEditado: IPacienteApp;
    pacienteDevice: IDevice;
    pacienteSeleccionado = false;
    edicionActivada = false;
    searchClear = true; // True si el campo de búsqueda se encuentra vacío
    public patronEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;


    constructor(
        private pacienteAppService: PacienteAppService,
        private sendMessageCacheService: SendMessageCacheService,
        private plex: Plex,
        private auth: Auth,
        private router: Router
    ) { }

    ngOnInit() {
        if (!this.auth.check('monitoreo:monitoreoActivaciones')) {
            this.router.navigate(['./inicio']);
        }
    }


    onSearchStart() {
        this.loader = true;
    }

    onSearchEnd(pacientes: any[]) {
        this.loader = false;
        this.resultadoBusqueda = pacientes;
    }

    onSearchClear() {
        this.searchClear = true;
        this.resultadoBusqueda = null;
    }

    public loadPacientes() {
        this.onSearchStart();
        if (this.documentoEmail != null) {
            this.searchClear = false;
            this.pacienteAppService.get({ search: '^' + this.documentoEmail }).subscribe(
                datos => {
                    this.onSearchEnd(datos);
                }
            );
        } else {
            this.onSearchEnd([]);
            this.onSearchClear();
        }
    }

    public loadMensajes(email: string) {
        this.sendMessageCacheService.get({ email }).subscribe(
            datos => {
                this.resultadoMensajes = datos;
            }
        );
    }

    seleccionar(paciente) {
        if (this.pacienteSeleccionado && this.pacienteApp === paciente) {
            this.pacienteSeleccionado = false;
            this.pacienteApp = null;
            this.pacienteDevice = null;
            this.edicionActivada = false;
        } else {
            this.pacienteSeleccionado = true;
            this.pacienteApp = paciente;
            this.pacienteDevice = this.pacienteApp.devices[0];
            this.loadMensajes(this.pacienteApp.email);
            this.edicionActivada = false;
        }
    }

    habilitarEdicion() {
        if (this.pacienteSeleccionado) {
            this.pacienteEditado = Object.assign({}, this.pacienteApp);
            this.edicionActivada = true;

        }
    }

    cancelarEdicion() {
        this.edicionActivada = false;
    }

    guardarEdicion() {
        this.pacienteAppService.get({ email: this.pacienteEditado.email })
            .pipe(
                switchMap(resultadoCuentas => {
                    const existeOtro = resultadoCuentas.some(pac => pac.documento !== this.pacienteApp.documento);
                    if (existeOtro) {
                        this.plex.info('danger', 'El correo que ingresó ya se encuentra asociado a otra cuenta.');
                        return EMPTY;
                    }
                    this.pacienteEditado.telefono = this.pacienteEditado.telefono || '';
                    const mensajeTelefono = `<b>Teléfono: </b>${this.pacienteEditado.telefono}`;
                    const mensajeEmail = `<br><b>Email: </b>${this.pacienteEditado.email}`;
                    return from(
                        this.plex.confirm(`${mensajeTelefono} ${mensajeEmail}`, '¿Desea continuar?')
                    );
                }),

                switchMap(confirmacion => {
                    if (!confirmacion) {
                        return EMPTY;
                    }
                    return this.pacienteAppService.patch(this.pacienteEditado);
                }),

                tap(resultadoPaciente => {
                    this.pacienteApp = resultadoPaciente;
                    this.edicionActivada = false;
                    this.plex.toast('success', 'Los datos han sido actualizados con éxito.');
                })
            ).subscribe({
                error: () => {
                    this.plex.toast('danger', 'No fue posible la actualización de los datos.');
                }
            });
    }
}
