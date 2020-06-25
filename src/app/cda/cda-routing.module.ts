
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from '../login/routing-guard';
import { CdaRegenerarComponent } from './components/cda-regenerar.component';

const routes = [
    { path: '', component: CdaRegenerarComponent, canActivate: [RoutingGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class CDARoutingModule { }
