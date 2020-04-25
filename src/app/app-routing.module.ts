import { BuscadorSnomedComponent } from './buscador-snomed/buscador-snomed.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RoutingGuard, RoutingNavBar } from './login/routing-guard';
import { WebHookComponent } from './webhook/components/webhook.component';
import { ConceptosTurneablesComponent } from './conceptos-turneables/components/conceptos-turneables.component';
import { MonitoreoActivacionesComponent } from './monitor-activaciones/monitoreo-activaciones.component';
import { WebhookLogComponent } from './webhook-log/webhook-log.component';
import { RUPElementosRupListadoComponent } from './rupers/elementos-rup-listado/elementos-rup-listado.component';
import { ElementosRupResolver } from './rupers/elementos-rup-resolver';
import { RUPSeccionCreateUpdateComponent } from './rupers/seccion-create-update/seccion-create-update.component';
import { RUPPrestacionCreateUpdateComponent } from './rupers/prestacion-create-update/prestacion-create-update.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [RoutingNavBar, RoutingGuard] },
    { path: 'webhook', component: WebHookComponent, canActivate: [RoutingGuard] },
    { path: 'conceptos-turneables', component: ConceptosTurneablesComponent, canActivate: [RoutingGuard] },
    { path: 'monitor-activaciones', component: MonitoreoActivacionesComponent, canActivate: [RoutingGuard] },
    { path: 'buscador-snomed', component: BuscadorSnomedComponent, canActivate: [RoutingGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'queries', loadChildren: './queries/queries.module#QueriesModule' },
    // { path: 'login', loadChildren: () => import('./login/login.module').then(l=>l.LoginModule)},
    { path: 'webhooklog', component: WebhookLogComponent, canActivate: [RoutingGuard] },
    { path: 'cda-regenerar', loadChildren: './cda/cda.module#CdaModule' },
    { path: 'novedades', loadChildren: './registro-novedades/novedades.module#NovedadesModule' },
    {
        path: 'elementos-rup',
        component: RUPElementosRupListadoComponent,
        canActivate: [RoutingGuard],
        resolve: {
            elementos: ElementosRupResolver
        }
    },
    {
        path: 'elementos-rup/seccion/nuevo',
        component: RUPSeccionCreateUpdateComponent,
        canActivate: [RoutingGuard],
        resolve: {
            elementos: ElementosRupResolver
        },
        pathMatch: 'full'
    },
    {
        path: 'elementos-rup/seccion/:id',
        component: RUPSeccionCreateUpdateComponent,
        canActivate: [RoutingGuard],
        resolve: {
            elementos: ElementosRupResolver
        }
    },
    {
        path: 'elementos-rup/prestacion/nuevo',
        component: RUPPrestacionCreateUpdateComponent,
        canActivate: [RoutingGuard],
        resolve: {
            elementos: ElementosRupResolver
        },
        pathMatch: 'full'
    },
    {
        path: 'elementos-rup/prestacion/:id',
        component: RUPPrestacionCreateUpdateComponent,
        canActivate: [RoutingGuard],
        resolve: {
            elementos: ElementosRupResolver
        }
    },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
