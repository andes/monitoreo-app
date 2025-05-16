import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ Importa el entorno

@Injectable({ providedIn: 'root' })
export class QueryService {

    // ✅ Usa la URL base desde environment.ts
    private baseUrl = `${environment.API}/bi/queries`;

    constructor(private http: HttpClient) { }

    /**
    * Obtener todas las queries
    */
    getQueries(params?: any): Observable<any[]> {
        let httpParams = new HttpParams();
        if (params?.search) {
            httpParams = httpParams.set('search', params.search);
        }

        const token = sessionStorage.getItem('jwt') || localStorage.getItem('jwt') || '';

        // 🧾 Armamos los headers con autorización
        const headers = new HttpHeaders({
            'Authorization': `JWT ${token}`
        });

        // ✅ Llamamos al backend con headers
        return this.http.get<any[]>(this.baseUrl, {
            params: httpParams,
            headers: headers
        });
    }

    /**
        * Actualiza una query existente enviando solo los campos modificados
        * @param id ID de la query
        * @param data Objeto con los datos actualizados
        */
    patchQuery(id: string, data: any): Observable<any> {
        // 🔧 Armamos la URL específica a la que se hará el PATCH, agregando el ID
        const url = `${this.baseUrl}/${id}`;

        // 🔑 Obtenemos el token, primero intentamos de sessionStorage, si no está, buscamos en localStorage
        const token = sessionStorage.getItem('jwt') || localStorage.getItem('jwt') || '';

        // 🧾 Creamos los headers de la petición HTTP
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', // ✅ Indicamos que el cuerpo será JSON
            'Authorization': `JWT ${token}` // ✅ Enviamos el token como cabecera 'Authorization'
        });

        // 🚀 Finalmente hacemos el PATCH a la API y devolvemos el observable
        return this.http.patch(url, data, { headers });
    }
}
