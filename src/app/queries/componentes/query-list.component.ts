import { Component, OnInit } from '@angular/core';
import { QueryService } from '../services/query.service';
import { Auth } from '@andes/auth';
import { Router } from '@angular/router';
import { Plex } from '@andes/plex';
import { IQuery } from '../interfaces/IQuery';
import { SendMessageCacheService } from 'src/app/monitor-activaciones/services/sendMessageCache.service';
import { IDevice } from '../interfaces/IDevice';


@Component({
    selector: 'app-query-list',
    templateUrl: './query-list.component.html'
})
export class QueryListComponent implements OnInit {
    queries: any[] = []; // Lista filtrada que se muestra
    public listaFiltro = []; // Lista completa de queries del backend
    public buscador: string; // Campo para la búsqueda
    public loader = false; // Estado del loader de búsqueda
    public resultadoBusqueda;
    public searchClear = true; // Control para limpiar búsqueda
    Query: IQuery; // Query seleccionada
    QueryEditada: IQuery; // Copia editable
    QueryDevice: IDevice;
    resultadoMensajes;
    QuerySeleccionada: any = null;
    edicionActivada = false;

    constructor(
        private queryService: QueryService,
        private plex: Plex,
        private router: Router,
        private auth: Auth,
        private sendMessageCacheService: SendMessageCacheService

    ) { }

    ngOnInit() {
        if (!this.auth.check('monitoreo:biQueries')) {
            this.router.navigate(['./inicio']);
        }
        this.queryService.getQueries({}).subscribe(
            resultado => {
                this.listaFiltro = resultado;
                this.queries = []; // Mostrar todos al inicio
            }

        );
    }

    seleccionar(query: any) {
        if (this.QuerySeleccionada && this.Query === query) {
            this.QuerySeleccionada = false;
            this.Query = null;
            this.QueryDevice = null;
            this.edicionActivada = false;
        } else {
            this.QuerySeleccionada = true;
            this.Query = query;
            this.loadMensajes(this.Query.descripcion);
            this.edicionActivada = false;
        }
    }

    public loadMensajes(descripcion: string) {
        this.sendMessageCacheService.get({ descripcion }).subscribe(
            datos => {
                this.resultadoMensajes = datos;
            }
        );
    }

    habilitarEdicion() {
        if (this.QuerySeleccionada) {
            this.QueryEditada = Object.assign({}, this.Query);
            this.edicionActivada = true;

        }
    }

    // Buscar por texto
    public loadQueries(): void {
        const search = this.buscador?.toLowerCase().trim() || '';
        if (search) {
            this.searchClear = false;

            this.queries = this.listaFiltro.filter(query =>
                query.nombre?.toLowerCase().includes(search) ||
                query.descripcion?.toLowerCase().includes(search)

            );
        } else {
            this.queries = [];
            this.onSearchEnd([]);
            this.onSearchClear();
        }
    }
    // Guardar cambios a la query
    guardarEdicion() {
        if (this.Query && this.QueryEditada) {
            const id = this.Query._id;
            const cambios = {
                nombre: this.QueryEditada.nombre,
                descripcion: this.QueryEditada.descripcion
            };

            // 🔍 Mostramos lo que se está por enviar
            this.queryService.patchQuery(id, cambios).subscribe({
                next: (respuesta) => {
                    this.plex.toast('success', 'Query actualizada correctamente', '✔️');
                    this.Query = respuesta;
                    this.QueryEditada = { ...respuesta };
                    this.edicionActivada = false;
                    this.refreshQueries();
                },
                error: (err) => {
                    console.log('ERROR DEL PATCH:', err);
                    if (err.error) {
                        console.error('Mensaje del backend:', err.error.message || err.error.mensaje);
                    }
                    this.plex.toast('danger', 'Error al actualizar la query', '❌');
                }
            });

        }
    }

    // Refrescar la lista después de editar
    refreshQueries() {
        this.queryService.getQueries({}).subscribe(resultado => {
            this.listaFiltro = resultado;
            this.loadQueries(); // vuelve a aplicar el filtro actual
        });
    }

    cancelarEdicion() {
        this.edicionActivada = false;
    }


    // Eventos auxiliares
    onSearchStart() { this.loader = true; }
    onSearchEnd(queries: any[]) { this.loader = false; this.resultadoBusqueda = queries; }
    onSearchClear() { this.searchClear = true; this.resultadoBusqueda = null; }

}

