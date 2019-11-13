import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RoutingGuard } from './login/routing-guard';
import { WebHookComponent } from './webhook/components/webhook.component';
import { ConceptosTurneablesComponent } from './conceptos-turneables/components/conceptos-turneables.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [RoutingGuard] },
    { path: 'webhook', component: WebHookComponent, canActivate: [RoutingGuard] },
    { path: 'conceptos-turneables', component: ConceptosTurneablesComponent, canActivate: [RoutingGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
