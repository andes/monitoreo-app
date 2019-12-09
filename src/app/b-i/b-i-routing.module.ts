import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { BIComponent } from './b-i/b-i.component';

const routes = [
    { path: 'b-i', component: BIComponent, canActivate: [RoutingGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class BIRoutingModule { }
