import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Plex, PlexModule } from '@andes/plex';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';


// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
 declarations: [
   AppComponent,
   HomeComponent
 ],
 imports: [
   BrowserModule,
   FormsModule,
   HttpClientModule,
   PlexModule,
   routing
 ],
 providers: [
   Plex,
   Server
 ],
 bootstrap: [AppComponent]
})
export class AppModule { }