import { Component, OnInit } from '@angular/core';
import { FiltroQueryComponent } from '../filtros.query.component';
import { filtrosQuery } from '../filtros.query.decorator';

@Component({
  selector: 'app-valor-numerico',
  templateUrl: './valor-numerico.component.html',
  styleUrls: ['./valor-numerico.component.scss']
})

@filtrosQuery('ValorNumericoComponent')
export class ValorNumericoComponent extends FiltroQueryComponent implements OnInit {

  ngOnInit() {
  }
}
