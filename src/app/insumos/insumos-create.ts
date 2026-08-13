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

    public unidadMedida = null;

    public opcionesUnidadMedida = [
        { id: 'ml', nombre: 'ml (mililitros)' },
        { id: 'grs', nombre: 'gr (gramos)' },
        { id: 'cápsulas', nombre: 'cápsulas' }
    ];

    public fuentes = [
        { id: 'SIFAHO', nombre: 'SIFAHO' },
        { id: 'SNOMED', nombre: 'SNOMED' }
    ];

    public nombre = null;
    public check = false;
    public checkUnidadMedida = false;
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

            this.unidadMedida = this.opcionesUnidadMedida.find(
                o => o.id === this.insumoEdit.unidadMedida
            );

            this.checkUnidadMedida = !!this.insumoEdit.unidadMedida;

            this.check = this.insumoEdit.requiereEspecificacion;
            this.observaciones = this.insumoEdit.observaciones;
        }
    }

    ngOnInit(): void {
    }

    get puedeAgregarCodigo(): boolean {
        const noDuplicados = this.codigos.every((cod, i) =>
            this.codigos.findIndex(c => c.fuente?.id === cod.fuente?.id && c.valor === cod.valor) === i
        );
        return this.codigos.every(cod => cod.fuente && cod.valor) && noDuplicados;
    }

    volver() {
        this.location.back();
    }

    addCodigo() {
        this.codigos.push({ fuente: null, valor: '' });
    }

    removeCodigo(index) {
        if (this.codigos.length > 1) {
            this.codigos.splice(index, 1);
        }
    }

    save() {

        if (this.nombre && this.tipo && this.codigos.every(c => c.fuente && c.valor)) {

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
                    unidadMedida: this.unidadMedida?.id ?? null,
                    observaciones: this.observaciones
                };
            } else {
                insumo = {
                    nombre: this.nombre,
                    codigo: codigosMapped,
                    tipo: this.tipo.id,
                    estado: 'activo',
                    unidadMedida: this.unidadMedida?.id ?? null,
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
