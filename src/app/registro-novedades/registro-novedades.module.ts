import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Plex, PlexModule } from '@andes/plex';

//component File
import { AdjuntosService } from "./services/adjuntos.service";

// componenents
import { RegistroNovedadesRoutingModule } from './registro-novedades-routing.module';
import { RegistroNovedadesComponent } from './components/registro-novedades.component';
import { RegistroNovedadesService } from './services/registro-novedades.service';

@NgModule({
  declarations: [
    RegistroNovedadesComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    RegistroNovedadesRoutingModule
  ],
  providers: [RegistroNovedadesService, AdjuntosService]
})
export class RegistroNovedadesModule { }