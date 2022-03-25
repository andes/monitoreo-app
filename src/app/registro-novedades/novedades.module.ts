import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { AdjuntosService } from './services/adjuntos.service';
import { NovedadesRoutingModule } from './novedades-routing.module';
import { NovedadesComponent } from './components/novedades.component';
import { NovedadesService } from './services/novedades.service';

@NgModule({
    declarations: [
        NovedadesComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        NovedadesRoutingModule
    ],
    providers: [NovedadesService, AdjuntosService]
})
export class NovedadesModule { }
