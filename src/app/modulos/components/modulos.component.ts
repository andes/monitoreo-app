import { ModulosService } from '../services/modulos.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { IModulo } from '../interfaces/IModulo.interface';
import { cache } from '@andes/shared';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { distinctUntilChanged, tap, map } from 'rxjs/operators';

const sizeSidebar = 5;
@Component({
    selector: 'app-modulos',
    templateUrl: './modulos.component.html',
    styleUrls: ['./modulos.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ModulosComponent implements OnInit {
    public main = 12;

    // títulos
    public modulo: IModulo = {
        nombre: '',
        descripcion: '',
        subtitulo: '',
        color: '',
        icono: '',
        linkAcceso: '',
        permisos: [''],
        activo: true,
        orden: null,
        submodulos: []
    };

    public modulos$: Observable<any[]>;
    public modulos: IModulo[];
    public titleABM: string;
    private modoEdit: boolean;
    public filtroNombre: string;
    loader = true;


    formulario: FormGroup = new FormGroup({
        activo: new FormControl(true, Validators.required),
        nombre: new FormControl('', Validators.required),
        subtitulo: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        color: new FormControl('', Validators.nullValidator),
        linkAcceso: new FormControl('', Validators.nullValidator),
        icono: new FormControl('', Validators.nullValidator),
        orden: new FormControl('', Validators.required),
        submodulos: new FormArray([])
    });

    submodulos = this.formulario.get('submodulos') as FormArray;

    formStatus$: Observable<string> = new Observable();
    formStatus: string;

    constructor(
        public plex: Plex,
        private moduloService: ModulosService,
        private router: Router,
        public auth: Auth) {
        this.modulo = null;
        this.modulos = [];
        this.modoEdit = false;
    }

    ngOnInit() {
        if (!this.auth.check('monitoreo:modulos')) {
            this.router.navigate(['./inicio']);
        }
        this.modulos$ = this.moduloService.search().pipe(cache());
        this.filtrarResultados();
        this.loadRegModulo();

        this.formStatus$ = this.formulario.statusChanges.pipe(
            distinctUntilChanged((a, b) => a === b),
            map(status => status.toLowerCase())
        );

    }

    get tieneSubmodulos() {
        return this.submodulos.get('name');
    }

    addSubmodulo() {
        const group = new FormGroup({
            activo: new FormControl(true, Validators.required),
            nombre: new FormControl('', Validators.required),
            linkAcceso: new FormControl('', Validators.required),
            color: new FormControl('', Validators.nullValidator),
            icono: new FormControl('', Validators.required),
            orden: new FormControl('', Validators.required),
        });
        this.submodulos.push(group);
    }

    removeSubmodulo(index: number) {
        this.plex.confirm(`Submódulo: ${this.submodulos.value[index].nombre}`, '¿Eliminar submódulo?', 'Eliminar').then(remover => {
            if (remover) {
                this.submodulos.removeAt(index);
            }
        });
    }

    nuevo() {
        this.abrirSidebar('Registar módulo');
        this.formulario.reset();
        this.submodulos.clear();
    }

    cerrarSidebar() {
        this.main = 12;
        this.loadRegModulo();
        this.formulario.reset();
    }

    abrirSidebar(title) {
        this.main = 12 - sizeSidebar;
        this.titleABM = title;
        this.loadRegModulo();
    }

    loadRegModulo() {
        this.modoEdit = false;
    }

    verRegistro(modulo: IModulo = null) {
        this.modulo = modulo; // Guardamos el id para luego poder guardar
        this.abrirSidebar('Editar módulo');
        this.submodulos.clear();
        if (modulo.submodulos.length) {
            modulo.submodulos.map(x => this.addSubmodulo());
        }
        this.formulario.patchValue(modulo); // patchValue quita valores que no usa el form (id)
        this.modoEdit = true;
    }

    saveModulo() {

        if (this.formulario.valid) {
            if (this.submodulos.valid) {
                this.formulario.get('submodulos').patchValue(this.submodulos.value);
            } else {
                this.submodulos = null;
            }

            if (this.modoEdit) { // editar módulo;
                this.moduloService.update(this.modulo._id, this.formulario.value).subscribe(
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
            } else { // crear módulo

                this.moduloService.create(this.formulario.value).subscribe(
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
            this.formulario.reset();
            this.cerrarSidebar();
        }

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
