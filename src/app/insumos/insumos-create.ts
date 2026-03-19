import { Component, OnInit } from '@angular/core';
import { InsumosService } from './services/insumos.service';
import { Plex } from '@andes/plex';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IInsumo } from './interfaces/IInsumo';

@Component({
    selector: 'app-insumos-create',
    templateUrl: './insumos-create.html',
    styleUrls: ['./insumos.component.css']
})
export class InsumosCreateComponent implements OnInit {

    public insumoEdit: IInsumo = null;
    public title = 'Nuevo Insumo';

    public tipo = null;
    public opciones = [
        { id: 'nutricion', nombre: 'Nutrición' },
        { id: 'dispositivo', nombre: 'Dispositivo' },
        { id: 'magistral', nombre: 'Magistral' }
    ];

    public fuentes = [
        { id: 'SIFAHO', nombre: 'SIFAHO' },
        { id: 'SNOMED', nombre: 'SNOMED' }
    ];

    public nombre = null;
    public check = false;
    public observaciones = null;
    public codigos: any[] = [{ fuente: null, valor: '' }];


    constructor(
        private insumosService: InsumosService,
        private plex: Plex,
        private location: Location,
        private router: Router
    ) {
        const state = this.router.getCurrentNavigation()?.extras?.state as { insumo?: IInsumo };
        if (state && state.insumo) {
            this.insumoEdit = state.insumo;
            this.title = 'Edición Insumo';
            this.nombre = this.insumoEdit.nombre;
            this.codigos = this.insumoEdit.codigo.map(c => ({
                fuente: this.fuentes.find(f => f.id === c.fuente),
                valor: c.valor
            }));
            this.tipo = this.opciones.find(o => o.id === this.insumoEdit.tipo);
            this.check = this.insumoEdit.requiereEspecificacion;
            this.observaciones = this.insumoEdit.observaciones;
        }
    }

    ngOnInit(): void {
    }

    get puedeAgregarCodigo(): boolean {
        return this.codigos.length < 2 && this.codigos.every(cod => cod.fuente && cod.valor);
    }

    volver() {
        this.location.back();
    }

    addCodigo() {
        if (this.codigos.length < this.fuentes.length) {
            this.codigos.push({ fuente: null, valor: '' });
        }
    }

    removeCodigo(index) {
        if (this.codigos.length > 1) {
            this.codigos.splice(index, 1);
        }
    }

    save() {
        const fuentesSeleccionadas = this.codigos.map(c => c.fuente?.id).filter(id => !!id);
        const fuentesUnicas = new Set(fuentesSeleccionadas);

        if (this.nombre && this.tipo && this.codigos.every(c => c.fuente && c.valor)) {
            if (fuentesSeleccionadas.length !== fuentesUnicas.size) {
                this.plex.info('warning', 'No se permiten múltiples códigos para la misma fuente');
                return;
            }

            let insumo: IInsumo;

            const codigosMapped = this.codigos.map(c => ({
                fuente: c.fuente.id,
                valor: c.valor
            }));

            if (this.insumoEdit) {
                insumo = {
                    ...this.insumoEdit,
                    nombre: this.nombre,
                    codigo: codigosMapped,
                    tipo: this.tipo.id,
                    requiereEspecificacion: this.check,
                    observaciones: this.observaciones
                };
            } else {
                insumo = {
                    nombre: this.nombre,
                    codigo: codigosMapped,
                    tipo: this.tipo.id,
                    estado: 'activo',
                    requiereEspecificacion: this.check,
                    observaciones: this.observaciones
                };
            }

            this.insumosService.save(insumo).subscribe(() => {
                this.plex.info('success', this.insumoEdit ? 'Insumo editado correctamente' : 'Insumo creado correctamente');
                this.volver();
            });
        } else {
            this.plex.info('warning', 'Debe completar los campos obligatorios y al menos un código válido');
        }
    }

}
