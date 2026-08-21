import { Component, OnInit, OnChanges, ChangeDetectorRef, ElementRef, ViewChild, SimpleChange } from '@angular/core';
import { Plex } from '@andes/plex';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { UsuariosHttp } from '../services/usuarios.service';
import { Unsubscribe } from '@andes/shared';
import { Auth } from '@andes/auth';
import { IPaciente, IPacienteRestringido } from '../interfaces/IPaciente';
import { PacienteService } from '../services/paciente.service';
import { AdjuntosService } from '../services/adjuntos.service';
import { ProfesionalService } from '../services/profesional.service';
import { PlexVisualizadorService } from '@andes/plex';
import { IProfesional } from '../interfaces/IProfesional';

const limit = 50;

@Component({
    selector: 'app-restriccion-huds',
    templateUrl: 'restriccion-huds.html',
})

export class restriccionHudsComponent implements OnInit, OnChanges {

    @ViewChild('upload', { static: false }) uploadElement: ElementRef;

    constructor(
        public usuariosService: UsuariosHttp,
        public plex: Plex,
        private auth: Auth,
        private cd: ChangeDetectorRef,
        public pacienteService: PacienteService,
        public adjuntosService: AdjuntosService,
        public profesionalService: ProfesionalService,
        private plexVisualizador: PlexVisualizadorService
    ) {
    }

    public readOnly = !this.auth.check('usuarios:write');

    private _search = new BehaviorSubject(null);
    private search$ = this._search.asObservable().pipe(
        debounceTime(300),
        distinctUntilChanged()
    );

    get search() {
        return this._search.getValue();
    }

    set search(value) {
        this.loading = true;
        this._search.next(value);
    }

    public pacienteRestringido: IPacienteRestringido[] = [];
    public restringidos: IPaciente[] = [];
    public usuarios = [];
    private skip = 0;
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
    public archivos = [];
    public files = [];
    private filesAdd = [];
    private filesDel = [];
    public editable;
    public email;
    public columns = [
        { key: 'usuario', label: 'Usuario', sorteable: false },
        { key: 'apellido', label: 'Apellido', sorteable: false },
        { key: 'nombre', label: 'Nombre/s', sorteable: false }
    ];
    public profesional: IProfesional;

    indexEdit = -1;
    extensions = ['pdf', 'doc', 'docx', 'bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw'];
    IMAGENES_EXT = ['bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw'];
    fileToken: string = null;

    ngOnInit() {
        this.search$.subscribe(() => this.loadUsuarios(false));

        this.cd.detectChanges();

        this.adjuntosService.generateToken().subscribe((data: any) => {
            this.fileToken = data.token;
        });
    }

    loadUsuarios(concatenar: boolean = false) {
        if (!concatenar) { this.skip = 0; }

        if (!this.search) {
            this.usuarios = [];
            this.loading = false;
            this.userSelected = null;
            return;
        }

        this.loading = true;
        const query: any = {
            limit,
            skip: this.skip,
            fields: '-password -permisosGlobales',
            search: '^' + this.search
        };
        this.usuariosService.find(query).subscribe(
            (usuarios: any[]) => {
                this.loading = false;
                this.userSelected = null;
                if (concatenar) {
                    if (usuarios.length > 0) {
                        this.usuarios = this.usuarios.concat(usuarios);
                        this.skip += limit;
                    }
                } else {
                    this.usuarios = usuarios;
                    this.skip += limit;
                }
            },
            (err) => {
                this.loading = false;
                this.usuarios = [];
                this.skip = 0;
            }
        );
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        this.getProfesional(this.userSelected.documento).subscribe((profesional) => {
            const permission = this.auth.getPermissions('usuarios:?');
            const profesionalHabilitado = profesional.find(prof => prof.habilitado === true);
            this.profesional = profesionalHabilitado || profesional[0];
            this.editable = (permission.includes('cuenta') || permission.includes('*')) && !!profesional[0]?.id;
        });

        this.email = this.userSelected.email;
    }

    getProfesional(documento) {
        return this.profesionalService.get({
            documento,
            fields: 'id habilitado documento nombre apellido profesionalMatriculado formacionGrado matriculaExterna profesionExterna'
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
        const params = { documento: user.documento };
        this.profesional = null;
        this.profesionalService.get(params).subscribe((profesional) => {
            if (profesional && profesional.length) {
                this.profesional = profesional[0];
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

    searchEnd(pacientes: IPaciente[]) {
        this.loading = false;
        this.resultadoBusqueda = pacientes;
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
            archivos: this.archivos.map(archivo => ({ id: archivo.id, ext: archivo.ext }))
        };
        if (this.indexEdit > -1) {
            const existente = this.pacienteRestringido[this.indexEdit];
            this.pacienteRestringido[this.indexEdit] = { ...existente, ...pteRestr };
        } else {
            this.pacienteRestringido.push(pteRestr);
        }
        this.guardarLista(paciente);
    }

    guardarLista(paciente) {
        this.usuariosService.updatePacienteRestringido(this.userSelected.usuario, this.pacienteRestringido).subscribe(() => {
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
        const restringido = this.pacienteRestringido[index];
        this.plex.confirm('¿Desea eliminar el paciente de la restricción?').then((resultado) => {
            if (resultado) {
                this.filesDel = restringido?.archivos ? restringido.archivos : [];
                this.pacienteRestringido.splice(index, 1);
                this.usuariosService.updatePacienteRestringido(this.userSelected.usuario, this.pacienteRestringido).subscribe(() => {
                    this.eliminarQuitados();
                    this.showBuscarPaciente = false;
                    this.plex.toast('success', 'El paciente se eliminó correctamente.');
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
            this.plex.toast('danger', 'Tipo de archivo inválido. Los tipos de archivos permitidos son: ' + this.extensions.join(', '), 'Error', 5000);
            return;
        }
        const file: File = inputValue.files[0];
        const myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            this.uploadElement.nativeElement.value = '';
            const metadata = {
                idUser: this.userSelected.usuario,
                idPaciente: this.pacienteSelected.id
            };
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
