import { Injectable } from '@angular/core';
import { Server, saveAs } from '@andes/shared';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PrescripcionesService {

    constructor(private server: Server) { }

    // Recetas de medicamentos (incluye magistrales) y de insumos (dispositivos, nutriterápicos y magistrales)
    getPrescripciones(pacienteId: string): Observable<any[]> {
        const params = { pacienteId };
        return forkJoin([
            this.server.get('/modules/recetas', { params }),
            this.server.get('/modules/recetasInsumos', { params })
        ]).pipe(
            // Ante parámetros inválidos la API responde con el objeto de error en lugar de un listado
            map(([medicamentos, insumos]) => [
                ...(Array.isArray(medicamentos) ? medicamentos : []),
                ...(Array.isArray(insumos) ? insumos : [])
            ])
        );
    }

    descargarPdf(informe: { idPrestacion: string; idRegistro: string; recetasIds: string[] }, nombreArchivo: string): Observable<any> {
        return this.server.post('/modules/descargas/recetas', informe, { responseType: 'blob' } as any).pipe(
            saveAs(nombreArchivo, 'pdf')
        );
    }
}
