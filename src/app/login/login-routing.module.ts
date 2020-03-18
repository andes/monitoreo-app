import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard, RoutingNavBar } from './routing-guard';
// Components
import { LoginComponent } from './components/login/login.component';
import { SelectOrganizacionComponent } from './components/select-organizacion/select-organizacion.component';
import { LogoutComponent } from './components/logout/logout.component';

const routes = [
    { path: 'select-organizacion', component: SelectOrganizacionComponent, canActivate: [RoutingNavBar, RoutingGuard] },
    { path: 'logout', component: LogoutComponent, canActivate: [RoutingGuard] },
    { path: '', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class LoginRoutingModule { }
