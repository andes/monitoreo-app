import { ModulosService } from '../services/modulos.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { IModulo } from '../interfaces/IModulo.interface';
import { cache } from '@andes/shared';
import { Observable } from 'rxjs';

const sizeSidebar = 4;
@Component({
    selector: 'app-modulos',
    templateUrl: './modulos.component.html',
    styleUrls: ['./modulos.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ModulosComponent implements OnInit {
    public main = 12;

    // títulos
    public modulo: IModulo;
    public modulos$: Observable<any[]>;
    public modulos: IModulo[];
    public titleABM: string;
    private modoEdit: boolean;
    public filtroNombre: string;
    loader = true;

    constructor(
        public plex: Plex,
        private moduloService: ModulosService,
        public auth: Auth) {
        this.modulo = null;
        this.modulos = [];
        this.modoEdit = false;
    }

    ngOnInit() {
        this.modulos$ = this.moduloService.search().pipe(cache());
        this.filtrarResultados();
        this.loadRegModulo();
    }

    nuevo() {
        this.abrirSidebar('Registar módulo');
    }

    cerrarSidebar() {
        this.main = 12;
        this.loadRegModulo();
    }

    abrirSidebar(title) {
        this.main = 12 - sizeSidebar;
        this.titleABM = title;
        this.loadRegModulo();
    }

    loadRegModulo() {
        this.modoEdit = false;
        this.modulo = {
            nombre: '',
            descripcion: '',
            subtitulo: '',
            color: '',
            icono: '',
            linkAcceso: '',
            permisos: [''],
            activo: true,
            orden: null
        };
    }

    verRegistro(modulo: IModulo = null) {
        this.abrirSidebar('Editar módulo');
        if (modulo) {
            this.modulo = Object.assign({}, modulo);
        }
        this.modoEdit = true;
    }

    saveModulo() {
        if (this.modoEdit) { // editar novedad;
            this.moduloService.update(this.modulo._id, this.modulo).subscribe(
                () => {
                    this.modulos$ = this.moduloService.search().pipe(cache());
                    this.filtrarResultados();
                    this.plex.toast('success', 'Los datos se editaron correctamente');
                },
                (err) => {
                    this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde',
                        'Error al actualizar el módulo');
                }
            );
        } else { // crear novedad

            this.moduloService.create(this.modulo).subscribe(
                () => {
                    this.modulos$ = this.moduloService.search().pipe(cache());
                    this.filtrarResultados();
                    this.plex.toast('success', 'Los datos se guardaron correctamente');
                },
                (err) => {
                    this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde',
                        'Error al crear módulo');
                }
            );
        }
        this.cerrarSidebar();
    }

    filtrarResultados() {
        this.loader = true;
        this.modulos$.subscribe(value => {
            this.modulos = value.sort((a, b) => a.orden - b.orden);
            if (this.filtroNombre) {
                this.modulos = this.modulos.filter(e => e.nombre.toLowerCase().search(this.filtroNombre.toLowerCase()) !== -1);
            }
            this.loader = false;
        });
    }
}
