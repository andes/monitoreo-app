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
    // this.argumetosCargados = false;
    this.selectConsulta = null;
    this.biService.getAllQuerys().subscribe(
      resultado => {
        this.listaFiltro = resultado;
      },
      (err) => {
        this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Queries');
      }
    );
  }

  ngOnInit() {
  }

  elegirConsulta() {
    if (this.selectConsulta) {
      this.listaArgumentos = this.selectConsulta.argumentos;
    }
  }

  mostrar() {
    let argumetosCarg = true;
    if ((this.listaArgumentos) && (this.listaArgumentos.length > 0)) {
      this.listaArgumentos.forEach(arg => {
        argumetosCarg = argumetosCarg && (arg.valor !== undefined) && (arg.valor !== null);
      });
    }
    return argumetosCarg;
  }
  descargarCSV() {
    if (this.selectConsulta) {
      let nombre = this.selectConsulta;
      //this.argumetosCargados = true;

      if (this.verificarFechas()) {
        this.biService.descargar(this.selectConsulta);
      }
    }
  }
  verificarFechas() {
    // revisamos el contenido de los argumentos,
    // si son intervalos de fechas comparamos orden fechaInicio < fechaFin
    let fechasOk = true;
    let fechaI: Date;
    let fechaF: Date;
    if ((this.listaArgumentos) && (this.listaArgumentos.length > 0)) {
      this.listaArgumentos.forEach(arg => {
        if (arg.tipo === 'date') {
          switch (arg.nombre) {
            case 'fechaInicio': if (!arg.valor) { fechasOk = false; } else { fechaI = new Date(arg.valor); } break;
            case 'fechaFin': if (!arg.valor) { fechasOk = false; } else { fechaF = new Date(arg.valor); } break;
            default: fechasOk = (arg.valor);
          }
        }
      });
    }
    if (fechasOk && fechaF && fechaI && (fechaF < fechaI)) {
      this.plex.info('danger', 'La fecha final no puede ser menor a la fecha inicial', 'Error en Fechas');
      fechasOk = false;
    }
    return fechasOk;
  }
}
