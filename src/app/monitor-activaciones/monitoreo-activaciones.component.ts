
import { ISendMessageCache } from './interfaces/ISendMessageCache';
import { IPacienteApp } from './interfaces/IPacienteApp';
import { PacienteAppService } from './services/pacienteApp.service';
import { SendMessageCacheService } from './services/sendMessageCache.service';
import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { IDevice } from './interfaces/IDevice';
import { Auth } from '@andes/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-monitoreo-activaciones',
    templateUrl: './monitoreo-activaciones.component.html',
})
export class MonitoreoActivacionesComponent implements OnInit {
    loader = false;
    documento: number;
    resultadoBusqueda;
    resultadoMensajes;
    pacienteApp: IPacienteApp;
    pacienteEditado: IPacienteApp;
    pacienteDevice: IDevice;
    pacienteSeleccionado = false;
    edicionActivada = false;
    searchClear = true;    // True si el campo de búsqueda se encuentra vacío


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
        if (this.documento != null) {
            this.searchClear = false;
            this.pacienteAppService.get({ documento: this.documento }).subscribe(
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

    verificarCorreoValido() {
        const formato = /^[a-zA-Z0-9_.+-]+\@[a-zA-Z0-9-]+(\.[a-z]{2,4})+$/;
        const mail = String(this.pacienteEditado.email);
        return formato.test(mail);
    }

    cancelarEdicion() {
        this.edicionActivada = false;
    }

    guardarEdicion() {
        if (this.verificarCorreoValido()) {
            this.pacienteAppService.get({ email: this.pacienteEditado.email }).subscribe(
                resultadoCuentas => {
                    const cuentas = resultadoCuentas.filter(p => p.documento !== this.pacienteApp.documento);
                    if (cuentas.length > 0) {
                        this.plex.info('danger', 'El correo que ingresó ya se encuentra asociado a otra cuenta.');
                    } else {
                        const mensajeTelefono = `<b>Teléfono: </b>${this.pacienteEditado.telefono}`;
                        const mensajeEmail = `<br><b>Email: </b>${this.pacienteEditado.email}`;
                        this.plex.confirm(`${mensajeTelefono} ${mensajeEmail}`, '¿Desea continuar?').then(confirmacion => {
                            if (confirmacion) {
                                this.pacienteAppService.patch(this.pacienteEditado).subscribe(
                                    resultadoPaciente => {
                                        this.pacienteApp = resultadoPaciente;
                                        this.plex.toast('success', 'Los datos han sido actualizados con éxito.');
                                    },
                                    err => {
                                        if (err) {
                                            this.plex.toast('danger', 'No fue posible la actualización de los datos.');
                                        }
                                    });
                                this.edicionActivada = false;
                            }
                        });
                    }
                }
            );
        } else {
            this.plex.info('danger', 'El formato del correo no es válido');
        }
    }
}
