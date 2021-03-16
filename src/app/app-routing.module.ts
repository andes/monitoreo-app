import { BuscadorSnomedComponent } from './buscador-snomed/buscador-snomed.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RoutingGuard, RoutingNavBar } from './login/routing-guard';
import { WebHookComponent } from './webhook/components/webhook.component';
import { ConceptosTurneablesComponent } from './conceptos-turneables/components/conceptos-turneables.component';
import { MonitoreoActivacionesComponent } from './monitor-activaciones/monitoreo-activaciones.component';
import { WebhookLogComponent } from './webhook-log/webhook-log.component';
import { EstadoFuentesAutenticasComponent } from './fuentes-autenticas/components/estado-fa.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [RoutingNavBar, RoutingGuard] },
    { path: 'webhook', component: WebHookComponent, canActivate: [RoutingGuard] },
    { path: 'conceptos-turneables', component: ConceptosTurneablesComponent, canActivate: [RoutingGuard] },
    { path: 'monitor-activaciones', component: MonitoreoActivacionesComponent, canActivate: [RoutingGuard] },
    { path: 'buscador-snomed', component: BuscadorSnomedComponent, canActivate: [RoutingGuard] },
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'queries', loadChildren: () => import('./queries/queries.module').then(m => m.QueriesModule) },
    // { path: 'login', loadChildren: () => import('./login/login.module').then(l=>l.LoginModule)},
    { path: 'webhooklog', component: WebhookLogComponent, canActivate: [RoutingGuard] },
    { path: 'regenerar-registros', loadChildren: () => import('./cda/cda.module').then(m => m.CdaModule) },
    { path: 'novedades', loadChildren: () => import('./registro-novedades/novedades.module').then(m => m.NovedadesModule) },
    { path: 'rupers', loadChildren: () => import('./rupers/rupers.module').then(m => m.RupersModule) },
    { path: 'fuentes-autenticas', component: EstadoFuentesAutenticasComponent, canActivate: [RoutingGuard] },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
