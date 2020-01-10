import { Component, OnInit } from '@angular/core';
import { FiltroBiComponent } from '../filtros.bi.component';
import { filtrosBi } from '../filtros.bi.decorator';

@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.component.html',
  styleUrls: ['./fecha.component.scss']
})

@filtrosBi('FechaComponent')  // cargamos el componente en lista de componentes
export class FechaComponent extends FiltroBiComponent implements OnInit {

  ngOnInit() {
  }
}
