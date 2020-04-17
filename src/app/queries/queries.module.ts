import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';

// components
import { QueryComponent } from './query-generator/query-generator.component';
import { FechaComponent } from './filtros/fecha/fecha.component';
import { FiltroQueryComponent } from './filtros/filtros.query.component';
import { ValorNumericoComponent } from './filtros/valor-numerico/valor-numerico.component';
import { QueriesGeneratorService } from './services/query-generator-service';
import { QueriesRoutingModule } from 'src/app/queries/queries-routing.module';

@NgModule({
  declarations: [QueryComponent, FiltroQueryComponent, FechaComponent, ValorNumericoComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    QueriesRoutingModule
  ],
  providers: [QueriesGeneratorService],
  entryComponents: [FechaComponent, ValorNumericoComponent]
})
export class QueriesModule { }
