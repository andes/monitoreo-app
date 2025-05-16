import { Auth } from '@andes/auth';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IElementoRUP } from 'src/app/shared/IElementoRUP';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { ElementosRupListadoService } from './elementos-rup-listado.service';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { SendMessageCacheService } from 'src/app/monitor-activaciones/services/sendMessageCache.service';
@Component({
    selector: 'rup-elementos-rup-listado',
    templateUrl: 'elementos-rup-listado.component.html',
    providers: [ElementosRupListadoService]
})
export class RUPElementosRupListadoComponent implements OnInit {
    elementosRup$: Observable<IElementoRUP[]>;
    constructor(
        private router: Router,
        private listadoService: ElementosRupListadoService,
        private elementosRupService: ElementosRupService,
        private auth: Auth,
        private sendMessageCacheService: SendMessageCacheService

    ) { }

    public items = [
        { label: 'ATOMO', handler: () => { this.goto('/rupers/elementos-rup/atomo/nuevo'); } },
        { label: 'MOLECULA', handler: () => { this.goto('/rupers/elementos-rup/molecula/nuevo'); } },
        { label: 'SECCION', handler: () => { this.goto('/rupers/elementos-rup/seccion/nuevo'); } },
        { label: 'PRESTACION', handler: () => { this.goto('/rupers/elementos-rup/prestacion/nuevo'); } }

    ];
    busqueda = '';
    todosLosElementos: IElementoRUP[] = [];
    elementosFiltrados: IElementoRUP[] = [];
    RuperSeleccionada: any = null;
    RupEditado: IElementoRUP; // Copia editable
    QueryDevice: ISnomedConcept;
    edicionActivada = false;
    ElementoRup: IElementoRUP | null = null;
    elementoSeleccionado: IElementoRUP | null = null;
    resultadoMensajes;
    cantidadElementos = 0;

    columns = [
        { key: 'col-1', label: 'Nombre' },
        { key: 'col-2', label: 'Concepto' },
        { key: 'col-3', label: 'Componente' },
        { key: 'col-4', label: 'Tipo' },
        { key: 'col-5', label: 'Requeridos' }
    ] as const;

    ngOnInit() {
        if (!this.auth.check('monitoreo:rupers')) {
            return this.router.navigate(['./inicio']);
        }
        this.elementosRup$ = this.listadoService.elementosRup$;

        this.elementosRup$.subscribe((elementos) => {
            this.todosLosElementos = elementos;
            this.elementosFiltrados = elementos;
            this.cantidadElementos = elementos.length; // ✅ sumás acá

        });

        this.elementosRupService.refresh.next(null);

    }


    seleccionar(elemento: IElementoRUP) {
        if (this.elementoSeleccionado && this.ElementoRup === elemento) {
            this.ElementoRup = null;
            this.elementoSeleccionado = null;
            this.QueryDevice = null;
            this.edicionActivada = false;
            console.log(elemento);
            console.log('Des-seleccionando elemento');
        } else {
            console.log('Seleccionando elemento:', elemento);

            this.ElementoRup = elemento;
            this.elementoSeleccionado = elemento;

        }

    }
    public loadMensajes(conceptos: string) {
        this.sendMessageCacheService.get({ conceptos }).subscribe(
            datos => {
                console.log('Mensajes cargados:', datos); // 👈🏼 Acá ves qué viene
                this.resultadoMensajes = datos;
            },
            error => {
                console.error('Error al cargar mensajes:', error); // 👈🏼 Y también por si falla
            }
        );
    }


    goto(url) {
        this.router.navigate([url]);
    }
}
