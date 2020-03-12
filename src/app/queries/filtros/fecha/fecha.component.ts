import { Component, OnInit } from '@angular/core';
import { FiltroQueryComponent } from '../filtros.query.component';
import { filtrosQuery } from '../filtros.query.decorator';

@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.component.html',
  styleUrls: ['./fecha.component.scss']
})

@filtrosQuery('FechaComponent')  // cargamos el componente en lista de componentes
export class FechaComponent extends FiltroQueryComponent implements OnInit {

  ngOnInit() {
  }
}
