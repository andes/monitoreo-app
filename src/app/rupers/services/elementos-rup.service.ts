import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server, cache } from '@andes/shared';
import { tap } from 'rxjs/operators';
import { ISnomedConcept } from '../../shared/ISnomedConcept';
import { IElementoRUP } from '../../shared/IElementoRUP';

@Injectable({ providedIn: 'root' })
export class ElementosRupService extends ResourceBaseHttp {
    protected url = '/modules/rup/elementos-rup';

    public cache$ = this.search({ limit: 1000 }).pipe(
        tap(data => this.processData(data)),
        cache()
    );

    constructor(protected server: Server) {
        super(server);
    }


    public cache: IElementosRUPCache = {};
    public cacheById: IElementosRUPCache = {};
    // Mantiene un caché de la base de datos de elementos
    private cacheParaSolicitud: IElementosRUPCache = {};
    // Precalcula los elementos default
    private defaults: IElementosRUPCache = {};
    // Precalcula los elementos default para solicitudes
    private defaultsParaSolicitud: IElementosRUPCache = {};

    processData(elementosRups) {
        elementosRups.forEach(e => this.cacheById[e.id] = e);
        // Precalcula los defaults
        elementosRups.filter(e => !e.inactiveAt).forEach(elementoRUP => {
            elementoRUP.conceptos.forEach((concepto) => {
                if (elementoRUP.esSolicitud) {
                    this.cacheParaSolicitud[concepto.conceptId] = elementoRUP;
                } else {
                    this.cache[concepto.conceptId] = elementoRUP;
                }
            });
            if (elementoRUP.defaultFor && elementoRUP.defaultFor.length) {
                elementoRUP.defaultFor.forEach((semanticTag) => {
                    if (elementoRUP.esSolicitud) {
                        this.defaultsParaSolicitud[semanticTag] = elementoRUP;
                    } else {
                        this.defaults[semanticTag] = elementoRUP;
                    }
                });
            }
        });
    }

    buscarElemento(concepto: ISnomedConcept, esSolicitud: boolean): IElementoRUP {
        // Busca el elemento RUP que implemente el concepto
        if (typeof concepto.conceptId === 'undefined') {
            concepto = concepto[1];
        }

        // TODO: ver cómo resolver esto mejor...
        concepto.semanticTag = concepto.semanticTag === 'plan' ? 'procedimiento' : concepto.semanticTag;
        if (esSolicitud) {
            const elemento = this.cacheParaSolicitud[concepto.conceptId];
            if (elemento) {
                return elemento;
            } else {
                return this.defaultsParaSolicitud[concepto.semanticTag];
            }
        } else {
            const elemento = this.cache[concepto.conceptId];
            if (elemento) {
                return elemento;
            } else {
                return this.defaults[concepto.semanticTag];
            }
        }
    }
}


export interface IElementosRUPCache {
    [key: string]: IElementoRUP;
}
