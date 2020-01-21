
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { RegistroNovedadesComponent } from './components/registro-novedades.component';

const routes = [
    { path: 'registro-novedades', component: RegistroNovedadesComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class RegistroNovedadesRoutingModule { }
