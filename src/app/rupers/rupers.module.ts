import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { RupersRoutingModule } from './rupers.routing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RUPElementosRupListadoComponent } from './components/elementos-rup-listado/elementos-rup-listado.component';
import { RUPSeccionCreateUpdateComponent } from './components/seccion-create-update/seccion-create-update.component';
import { RUPPrestacionCreateUpdateComponent } from './components/prestacion-create-update/prestacion-create-update.component';
import { RUPAtomoCreateUpdateComponent } from './components/atomo-create-update/atomo-create-update.component';
import { RUPMoleculaCreateUpdateComponent } from './components/molecula-create-update/molecula-create-update.component';

@NgModule({
    imports: [
        RupersRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        RouterModule
    ],
    declarations: [
        RUPElementosRupListadoComponent,
        RUPSeccionCreateUpdateComponent,
        RUPPrestacionCreateUpdateComponent,
        RUPAtomoCreateUpdateComponent,
        RUPMoleculaCreateUpdateComponent
    ]
})
export class RupersModule { }
