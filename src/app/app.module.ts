import { LoginModule } from './login/login.module';
import { ModulosService } from './registro-novedades/services/modulos.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Plex, PlexModule } from '@andes/plex';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthModule, Auth } from '@andes/auth';
import { RoutingGuard, RoutingNavBar } from './login/routing-guard';
import { WebHookComponent } from './webhook/components/webhook.component';
import { WebHookService } from './webhook/services/webhook.service';
import { ConceptosTurneablesComponent } from './conceptos-turneables/components/conceptos-turneables.component';
import { ConceptoTruneableService } from './conceptos-turneables/services/concepto-turneable.service';
import { DetalleConceptoTurneableComponent } from './conceptos-turneables/components/detalle-concepto-turneable.component';
import { NuevoConceptoTurneableComponent } from './conceptos-turneables/components/nuevo-concepto-turneable.component';
import { SnomedService } from './shared/snomed.service';
import { BuscadorSnomedComponent } from './buscador-snomed/buscador-snomed.component';
import { MonitoreoActivacionesComponent } from './monitor-activaciones/monitoreo-activaciones.component';
import { PacienteAppService } from './monitor-activaciones/services/pacienteApp.service';
import { OrganizacionService } from './services/organizacion.service';
import { SendMessageCacheService } from './monitor-activaciones/services/sendMessageCache.service';
import { WebhookLogComponent } from './webhook-log/webhook-log.component';
import { WebhookLogService } from './webhook-log/services/webhook-log.service';
import { QueriesModule } from './queries/queries.module';
import { CdaModule } from './cda/cda.module';

import { NovedadesModule } from './registro-novedades/novedades.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WebHookComponent,
        WebhookLogComponent,
        ConceptosTurneablesComponent,
        DetalleConceptoTurneableComponent,
        NuevoConceptoTurneableComponent,
        MonitoreoActivacionesComponent,
        BuscadorSnomedComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        routing,
        AuthModule,
        InfiniteScrollModule,
        QueriesModule,
        CdaModule,
        NovedadesModule,
        LoginModule
    ],
    providers: [
        Plex,
        Server,
        Auth,
        HttpClient,
        RoutingGuard,
        RoutingNavBar,
        WebHookService,
        ConceptoTruneableService,
        SnomedService,
        PacienteAppService,
        OrganizacionService,
        SendMessageCacheService,
        WebhookLogService,
        ModulosService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
