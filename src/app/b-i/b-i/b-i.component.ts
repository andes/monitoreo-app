import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { IFiltroBi } from '../interfaces/IFiltroBi.interface';

import { BIService } from '../services/b-i-service';

@Component({
  selector: 'app-root',
  templateUrl: './b-i.component.html',
  styleUrls: ['./b-i.component.scss'],
  encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class BIComponent implements OnInit {
  title = 'Consultas';
  private main = 12;
  private listaFiltro: any;
  private listaArgumentos = [];
  private selectConsulta: IFiltroBi;
  private seleccionado: boolean;
  constructor(public plex: Plex, private biService: BIService) {

    this.selectConsulta = null;
    this.biService.getAllQuerys().subscribe(
      resultado => {
        this.listaFiltro = resultado;
      },
      (err) => {
        // console.log("error desde get: ", err);
      }
    );
  }

  ngOnInit() {
  }

  elegirConsulta() {
    // Traemos de la BD los argumentos para esa consulta (armamos listaArgumentos de acuerdo a lo elegido)
    if (this.selectConsulta) {
      this.listaArgumentos = this.selectConsulta.argumentos;

    }
  }

  mostrar(event) {
    console.log(event);
  }
  descargarCSV(event) {
    if (this.selectConsulta) {
      let nombre = this.selectConsulta;
      this.biService.descargar(this.selectConsulta);
    }
  }
}
