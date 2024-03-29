import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { INovedad } from '../interfaces/INovedad.interface';
import { NovedadesService } from '../services/novedades.service';
import { AdjuntosService } from '../services/adjuntos.service';
import { Router } from '@angular/router';
import { IModulo } from 'src/app/modulos/interfaces/IModulo.interface';
import { ModulosService } from 'src/app/modulos/services/modulos.service';

const limit = 10;
const maxMain = 12;
const sizeSidebar = 5;
@Component({
    selector: 'app-novedades',
    templateUrl: './novedades.component.html',
    styleUrls: ['./novedades.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NovedadesComponent implements OnInit {
    @ViewChild('upload', { static: true }) uploadElement: ElementRef; // uploadElement

    public main = maxMain; // tamaño vista pantalla

    // scroll infinito
    private skip;
    public finScroll = false;

    // títulos

    public regNov: INovedad;
    public listRegNovedades: INovedad[];
    public titulo: string;
    public palabra: string;
    public modulo: IModulo;
    public titleABM: string;
    public listModulos: IModulo[] = [];
    private modoEdit: boolean;

    // Adjuntar Imagenes
    errorExt = false;
    waiting = false;
    fileToken: string = null;
    timeout = null;
    indice;
    documentos = [];
    extensions = ['bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw'];

    constructor(
        public plex: Plex,
        private regNovService: NovedadesService,
        private moduloService: ModulosService,
        public adjuntosService: AdjuntosService,
        private router: Router,
        private auth: Auth) {
        this.regNov = null;
        this.listRegNovedades = [];
        this.modoEdit = false;
    }

    ngOnInit() {
        if (!this.auth.check('monitoreo:novedades')) {
            this.router.navigate(['./inicio']);
        }

        this.loadData(false);
        this.skip = 0;
        this.moduloService.search({}).subscribe(
            modulos => {
                this.listModulos = modulos;
            },
            (err) => {
                this.listModulos = [];
                this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde',
                    'Error al obtener Novedades');
            }
        );
        this.adjuntosService.generateToken().subscribe((data: any) => {
            this.fileToken = data.token;
        });
        this.loadRegNov();
    }

    nuevo() {
        this.abrirSidebar('Registar Novedad');
        this.loadRegNov();
    }

    cerrarSidebar() {
        this.main = maxMain;
        this.loadRegNov();
    }

    abrirSidebar(title) {
        this.main = maxMain - sizeSidebar;
        this.titleABM = title;
    }

    loadRegNov() {
        this.modoEdit = false;
        this.regNov = {
            titulo: ' ',
            palabra: ' ',
            fecha: new Date(),
            descripcion: '',
            imagenes: [],
            modulo: null,
            activa: true
        };
    }

    verRegistro(nov: INovedad = null) {
        this.abrirSidebar('Editar Novedad');
        if (nov) {
            this.regNov = Object.assign({}, nov);
        }
        this.modoEdit = true;
    }

    creaModificaNovedad() {
        if (this.modoEdit) { // editar novedad;
            this.regNovService.update(this.regNov._id, this.regNov).subscribe(
                () => {
                    this.loadData(false);
                    this.plex.toast('success', 'Los datos se editaron correctamente');
                },
                (err) => {
                    this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde',
                        'Error al obtener Novedades');
                }
            );
        } else { // crear novedad

            this.regNovService.create(this.regNov).subscribe(
                () => {
                    this.loadData(false);
                    this.plex.toast('success', 'Los datos se guardaron correctamente');
                },
                (err) => {
                    this.plex.info('warning', 'En este momento no podemos procesar su pedido, intentelo más tarde',
                        'Error al obtener Novedades');
                }
            );
        }
        this.cerrarSidebar();
    }

    loadData(concatenar: boolean = false) {
        this.main = maxMain;
        if (!concatenar) { this.skip = 0; }

        const params: any = {
            limit,
            skip: this.skip
        };
        if (this.titulo) {
            params.titulo = '^' + this.titulo;
        }
        if (this.palabra) {
            params.palabra = '^' + this.palabra;
        }
        if (this.modulo) {
            params.modulos = this.modulo._id;
        }
        this.regNovService.search(params).subscribe(
            registros => {
                if (concatenar) { // scroll infinito
                    if (registros.length > 0) {
                        this.listRegNovedades = this.listRegNovedades.concat(registros);
                        this.skip += limit;
                    }
                    this.finScroll = !(registros.length > 0);
                } else {
                    this.listRegNovedades = registros;
                    this.skip += limit;
                    this.finScroll = false;
                }
            },
            (err) => {
                this.listRegNovedades = [];
                this.skip = 0;
                this.plex.info('warning', err, 'Error al obtener Novedades');
            }
        );
    }

    // MÉTODOS PARA CARGAR, CAMBIAR, BORRAR Y VER LAS IMAGENES

    changeListener($event): void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        const file: File = inputValue.files[0];
        const myReader: FileReader = new FileReader();
        const ext = this.fileExtension(inputValue.value); // obtenemos la extensión de archivo
        this.errorExt = false;
        if (!this.extensions.find((item) => item === ext.toLowerCase())) {
            this.uploadElement.nativeElement.value = '';
            this.errorExt = true;
            this.plex.toast('danger', 'Tipo de archivo incorrecto');
            return;
        }
        if (file.size > 5242880) {
            this.plex.toast('danger', 'El tamaño de la imágen supera el máximo permitido de 5MB');
            return;
        }

        myReader.onloadend = (e) => {
            this.uploadElement.nativeElement.value = '';
            const metadata = {};
            this.adjuntosService.upload(myReader.result, metadata).subscribe((data) => {
                this.regNov.imagenes.push({
                    ext,
                    id: data._id
                });
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

    cancelarAdjunto() {
        clearTimeout(this.timeout);
        this.waiting = false;
    }

    imageRemoved($event) {
        const index = this.regNov.imagenes.indexOf($event);
        this.regNov.imagenes.splice(index, 1);
    }

    createUrl(doc) {
        if (doc.id) {
            return this.regNovService.getUrlImage(doc.id, this.fileToken);
        }
    }

    getFotos() {
        if (this.regNov && this.regNov.imagenes) {
            return this.regNov.imagenes.map((doc: any) => {
                doc = { ...doc };
                doc.url = this.createUrl(doc);
                return doc;
            });

        } else {
            return [];
        }
    }
}
