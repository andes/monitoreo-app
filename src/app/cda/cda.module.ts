import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { CDARoutingModule } from './cda-routing.module';

// pipes
import { SharedModule } from '@andes/shared';
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
    CDAListadoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    SharedModule,
    CDARoutingModule
  ],
  providers: [PacienteService, CdaService]
})
export class CdaModule { }
