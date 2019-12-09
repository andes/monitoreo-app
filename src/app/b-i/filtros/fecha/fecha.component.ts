import { Component, OnInit } from '@angular/core';
import { FiltroBiComponent } from '../filtros.bi.component';
import { filtrosBi } from '../filtros.bi.decorator';

@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.component.html',
  styleUrls: ['./fecha.component.scss']
})
@filtrosBi('FechaComponent')
export class FechaComponent extends FiltroBiComponent implements OnInit {

  ngOnInit() {
    // console.log(this.argumento);
  }
}
