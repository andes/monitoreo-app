import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';


// Components
import { LoginComponent } from './components/login/login.component';
import { SelectOrganizacionComponent } from './components/select-organizacion/select-organizacion.component';
import { LogoutComponent } from './components/logout/logout.component';

import { LoginRoutingModule } from './login-routing.module';

// Services
import { OrganizacionService } from '../services/organizacion.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    SelectOrganizacionComponent
  ],
  providers: [OrganizacionService]
})
export class LoginModule { }
