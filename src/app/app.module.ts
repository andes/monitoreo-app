import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Plex, PlexModule } from '@andes/plex';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { HttpModule } from '@angular/http';


// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthModule, Auth } from '@andes/auth';

@NgModule({
 declarations: [
   AppComponent,
   HomeComponent,
   LoginComponent
 ],
 imports: [
   BrowserModule,
   HttpModule,
   FormsModule,
   HttpClientModule,
   PlexModule,
   routing,
   AuthModule
 ],
 providers: [
   Plex,
   Server,
   Auth
 ],
 bootstrap: [AppComponent]
})
export class AppModule { }