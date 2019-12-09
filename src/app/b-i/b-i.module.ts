import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Plex, PlexModule } from '@andes/plex';

// components
import { BIComponent } from './b-i/b-i.component';
import { BIRoutingModule } from './b-i-routing.module';
import { FechaComponent } from './filtros/fecha/fecha.component';
import { FiltroBiComponent } from './filtros/filtros.bi.component';
import { ValorNumericoComponent } from './filtros/valor-numerico/valor-numerico.component';
import { BIService } from './services/b-i-service';

@NgModule({
  declarations: [BIComponent, FiltroBiComponent, FechaComponent, ValorNumericoComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    BIRoutingModule
  ],
  providers: [BIService],
  entryComponents: [FechaComponent, ValorNumericoComponent]
})
export class BIModule { }
