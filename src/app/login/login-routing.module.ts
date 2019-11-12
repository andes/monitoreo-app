import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

let routes = [
    { path: '', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class LoginRoutingModule { }