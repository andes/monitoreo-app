import { Component } from '@angular/core';
import { Auth } from '@andes/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(

    public auth: Auth,
  ) { }
}
