import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// pipes
import { SharedModule } from '@andes/shared';

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
import { BuscadorSnomedComponent } from './buscador-snomed/buscador-snomed.component';
import { MonitoreoActivacionesComponent } from './monitor-activaciones/monitoreo-activaciones.component';
import { PacienteAppService } from './monitor-activaciones/services/pacienteApp.service';
import { OrganizacionService } from './services/organizacion.service';
import { SendMessageCacheService } from './monitor-activaciones/services/sendMessageCache.service';
import { WebhookLogComponent } from './webhook-log/webhook-log.component';
import { WebhookLogService } from './webhook-log/services/webhook-log.service';
import { ModulosService } from './modulos/services/modulos.service';
import { ModulosModule } from './modulos/modulos.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EstadoFuentesAutenticasComponent } from './fuentes-autenticas/components/estado-fa.component';
import { FuentesAutenticasService } from './fuentes-autenticas/services/fuentes-autenticas.service';
import { restriccionHudsComponent } from './restriccion-huds/restriccion-huds';
import { UsuariosHttp } from './services/usuarios.service';
import { PermisosService } from './services/permisos.service';
import { PacienteBuscarComponent } from './restriccion-huds/paciente-buscar.component';
import { PacienteListadoComponent } from './restriccion-huds/paciente-listado.component';
import { PacienteBuscarService } from './services/paciente-buscar.service';
import { PacienteCacheService } from './services/pacienteCache.service';
import { PacienteService } from './services/paciente.service';
import { AdjuntosService } from './services/adjuntos.service';
import { GaleriaArchivosComponent } from './shared/galeria-archivos.component';
import { ProfesionalService } from './services/profesional.service';

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
        BuscadorSnomedComponent,
        EstadoFuentesAutenticasComponent,
        restriccionHudsComponent,
        PacienteBuscarComponent,
        PacienteListadoComponent,
        GaleriaArchivosComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        PlexModule.forRoot({ networkLoading: true }),
        routing,
        AuthModule,
        InfiniteScrollModule,
        ModulosModule,
        NoopAnimationsModule,
        SharedModule
    ],
    providers: [
        Server,
        Auth,
        HttpClient,
        RoutingGuard,
        RoutingNavBar,
        WebHookService,
        ConceptoTruneableService,
        PacienteAppService,
        OrganizacionService,
        SendMessageCacheService,
        WebhookLogService,
        ModulosService,
        FuentesAutenticasService,
        UsuariosHttp,
        PermisosService,
        PacienteCacheService,
        PacienteService,
        PacienteBuscarService,
        AdjuntosService,
        ProfesionalService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
