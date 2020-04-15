import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { CDARoutingModule } from './cda-routing.module';

// pipes
import { EdadPipe } from '@andes/shared/src/lib/pipes/edad.pipe';
import { FromNowPipe } from '@andes/shared/src/lib/pipes/fromNow.pipe';
import { FechaPipe } from '@andes/shared/src/lib/pipes/fecha.pipe';
import { HoraPipe } from '@andes/shared/src/lib/pipes/hora.pipe';
import { NombrePipe } from '@andes/shared/src/lib/pipes/nombre.pipe';
import { SexoPipe } from '@andes/shared/src/lib/pipes/sexo.pipe';

// services
import { PacienteService } from './services/paciente.service';
import { CdaService } from './services/cda.service';

// componnets
import { CdaRegenerarComponent } from './components/cda-regenerar.component';
import { PacienteBuscarComponent } from './components/paciente/paciente-buscar.component';
import { PacienteListadoComponent } from './components/paciente/paciente-listado.component';
import { CDAListadoComponent } from './components/cda/cda-listado.component';


@NgModule({
  declarations: [
    CdaRegenerarComponent,
    PacienteBuscarComponent,
    PacienteListadoComponent,
    CDAListadoComponent,
    EdadPipe,
    FromNowPipe,
    FechaPipe,
    HoraPipe,
    NombrePipe,
    SexoPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    CDARoutingModule
  ],
  providers: [PacienteService, CdaService]
})
export class CdaModule { }
