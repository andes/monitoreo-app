import { BuscadorSnomedComponent } from './buscador-snomed/buscador-snomed.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RoutingGuard, RoutingNavBar } from './login/routing-guard';
import { WebHookComponent } from './webhook/components/webhook.component';
import { ConceptosTurneablesComponent } from './conceptos-turneables/components/conceptos-turneables.component';
import { MonitoreoActivacionesComponent } from './monitor-activaciones/monitoreo-activaciones.component';
import { WebhookLogComponent } from './webhook-log/webhook-log.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [RoutingNavBar, RoutingGuard] },
    { path: 'webhook', component: WebHookComponent, canActivate: [RoutingGuard] },
    { path: 'conceptos-turneables', component: ConceptosTurneablesComponent, canActivate: [RoutingGuard] },
    { path: 'monitor-activaciones', component: MonitoreoActivacionesComponent, canActivate: [RoutingGuard] },
    { path: 'buscador-snomed', component: BuscadorSnomedComponent, canActivate: [RoutingGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'webhooklog', component: WebhookLogComponent, canActivate: [RoutingGuard] },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
