
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { RegenerarRegistrosComponent } from './components/regenerar-registros.component';

const routes = [
    { path: '', component: RegenerarRegistrosComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class CDARoutingModule { }
