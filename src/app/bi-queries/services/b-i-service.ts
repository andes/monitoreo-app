import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { saveAs } from 'file-saver';

import { Server } from '@andes/shared';

import { environment } from 'src/environments/environment';
import { Options } from '@andes/shared/src/lib/server/options';
import { Plex } from '@andes/plex';

import * as moment from 'moment';
import { IFiltroBi } from '../interfaces/IFiltroBi.interface';


// Constantes
const defaultOptions: Options = { params: null, showError: true, showLoader: true };

@Injectable()
export class BIService {

    // URL to web api
    private biUrl: string;
    private nombre = 'consulta';

    constructor(private http: HttpClient, private server: Server, private plex: Plex) {
        this.biUrl = '/modules/bi-queries';
    }

    // obtiene todas las querys de la colección "Consultas"
    getAllQuerys(): Observable<any> {
        const res = this.server.get(this.biUrl + `/biQueries`, { showError: true });
        return res;
    }

    descargar(consulta: IFiltroBi) {
        this.nombre = consulta.nombre;
        this.post(consulta).subscribe((data: any) => {
            if (data.size < 50) {
                this.plex.info('warning', 'No hay datos para descargar', 'Archivo vacío');
            } else {
                this.descargarArchivo(data, { type: 'text/csv' });
            }

        });
    }
    // redefinimos el post de server (url, body, options) para archvos blob
    post(consulta: any, options: Options = defaultOptions): Observable<any> { // en option trae params
        this.updateLoader(true, options);
        return this.http.post(environment.API + this.biUrl + `/descargarCSV`, JSON.stringify({ params: consulta }),
            this.prepareOptions(options, 'blob')).pipe(
                finalize(() => this.updateLoader(false, options)),
                map((res: any) => this.parse(res)),
                catchError((err: any) => this.handleError(err, options))
            );
    }

    private descargarArchivo(data: any, headers: any): void {
        const blob = new Blob([data], headers);
        // TODO Definir nombre del csv
        const nombreArchivo = this.nombre + '-' + moment().format('DD-MM-YYYY') + '.csv';
        saveAs(blob, nombreArchivo);
    }

    private updateLoader(show: boolean, options: Options) {
        if (!options || options.showLoader || (options.showLoader === undefined)) {
            if (show) {
                this.plex.showLoader();
            } else {
                this.plex.hideLoader();
            }
        }
    }

    private handleError(response: any, options: Options) { // manejador de errores (usa plex)
        let message;
        if (response.error) {
            message = response.error.message;
        } else {
            message = 'La aplicación no pudo comunicarse con el servidor. Por favor revise su conexión a la red.';
        }
        if (!options || options.showError || (options.showError === undefined)) {
            // El código 400 es usado para enviar mensaje de validación al usuario
            if (response.status === 400) {
                this.plex.info('warning', `<div class="text-muted small pt-3">Código de error: ${response.status}</div>`, message);
            } else {
                this.plex.info('danger', `${message}<div class="text-muted small pt-3">Código de error:
                ${response.status}</div>`, 'No se pudo conectar con el servidor');
            }
        }
        return throwError(message);
    }

    private prepareOptions(options: Options, resType: string = null) { // prepara headers y options
        const result: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: window.sessionStorage.getItem('jwt') ? 'JWT ' + window.sessionStorage.getItem('jwt') : ''
            }),
        };
        if (resType) { result.responseType = resType; }
        if (options && options.params) {
            result.params = new HttpParams();
            for (const param in options.params) {
                if (options.params[param] !== undefined) {
                    if (Array.isArray(options.params[param])) {
                        (options.params[param] as Array<any>).forEach((value) => {
                            result.params = result.params.append(param, value);
                        });
                    } else {
                        if (options.params[param] instanceof Date) {
                            result.params = result.params.set(param, (options.params[param] as Date).toISOString());
                        } else {
                            result.params = result.params.set(param, options.params[param]);
                        }
                    }
                }
            }
        }
        return result;
    }

    private parse(data: any): any {
        const dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
        const dateNet = /\/Date\((-?\d+)(?:-\d+)?\)\//i;
        const traverse = function (o, func) {
            for (const i of Object.keys(o)) {
                o[i] = func.apply(this, [i, o[i]]);
                if (o[i] !== null && typeof (o[i]) === 'object') {
                    traverse(o[i], func);
                }
            }
        };
        // tslint:disable-next-line: only-arrow-functions
        const replacer = function (key, value) {
            if (typeof (value) === 'string') {
                if (dateISO.test(value)) {
                    return new Date(value);
                }
                if (dateNet.test(value)) {
                    return new Date(parseInt(dateNet.exec(value)[1], 10));
                }
            }
            return value;
        };
        traverse(data, replacer);
        return data;

    }

}
