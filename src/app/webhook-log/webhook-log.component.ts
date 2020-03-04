import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { WebhookLogService } from './services/webhook-log.service';
import { IWebhooklog } from './interfaces/IWebhook-log';

const limit = 20;

@Component({
  selector: 'app-root',
  templateUrl: './webhook-log.component.html',
  styleUrls: ['../app.component.css']
})
export class WebhookLogComponent implements OnInit {
  title = 'WebHookLog';
  elemElegido;
  listMostrar: IWebhooklog[];
  private listFiltrar;
  textoBuscar;
  main = 12;
  fechaI: Date;
  fechaF: Date;
  private finScroll = false;
  private skip = 0;


  constructor(public plex: Plex, private webhooklogService: WebhookLogService) {
    this.textoBuscar = null;
    this.listFiltrar = [
      { id: 2, nombre: 'Event' },
      { id: 3, nombre: 'URL' },
      { id: 4, nombre: 'Fecha' }];
    this.elemElegido = null;
    this.listMostrar = [];
  }
  ngOnInit() {
    this.loadData(false);
    this.skip = 0;
  }

  loadData(concatenar: boolean = false) {
    this.main = 12;
    let error = false;
    if (!concatenar) { this.skip = 0; }
    const params: any = {
      limit,
      skip: this.skip
    };
    if (this.textoBuscar) {
      params.search = this.textoBuscar;
    }
    if (this.fechaI || this.fechaF) {
      if ((this.fechaI) && (this.fechaF) && (this.fechaI > this.fechaF)) {
        this.plex.info('danger', 'La fecha final no puede ser menor a la fecha inicial', 'Error en Fechas');
        error = true;
        this.fechaF = null;
      } else {
        params.fecha = (this.fechaI && this.fechaF) ? `${this.fechaI}|${this.fechaF}` :
          (this.fechaI) ? `>=${this.fechaI}` : `<=${this.fechaF}`;
      }
    }
    if (!error) { // si el orden de las fechas es correcto
      this.webhooklogService.getAll(params).subscribe(
        data => {
          if (concatenar) {
            if (data.length > 0) {
              this.listMostrar = this.listMostrar.concat(data);
              this.skip += limit;
            }
            this.finScroll = !(data.length > 0);
          } else {
            this.listMostrar = data;
            this.skip += limit;
            this.finScroll = false;
          }
        },
        (err) => { this.listMostrar = []; this.skip = 0; });
    }
  }


  seleccionarElem(e) {
    this.webhooklogService.getById(e._id).subscribe(
      data => {
        this.elemElegido = data;
        this.main = 9;
      },
      (err) => {
        this.elemElegido = null;
      });
  }
}
