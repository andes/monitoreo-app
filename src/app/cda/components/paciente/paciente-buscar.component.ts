import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-paciente-buscar',
  templateUrl: './paciente-buscar.html',
  styleUrls: []
})
export class PacienteBuscarComponent implements OnInit {
  private timeoutHandle: number;
  public textoBuscar: string = null;
  public autoFocus = 0;

  // Eventos
  @Output() searchStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchClear: EventEmitter<any> = new EventEmitter<any>();

  constructor(private plex: Plex, private router: Router, private pacienteService: PacienteService) {
  }

  ngOnInit() {
  }

  buscar() {
    // Cancela la búsqueda anterior
    if (this.timeoutHandle) {
      window.clearTimeout(this.timeoutHandle);
    }

    const textoBuscar = this.textoBuscar && this.textoBuscar.trim();

    // Inicia búsqueda
    if (textoBuscar) {
      this.timeoutHandle = window.setTimeout(() => {
        this.searchStart.emit();
        this.timeoutHandle = null;

        // Busca por texto libre
        this.pacienteService.get({ search: textoBuscar }).subscribe(
          resultado => {
            this.searchEnd.emit({ pacientes: resultado, err: null });
          },
          (err) => this.searchEnd.emit({ pacientes: [], err })
        );
      }, 200);
    } else {
      this.searchClear.emit();
    }
  }
}
