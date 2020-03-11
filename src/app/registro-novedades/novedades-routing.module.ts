
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { NovedadesComponent } from './components/novedades.component';

const routes = [
    { path: 'novedades', component: NovedadesComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class NovedadesRoutingModule { }
