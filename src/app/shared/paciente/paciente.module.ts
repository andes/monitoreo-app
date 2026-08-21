import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { SharedModule } from '@andes/shared';
import { PacienteBuscarComponent } from '../../cda/components/paciente/paciente-buscar.component';
import { PacienteListadoComponent } from '../../cda/components/paciente/paciente-listado.component';
import { PacienteBuscarService } from '../../services/paciente-buscar.service';

@NgModule({
    declarations: [
        PacienteBuscarComponent,
        PacienteListadoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        SharedModule
    ],
    exports: [
        PacienteBuscarComponent,
        PacienteListadoComponent
    ],
    providers: [PacienteBuscarService]
})
export class PacienteModule { }
