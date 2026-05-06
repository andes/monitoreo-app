import { Component, OnInit } from '@angular/core';
import { InsumosService } from './services/insumos.service';
import { Router } from '@angular/router';
import { IInsumo } from './interfaces/IInsumo';
import { Observable } from 'rxjs';
import { Plex } from '@andes/plex';

@Component({
    selector: 'app-insumos',
    templateUrl: './insumos.component.html',
    styleUrls: ['./insumos.component.css']
})
export class InsumosComponent implements OnInit {

    columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'codigo', label: 'Códigos' },
        { key: 'estado', label: 'Estado' },
    ];

    public insumos$: Observable<IInsumo[]>;
    public selectedInsumo: IInsumo = null;

    public tipo = null;
    public opciones = [
        { id: 'nutricion', nombre: 'Nutrición' },
        { id: 'dispositivo', nombre: 'Dispositivo' },
        { id: 'magistral', nombre: 'Magistral' }
    ];

    public estado = null;
    public estados = [
        { id: 'activo', nombre: 'Activo' },
        { id: 'inactivo', nombre: 'Inactivo' }
    ];

    public busqueda = null;
    public codigo = null;
    constructor(
        private insumosService: InsumosService,
        private router: Router,
        private plex: Plex
    ) { }
    ngOnInit(): void {
        this.buscar();
    }

    buscar() {
        const query: any = {
            tipo: this.tipo?.id,
            estado: this.estado?.id
        };

        if (this.busqueda) {
            query.nombre = '^' + this.busqueda;
        }

        if (this.codigo) {
            query['codigo.valor'] = '^' + this.codigo;
        }

        this.insumos$ = this.insumosService.search(query);
    }

    seleccionar(insumo: IInsumo) {
        this.selectedInsumo = insumo;
    }

    editar(insumo: IInsumo) {
        this.router.navigate(['/insumos-create'], { state: { insumo } });
    }

    inactivar(insumo: IInsumo) {
        const patchInsumo = {
            ...insumo,
            estado: 'inactivo' as 'inactivo'
        };
        this.insumosService.save(patchInsumo).subscribe(() => {
            this.plex.info('success', 'Insumo inactivado correctamente');
            if (this.selectedInsumo?.id === insumo.id) {
                this.selectedInsumo.estado = 'inactivo';
            }
            this.buscar();
        });
    }

    activar(insumo: IInsumo) {
        const patchInsumo = {
            ...insumo,
            estado: 'activo' as 'activo'
        };
        this.insumosService.save(patchInsumo).subscribe(() => {
            this.plex.info('success', 'Insumo activado correctamente');
            if (this.selectedInsumo?.id === insumo.id) {
                this.selectedInsumo.estado = 'activo';
            }
            this.buscar();
        });
    }

    cerrar() {
        this.selectedInsumo = null;
    }

    nuevo() {
        this.router.navigate(['/insumos-create']);
    }

    volver() {
        this.router.navigate(['/home']);
    }

    codigoInsumo(codigos) {
        const codigosStr = codigos.map(c => `${c.fuente}: ${c.valor}`).join(', ');
        return codigosStr;
    }
}
