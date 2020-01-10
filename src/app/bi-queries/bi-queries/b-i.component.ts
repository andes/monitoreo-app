import { Component, OnInit, ViewEncapsulation, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { IFiltroBi } from '../interfaces/IFiltroBi.interface';
import { IArgumentoBi } from '../interfaces/IArgumentoBi.interface';
import { BIService } from '../services/b-i-service';
import { FiltroBiComponent } from '../filtros/filtros.bi.component';

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
  private listaArgumentos: any = [];
  private selectConsulta: IFiltroBi;
  private seleccionado: boolean;
  private mostrar = true;

  @ViewChildren(FiltroBiComponent) listaElemFiltro: QueryList<any>;
  @ViewChild('formulario', { static: true }) formulario: any;
  constructor(public plex: Plex, private biService: BIService) {
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
      this.listaArgumentos = this.selectConsulta.argumentos; // se establecen la lista con info de componenetes a crear
      this.mostrarDatos();
    }
  }

  mostrarDatos() {
    let argumetosCarg = true;
    if ((this.listaElemFiltro) && (this.listaElemFiltro.length > 0)) {
      this.listaElemFiltro.forEach(arg => {
        argumetosCarg = argumetosCarg && arg.isValid;
      });
    }
    this.mostrar = argumetosCarg;
  }
  descargarCSV(event) {
    if (this.selectConsulta) {
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
