import { WebhookLogComponent } from './webhook-log.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes = [
    { path: 'webhooklog', component: WebhookLogComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class WebhookLogRoutingModule { }
