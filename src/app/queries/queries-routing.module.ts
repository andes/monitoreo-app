import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { QueryComponent } from './query-generator/query-generator.component';

const routes = [
    { path: 'bi-queries', component: QueryComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class QueriesRoutingModule { }
