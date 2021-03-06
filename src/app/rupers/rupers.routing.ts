import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RUPElementosRupListadoComponent } from './components/elementos-rup-listado/elementos-rup-listado.component';
import { RoutingGuard } from '../login/routing-guard';
import { RUPSeccionCreateUpdateComponent } from './components/seccion-create-update/seccion-create-update.component';
import { RUPPrestacionCreateUpdateComponent } from './components/prestacion-create-update/prestacion-create-update.component';
import { RUPAtomoCreateUpdateComponent } from './components/atomo-create-update/atomo-create-update.component';
import { RUPMoleculaCreateUpdateComponent } from './components/molecula-create-update/molecula-create-update.component';

const routes = [
    {
        path: 'elementos-rup',
        component: RUPElementosRupListadoComponent,
        canActivate: [RoutingGuard]
    },
    {
        path: 'elementos-rup/seccion/nuevo',
        component: RUPSeccionCreateUpdateComponent,
        canActivate: [RoutingGuard],
        pathMatch: 'full'
    },
    {
        path: 'elementos-rup/seccion/:id',
        component: RUPSeccionCreateUpdateComponent,
        canActivate: [RoutingGuard]
    },
    {
        path: 'elementos-rup/prestacion/nuevo',
        component: RUPPrestacionCreateUpdateComponent,
        canActivate: [RoutingGuard],
        pathMatch: 'full'
    },
    {
        path: 'elementos-rup/prestacion/:id',
        component: RUPPrestacionCreateUpdateComponent,
        canActivate: [RoutingGuard]
    },
    {
        path: 'elementos-rup/atomo/nuevo',
        component: RUPAtomoCreateUpdateComponent,
        canActivate: [RoutingGuard],
        pathMatch: 'full'
    },
    {
        path: 'elementos-rup/atomo/:id',
        component: RUPAtomoCreateUpdateComponent,
        canActivate: [RoutingGuard]
    },
    {
        path: 'elementos-rup/molecula/nuevo',
        component: RUPMoleculaCreateUpdateComponent,
        canActivate: [RoutingGuard],
        pathMatch: 'full'
    },
    {
        path: 'elementos-rup/molecula/:id',
        component: RUPMoleculaCreateUpdateComponent,
        canActivate: [RoutingGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class RupersRoutingModule { }
