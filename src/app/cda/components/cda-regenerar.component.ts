import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { Router } from '@angular/router';
import { CdaService } from '../services/cda.service';


const sizeSide = 12;
@Component({
  selector: 'app-cda-regenerar',
  templateUrl: './cda-regenerar.html',
  styleUrls: []
})


export class CdaRegenerarComponent implements OnInit {
  listaPacientes: any = [];
  loading = false;
  searchClear = true;    // True si el campo de búsqueda se encuentra vacío
  side = sizeSide;
  pacienteSelected = null;
  listaCDA = [];
  public disabledBtn = false;

  constructor(private plex: Plex, private router: Router, private cdaService: CdaService) {
  }

  ngOnInit() {
  }

  onSearchStart() {
    this.loading = true;
  }

  onSearchEnd(pacientes: any[]) {
    this.searchClear = false;
    this.loading = false;
    this.listaPacientes = pacientes;
    this.side = sizeSide;
  }

  onSearchClear() {
    this.searchClear = true;
    this.listaPacientes = [];
    this.side = sizeSide;
  }

  seleccionar(paciente) {
    this.disabledBtn = false;
    if (paciente) {
      this.pacienteSelected = paciente;
      this.side = 7;
      this.refreshCDA();
    } else {
      this.side = sizeSide;
    }
  }

  regenerarCDA() {
    // deshabilitamos boton regenerar por unos segundos
    this.disabledBtn = true;
    this.cdaService.regenerarCda({ paciente: this.pacienteSelected }).subscribe();
    window.setTimeout(() => {
      this.disabledBtn = false;
    }, 900);
  }

  refreshCDA() {
    this.cdaService.getCDAList(this.pacienteSelected.id).subscribe(resp => {
      if (resp) {
        this.listaCDA = resp;
      }
    });
  }
}
