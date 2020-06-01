import { ModulosComponent } from './components/modulos.component';
import { ModulosService } from 'src/app/modulos/services/modulos.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { ModulosRoutingModule } from './modulos-routing.module';

@NgModule({
    declarations: [
        ModulosComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        ModulosRoutingModule
    ],
    providers: [ModulosService]
})
export class ModulosModule { }
