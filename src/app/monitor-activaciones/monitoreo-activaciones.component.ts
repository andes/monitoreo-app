
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
    pacienteDevice: IDevice;
    pacienteSeleccionado = false;
    searchClear = true;    // True si el campo de búsqueda se encuentra vacío


    constructor(private pacienteAppService: PacienteAppService, private sendMessageCacheService: SendMessageCacheService,
        private plex: Plex) {
    }

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

    public loadMensajes(email: String) {
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
}
