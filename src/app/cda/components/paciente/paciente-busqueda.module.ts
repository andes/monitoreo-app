import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlexModule } from '@andes/plex';
import { SharedModule } from '@andes/shared';
import { PacienteService } from '../../services/paciente.service';
import { PacienteBuscarComponent } from './paciente-buscar.component';
import { PacienteListadoComponent } from './paciente-listado.component';

// Búsqueda y listado de pacientes compartidos entre Regenerar Registros y el Visualizador de Recetas
@NgModule({
    declarations: [
        PacienteBuscarComponent,
        PacienteListadoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PlexModule,
        SharedModule
    ],
    exports: [
        PacienteBuscarComponent,
        PacienteListadoComponent
    ],
    providers: [PacienteService]
})
export class PacienteBusquedaModule { }
