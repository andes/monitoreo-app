import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';

import { IRegistroNovedades } from '../interfaces/IRegistroNovedades.interface';
import { IModuloAndes } from '../interfaces/IModuloAndes.interface';
import { RegistroNovedadesService } from '../services/registro-novedades.service';

const limit = 7;


@Component({
  selector: 'app-registro-novedades',
  templateUrl: './registro-novedades.component.html',
  styleUrls: ['./registro-novedades.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistroNovedadesComponent implements OnInit {

  private main = 12;
  // scroll infinito
  private skip;
  private finScroll = false;

  private title = 'Novedades';
  private titleABM: string;

  private regNov: IRegistroNovedades;

  private listRegNovedades: IRegistroNovedades[];

  private textoBuscar: string;
  private listModulos: IModuloAndes[];
  private modoEdit: boolean;

  constructor(public plex: Plex, private regNovService: RegistroNovedadesService) {
    this.regNov = null;
    this.listRegNovedades = [];
    this.titleABM = 'Registrar Novedad';
    this.textoBuscar = null;
    this.modoEdit = false;
  }

  ngOnInit() {

    this.loadData();
    this.skip = 0;
    this.regNovService.getAllModulos().subscribe(
      modulos => {
        this.listModulos = modulos;
      },
      (err) => {
        this.listModulos = [];
        this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
      }
    );
    this.loadRegNov();
  }

  nuevo() {
    this.abrirSidebar('Cargar Novedad');
    this.loadRegNov();
  }

  cerrarSidebar() {
    this.main = 12;
    this.loadRegNov();
  }

  abrirSidebar(title) {
    this.main = 7;
    this.titleABM = title;
  }

  loadRegNov() {
    this.modoEdit = false;
    this.regNov = {
      titulo: '',
      fecha: new Date(),
      descripcion: '',
      imagenes: [],
      modulo: null,
      activa: true
    };
  }

  verRegistro(nov: IRegistroNovedades = null) {
    this.abrirSidebar('Editar Novedad');
    if (nov) { // ver un registro
      // se copia el registro para que no se edite sobre la lista
      this.regNov = Object.assign({}, nov);
    }
    this.modoEdit = true;
  }

  creaModificaNovedad() {
    if (this.modoEdit) { // editar registro;
      this.regNovService.patch(this.regNov).subscribe(
        registros => {
          this.plex.toast('success', 'Los datos se editaron correctamente');
        },
        (err) => {
          this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
        }
      );
    } else { // crear registro
      this.regNovService.postNuevoRegistro(this.regNov).subscribe(
        registros => {
          this.cerrarSidebar();
          this.plex.toast('success', 'Los datos se guardaron correctamente');
        },
        (err) => {
          this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
        }
      );
    }
    this.loadData();
  }

  loadData(concatenar: boolean = false) {
    this.main = 12;
    if (!concatenar) { this.skip = 0; }

    const params: any = {
      limit,
      skip: this.skip
    };
    if (this.textoBuscar) {
      params.search = this.textoBuscar;
    }
    this.regNovService.getAll(params).subscribe(
      registros => {
        if (concatenar) { // scroll infinito
          if (registros.length > 0) {
            this.listRegNovedades = this.listRegNovedades.concat(registros);
            this.skip += limit;
          }
          this.finScroll = !(registros.length > 0);
        } else {
          this.listRegNovedades = registros;
          this.skip += limit;
          this.finScroll = false;
        }
      },
      (err) => {
        this.listRegNovedades = [];
        this.skip = 0;
        this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Novedades');
      }
    );
  }
}
