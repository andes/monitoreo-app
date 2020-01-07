import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { BIComponent } from './bi-queries/b-i.component';

const routes = [
    { path: 'bi-queries', component: BIComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class BIRoutingModule { }
