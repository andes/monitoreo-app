import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { QueriesGeneratorService } from '../services/query-generator.service';
import { Slug } from 'ng2-slugify';
import { ConceptoTruneableService } from '../../conceptos-turneables/services/concepto-turneable.service';
import { OrganizacionService } from '../../services/organizacion.service';

@Component({
    selector: 'app-query-execute',
    templateUrl: './query-execute.component.html'
})

export class QueryExecuteComponent implements OnInit {

    public selectConsulta;
    private listaArgumentos;
    public listaFiltro = [];
    private slug: Slug = new Slug('default');
    public listaValores: any = {};


    constructor(
        private plex: Plex, private biService: QueriesGeneratorService,
        private conceptoTurneableService: ConceptoTruneableService,
        private servicioOrganizacion: OrganizacionService
    ) {

    }

    ngOnInit() {
        this.biService.getAllQueries({}).subscribe(
            resultado => this.listaFiltro = resultado,
            err => this.mostrarError()
        );

    }

    descargar($event) {
        if (!$event.formValid) {
            return;
        } else {
            const params = {};
            this.listaArgumentos.forEach(arg => {
                const key = arg.key;
                const valor = this.listaValores[key];
                if (valor instanceof Date) {
                    params[key] = moment(valor).startOf('d').format();
                }
                if (valor && valor.id) {  // select
                    params[key] = valor.id;
                }

            });
            const nombre = this.selectConsulta.nombre || 'consulta';
            this.biService.descargar(this.selectConsulta, params).subscribe(data => {
                if (data.size) {
                    const blob = new Blob([data], { type: data.type });
                    saveAs(blob, this.slug.slugify(nombre + ' ' + moment().format('DD-MM-YYYY-hmmss')) + '.xlsx');
                } else {
                    this.plex.info('warning', 'Su búsqueda no arrojó ningún resultado', 'Consultas');
                }
            },
                err => this.mostrarError()
            );
        }

    }

    elegirConsulta() {
        if (this.selectConsulta) {
            // lista con datos de los componenetes a crear
            this.listaArgumentos = this.selectConsulta.argumentos;
        }
    }

    loadConceptosTurneables(event) {
        this.conceptoTurneableService.get({}).subscribe((data: any) => {
            event.callback(data);
        });
    }

    loadOrganizaciones(event) {
        if (event.query) {
            const query = {
                nombre: event.query
            };
            this.servicioOrganizacion.get(query).subscribe(resultado => {
                event.callback(resultado);
            });
        } else {
            event.callback([]);
        }
    }

    mostrarError() {
        this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde', 'Error al obtener Queries');
    }


}

