import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { QueryExecuteComponent } from '../queries/componentes/query-execute.component';
import { QueryListComponent } from './componentes/query-list.component';

const routes = [
    { path: '', component: QueryExecuteComponent, canActivate: [RoutingGuard] },
    { path: 'listado', component: QueryListComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class QueriesRoutingModule { }
