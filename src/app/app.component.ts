import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public server: Server) {
    server.setBaseURL(environment.API);
  }
}
