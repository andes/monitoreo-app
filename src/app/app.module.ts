import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Plex, PlexModule } from '@andes/plex';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { HttpClient } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthModule, Auth } from '@andes/auth';
import { RoutingGuard } from './login/routing-guard';
import { WebHookComponent } from './webhook/components/webhook.component';
import { WebHookService } from './webhook/services/webhook.service';


@NgModule({
 declarations: [
   AppComponent,
   HomeComponent,
   WebHookComponent
 ],
 imports: [
   BrowserModule,
   FormsModule,
   HttpClientModule,
   PlexModule,
   routing,
   AuthModule,
 ],
 providers: [
   Plex,
   Server,
   Auth,
   HttpClient,
   RoutingGuard,
   WebHookService
 ],
 bootstrap: [AppComponent]
})
export class AppModule { }
