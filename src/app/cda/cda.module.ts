import { VacunasService } from './services/vacunas.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { CDARoutingModule } from './cda-routing.module';

// pipes
import { SharedModule } from '@andes/shared';
// services
import { CdaService } from './services/cda.service';

// componnets
import { CDAListadoComponent } from './components/cda/cda-listado.component';
import { RegenerarRegistrosComponent } from './components/regenerar-registros.component';
import { PacienteModule } from '../shared/paciente/paciente.module';


@NgModule({
    declarations: [
        RegenerarRegistrosComponent,
        CDAListadoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        SharedModule,
        CDARoutingModule,
        PacienteModule
    ],
    providers: [CdaService, VacunasService]
})
export class CdaModule { }
