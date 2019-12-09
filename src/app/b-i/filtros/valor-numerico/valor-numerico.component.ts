import { Component, OnInit } from '@angular/core';
import { FiltroBiComponent } from '../filtros.bi.component';
import { filtrosBi } from '../filtros.bi.decorator';

@Component({
  selector: 'app-valor-numerico',
  templateUrl: './valor-numerico.component.html',
  styleUrls: ['./valor-numerico.component.scss']
})

@filtrosBi('ValorNumericoComponent')
export class ValorNumericoComponent extends FiltroBiComponent implements OnInit {

  ngOnInit() {
    // console.log(this.argumento);
  }
  emitChange(event) {
    console.log(event);
  }
}
