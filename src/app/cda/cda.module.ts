import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { CDARoutingModule } from './cda-routing.module';

// pipes
import { EdadPipe } from '../../pipes/edad.pipe';
import { FromNowPipe } from '../../pipes/fromNow.pipe';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { HoraPipe } from '../../pipes/hora.pipe';
import { PacientePipe } from '../../pipes/paciente.pipe';
import { SexoPipe } from '../../pipes/sexo.pipe';

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
    PacientePipe,
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
