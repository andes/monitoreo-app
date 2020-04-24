import { Component, OnInit, ViewEncapsulation, QueryList, ViewChildren } from '@angular/core';
import { Plex } from '@andes/plex';
import { IFiltroQuery } from '../interfaces/IFiltroQuery.interface';
import { QueriesGeneratorService } from '../services/query-generator-service';
import { FiltroQueryComponent } from '../filtros/filtros.query.component';

@Component({
  selector: 'app-root',
  templateUrl: './query-generator.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})

export class QueryComponent implements OnInit {
  title = 'Consultas';
  main = 12;
  listaFiltro: any;
  listaArgumentos: any = [];
  selectConsulta: IFiltroQuery;

  @ViewChildren(FiltroQueryComponent) listaElemFiltro: QueryList<any>;

  constructor(public plex: Plex, private biService: QueriesGeneratorService) {
    this.selectConsulta = null;
    this.biService.getAllQueries().subscribe(
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
  // botón select consulta
  elegirConsulta() {
    if (this.selectConsulta) {
      // lista con datos de los componenetes a crear
      this.listaArgumentos = this.selectConsulta.argumentos;
    }
  }
  // variable boleana para mostrar el botón de descarga
  mostrarBoton() {
    let argumentosCarg = true;
    if ((this.listaElemFiltro) && (this.listaElemFiltro.length > 0)) {
      this.listaElemFiltro.forEach(arg => {
        arg.argInstance.validateForm();
        argumentosCarg = argumentosCarg && arg.isValid;
      });
    }
    return argumentosCarg;
  }

  descargarCSV() {
    if (this.selectConsulta && this.mostrarBoton()) {
      if (this.verificarFechas()) {
        this.biService.descargar(this.selectConsulta);
      }
    }
  }

  verificarFechas() {
    // Revisamos el contenido de los argumentos,
    // si son intervalos de fechas comparamos orden fechaInicio < fechaFin
    // Según 'nombre' argumento en la BD: se asume que fecha de inicio se llama "fechaInicio" y fecha fin "fechaFin"
    let fechasOk = true;
    let fechaI: Date;
    let fechaF: Date;
    if ((this.listaArgumentos) && (this.listaArgumentos.length > 0)) {
      this.listaArgumentos.forEach(arg => {
        if (arg.tipo === 'date') {
          if (arg.nombre === 'fechaInicio' && (arg.valor)) { fechaI = new Date(arg.valor); }
          if (arg.nombre === 'fechaFin' && (arg.valor)) { fechaF = new Date(arg.valor); }
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
