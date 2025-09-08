import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Plex } from '@andes/plex';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, BehaviorSubject, of } from 'rxjs';
import { switchMap, tap, distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { PermisosService } from '../services/permisos.service';
import { UsuariosHttp } from '../services/usuarios.service';
import { asObject, mergeObject, cache, Unsubscribe } from '@andes/shared';
import { Auth } from '@andes/auth';
import { IPaciente, IPacienteRestringido } from '../interfaces/IPaciente';
import { PacienteCacheService } from '../services/pacienteCache.service';
import { PacienteService } from '../services/paciente.service';
import { AdjuntosService } from '../services/adjuntos.service';
import { ProfesionalService } from '../services/profesional.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { PlexVisualizadorService } from '@andes/plex';

@Component({
    selector: 'restriccion-huds',
    templateUrl: 'restriccion-huds.html',
})

export class restriccionHudsComponent implements OnInit {

    @ViewChild('upload', { static: false }) uploadElement: ElementRef;

    constructor(
        public permisosService: PermisosService,
        public usuariosService: UsuariosHttp,
        public plex: Plex,
        private router: Router,
        private route: ActivatedRoute,
        private auth: Auth,
        private cd: ChangeDetectorRef,
        private pacienteCache: PacienteCacheService,
        public pacienteService: PacienteService,
        public adjuntosService: AdjuntosService,
        public profesionalService: ProfesionalService,
        public sanitizer: DomSanitizer,
        private plexVisualizador: PlexVisualizadorService
    ) {
    }

    public verPerfiles = this.auth.check('usuarios:perfiles') || this.auth.check('global:usuarios:perfiles');
    public readOnly = !this.auth.check('usuarios:write');

    refresh = new BehaviorSubject({});
    refresh$ = this.refresh.asObservable();

    private _search = new BehaviorSubject(null);
    private search$ = this._search.asObservable().pipe(
        debounceTime(300),
        distinctUntilChanged()
    );

    get search() {
        return this._search.getValue();
    }

    set search(value) {
        this._search.next(value);
    }

    public pacienteRestringido: IPacienteRestringido[] = [];
    public restringidos: IPaciente[] = [];
    public usuarios$;
    public loading = false;
    public resultadoBusqueda = null;
    public showBuscarPaciente = false;
    public showEditarPaciente = false;
    public agregarPaciente = false;
    public userData$;
    public userSelected: any;
    public pacienteSelected: any;
    public observaciones: string;
    public errorExt = false;
    public documento = {
        archivos: [],
        tipo: null,
        fecha: null
    };
    public archivos = [];
    public files = [];
    private filesAdd = [];
    private filesDel = [];
    private invalid = true;
    private columns = [
        { key: 'usuario', label: 'Usuario', sorteable: false },
        { key: 'apellido', label: 'Apellido', sorteable: false },
        { key: 'nombre', label: 'Nombre/s', sorteable: false }
    ];
    private profesional: any;
    private foto: any;
    private tieneFoto = false;

    indexEdit = -1;
    extensions = ['pdf', 'doc', 'docx', 'bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw'];
    IMAGENES_EXT = ['bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw'];
    fileToken: string = null;

    ngOnInit() {

        this.usuarios$ = this.permisosService.organizaciones().pipe(
            switchMap(() => {
                this.loading = true;
                return merge(
                    this.refresh$,
                    this.search$.pipe(asObject('search', t => t.length ? t : null))
                );
            }),
            mergeObject(),
            tap((params) => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: params,
                    queryParamsHandling: 'merge',
                    replaceUrl: true
                });
            }),
            switchMap((query: any) => {
                if (query.search?.length > 2) {
                    query = { ...query };
                    query.search = '^' + query.search;
                    return this.usuariosService.find({ ...query, fields: '-password -permisosGlobales', limit: 50 });
                }
                return of([]);
            }),
            map(response => {
                this.userSelected = null;
                this.loading = false;
                return response;
            }),
            cache()
        );

        this.cd.detectChanges();

        this.adjuntosService.generateToken().subscribe((data: any) => {
            this.fileToken = data.token;
        });
    }

    select(user) {
        this.userSelected = user;
        this.restringidos = [];
        this.pacienteRestringido = [];
        this.showEditarPaciente = false;
        if (this.userSelected.pacienteRestringido) {
            for (let i = 0; i < this.userSelected.pacienteRestringido.length; i++) {
                this.pacienteRestringido.push(this.userSelected.pacienteRestringido[i]);
                this.addPaciente(this.userSelected.pacienteRestringido[i].idPaciente);
            }
        }
        const params = { documento: user.documento, habilitado: true };
        this.profesionalService.get(params).subscribe((profesional) => {
            if (profesional) {
                this.profesional = profesional[0];
                this.profesionalService.getFoto({ id: this.auth.profesional }).subscribe(resp => {
                    if (resp) {
                        this.foto = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + resp);
                        this.tieneFoto = true;
                    }
                });
            }
        });
    }

    addPaciente(id) {
        this.pacienteService.getById(id).subscribe(
            paciente => {
                this.restringidos.push(paciente);
            }
        );
    }

    selected(user) {
        return this.userSelected ? this.userSelected === user : false;
    }

    searchStart() {
        this.loading = true;
    }

    searchEnd(pacientes: IPaciente[], scan: string) {
        this.loading = false;
        const escaneado = scan?.length > 0;
        this.pacienteCache.setScanCode(scan);
        if (escaneado && pacientes.length === 1 && pacientes[0].id) {
            this.onSelect(pacientes[0]);
        } else if (escaneado && pacientes.length === 1 && (!pacientes[0].id || (pacientes[0].estado === 'temporal' && pacientes[0].scan))) {
            this.pacienteCache.setPaciente(pacientes[0]);
            this.pacienteCache.setScanCode(scan);
            this.router.navigate(['/apps/mpi/paciente/con-dni/sobreturno']); // abre paciente-cru
        } else {
            this.resultadoBusqueda = pacientes;
        }
    }

    onSearchClear() {
        this.resultadoBusqueda = null;
    }

    @Unsubscribe()
    onSelect(paciente: IPaciente) {
        let select = true;
        if (paciente && paciente.id) {
            this.resultadoBusqueda = null;
            this.pacienteService.checkFallecido(paciente);
            for (const restr of this.restringidos) {
                if (restr.id === paciente.id) {
                    select = false;
                    this.plex.info('warning', 'Paciente ya se encuentra en la lista de restringidos');
                }
            }
            if (select) {
                this.pacienteSelected = paciente;
                this.showBuscarPaciente = false;
                this.agregarPaciente = true;
                this.files = this.getArchivos();
                this.filesAdd = [];
                this.filesDel = [];
            }
        } else {
            this.plex.info('warning', 'Paciente no encontrado', '¡Error!');
        }
    }

    guardar(paciente) {
        const pteRestr: IPacienteRestringido = {
            idPaciente: paciente.id,
            observaciones: this.observaciones,
            createdBy: { usuario: this.userSelected.usuario },
            createdAt: moment().toDate(),
            archivos: this.archivos
        };
        if (this.indexEdit > -1) {
            this.pacienteRestringido[this.indexEdit] = pteRestr;
        } else {
            this.pacienteRestringido.push(pteRestr);
        }
        this.userSelected.pacienteRestringido = this.pacienteRestringido;
        this.usuariosService.update(this.userSelected.usuario, this.userSelected).subscribe(() => {
            if (this.indexEdit > -1) {
                this.plex.toast('success', 'El paciente se editó correctamente');
            } else {
                this.addPaciente(paciente.id);
                this.plex.toast('success', 'El paciente se agregó correctamente');
            }
            this.eliminarQuitados();
            this.cancelar();
        });
    }

    eliminarQuitados() {
        if (this.filesDel) {
            this.filesDel.forEach(archivo => {
                this.adjuntosService.delete(archivo.id).subscribe((data: any) => { });
            });
        }
    }

    eliminarAgregados() {
        if (this.filesAdd) {
            this.filesAdd.forEach(archivo => {
                this.adjuntosService.delete(archivo.id).subscribe((data: any) => { });
                const i = this.archivos.findIndex(x => x.id === archivo.id);
                this.archivos.splice(i);
            });
        }
    }

    checkValid() {
        if (!this.documento.tipo) {
            this.invalid = true;
            return;
        }
        if (this.archivos.length === 0) {
            this.invalid = true;
            return;
        }
        this.invalid = false;
    }

    editar(index) {
        this.showEditarPaciente = true;
        this.pacienteSelected = this.restringidos[index];
        this.indexEdit = this.pacienteRestringido.findIndex(obj => obj.idPaciente === this.pacienteSelected.id);
        this.observaciones = this.pacienteRestringido[this.indexEdit].observaciones;
        this.archivos = this.pacienteRestringido[this.indexEdit].archivos ? this.pacienteRestringido[this.indexEdit].archivos : [];
        this.files = this.getArchivos();
        this.filesAdd = [];
        this.filesDel = [];
    }

    eliminar(index) {
        this.plex.confirm('Elimina paciente de la restricción ?').then((resultado) => {
            if (resultado) {
                this.pacienteRestringido.splice(index, 1);
                this.userSelected.pacienteRestringido = this.pacienteRestringido;
                this.usuariosService.update(this.userSelected.usuario, this.userSelected).subscribe(() => {
                    this.filesDel = this.getArchivos();
                    this.eliminarQuitados();
                    this.showBuscarPaciente = false;
                    this.plex.toast('success', 'El paciente se eliminó correctamente');
                });
                this.restringidos.splice(index, 1);
            }
        });
    }

    buscarPaciente() {
        this.showBuscarPaciente = !this.showBuscarPaciente;
        this.pacienteSelected = null;
        this.observaciones = null;
        this.archivos = [];
    }

    cerrarSideBar() {
        this.userSelected = null;
        this.cancelar();
    }

    onCancelar() {
        this.cancelar();
        this.eliminarAgregados();
        this.backFilesDel();
    }

    private cancelar() {
        this.resultadoBusqueda = null;
        this.showBuscarPaciente = false;
        this.showEditarPaciente = false;
        this.agregarPaciente = false;
        this.pacienteSelected = null;
        this.indexEdit = -1;
    }

    backFilesDel() {
        this.filesDel.forEach(archivo => {
            this.archivos.push(archivo);
        });
    };

    changeListener($event): void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        const ext = this.fileExtension(inputValue.value);
        this.errorExt = false;
        if (!this.extensions.find((item) => item === ext.toLowerCase())) {
            this.uploadElement.nativeElement.value = '';
            this.errorExt = true;
            this.plex.toast('danger', 'Tipo de archivo incorrecto');
            return;
        }
        const file: File = inputValue.files[0];
        const myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            this.uploadElement.nativeElement.value = '';
            const metadata = {};
            this.adjuntosService.upload(myReader.result, metadata).subscribe((data) => {
                this.archivos.push({
                    ext,
                    id: data._id
                });
                this.filesAdd.push(this.archivos[this.archivos.length - 1]);
                this.files = this.getArchivos();
            });
        };
        myReader.readAsDataURL(file);
    }

    fileExtension(file) {
        if (file.lastIndexOf('.') >= 0) {
            return file.slice((file.lastIndexOf('.') + 1));
        } else {
            return '';
        }
    }

    getArchivos() {
        if (this.archivos) {
            return this.archivos.map((doc: any) => {
                doc = { ...doc };
                doc.url = this.createUrl(doc);
                doc.isImage = this.esImagen(doc.ext);
                return doc;
            });
        } else {
            return [];
        }
    }

    createUrl(doc) {
        if (doc.id) {
            return this.adjuntosService.getUrlArchivo(doc.id, this.fileToken);
        }
    }

    removeArchivo(archivo) {
        const index = this.files.findIndex(a => a.id === archivo.id);
        this.filesDel.push(this.files[index]);
        this.files.splice(index, 1);
        this.archivos.splice(index, 1);
    }

    esImagen(extension: string) {
        return !!this.IMAGENES_EXT.find(x => x === extension.toLowerCase());
    }

    openUrl(archivo) {
        window.open(archivo.url);
    }

    open(index: number) {
        this.plexVisualizador.open(this.files, index);
    }

}
