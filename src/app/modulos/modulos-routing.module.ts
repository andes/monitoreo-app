
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { ModulosComponent } from './components/modulos.component';

const routes = [
    { path: 'modulos', component: ModulosComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class ModulosRoutingModule { }
