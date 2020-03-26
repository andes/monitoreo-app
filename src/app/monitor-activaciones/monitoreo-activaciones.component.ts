
import { ISendMessageCache } from './interfaces/ISendMessageCache';
import { IPacienteApp } from './interfaces/IPacienteApp';
import { PacienteAppService } from './services/pacienteApp.service';
import { SendMessageCacheService } from './services/sendMessageCache.service';
import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { IDevice } from './interfaces/IDevice';

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
        private plex: Plex
    ) { }

    ngOnInit() {
    }


    onSearchStart() {
        this.loader = true;
    }

    onSearchEnd(pacientes: any[]) {
        this.searchClear = false;
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
            this.pacienteAppService.get({ documento: this.documento }).subscribe(
                datos => {
                    this.onSearchEnd(datos);
                }
            );
        } else {
            this.onSearchEnd([]);
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
        } else {
            this.pacienteSeleccionado = true;
            this.pacienteApp = paciente;
            this.pacienteDevice = this.pacienteApp.devices[0];
            this.loadMensajes(this.pacienteApp.email);
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
    }
}
