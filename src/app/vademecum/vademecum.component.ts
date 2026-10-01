import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plex } from '@andes/plex';
import { VademecumService } from './services/vademecum.service';
import { IVademecumEntry } from './interfaces/IVademecum';

@Component({
    selector: 'app-vademecum',
    templateUrl: './vademecum.component.html',
    styleUrls: ['./vademecum.component.scss']
})
export class VademecumComponent implements OnInit {
    public searchTerm = '';
    public medicamentos: IVademecumEntry[] = [];
    public selectedItem: IVademecumEntry = null;
    public atributos: Array<{ label: string; key: string; value: string }> = [];
    public loading = false;
    public searched = false;

    public columns = [
        { key: 'nombre', label: 'Nombre Comercial / Presentación' },
        { key: 'droga', label: 'Droga (Genérico)' },
        { key: 'accion', label: 'Acción Terapéutica' },
        { key: 'precio', label: 'Precio' },
        { key: 'estado', label: 'Estado' }
    ];

    constructor(
        private vademecumService: VademecumService,
        private router: Router,
        private plex: Plex
    ) { }

    ngOnInit(): void {
        this.plex.updateTitle('ANDES | Vademécum');
    }

    public buscar(): void {
        if (!this.searchTerm || !this.searchTerm.trim()) {
            this.medicamentos = [];
            this.selectedItem = null;
            this.searched = false;
            return;
        }

        this.loading = true;
        this.searched = true;
        this.vademecumService.searchMedications({ q: this.searchTerm.trim(), limit: 50 }).subscribe(
            (data: IVademecumEntry[]) => {
                this.medicamentos = data || [];
                this.loading = false;
            },
            () => {
                this.medicamentos = [];
                this.loading = false;
                this.plex.toast('danger', 'Error al consultar el vademécum');
            }
        );
    }

    public seleccionar(item: IVademecumEntry): void {
        this.selectedItem = item;
        this.atributos = this.buildAtributos(item);

        if (item.id) {
            this.vademecumService.getMedicationById(item.id).subscribe((detail) => {
                if (detail && this.selectedItem && this.selectedItem.id === item.id) {
                    this.selectedItem = { ...this.selectedItem, ...detail };
                    this.atributos = this.buildAtributos(this.selectedItem);
                }
            });
        }
    }

    public cerrar(): void {
        this.selectedItem = null;
        this.atributos = [];
    }

    public volver(): void {
        this.router.navigate(['/home']);
    }

    private buildAtributos(item: IVademecumEntry): Array<{ label: string; key: string; value: string }> {
        const booleanFormat = (val: any) => val === 'S' ? 'Sí' : (val === 'N' ? 'No' : (val ? String(val) : '—'));
        const arrayFormat = (val: any) => Array.isArray(val) && val.length ? val.join(', ') : '—';
        const jsonFormat = (val: any) => {
            if (!val) { return '—'; }
            if (Array.isArray(val) && !val.length) { return '—'; }
            if (typeof val === 'object' && !Object.keys(val).length) { return '—'; }
            return typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
        };

        const mapDefinitions: Array<{ key: string; label: string; format?: (v: any) => string }> = [
            { key: 'id', label: 'ID (Alfabeta)' },
            { key: 'nombre', label: 'Nombre Comercial' },
            { key: 'presentacion', label: 'Presentación' },
            { key: 'estado', label: 'Estado', format: (v) => v === 'A' || v === 'V' ? 'Activo / Vigente' : (v === 'I' ? 'Inactivo' : (v || '—')) },
            { key: 'droga_descrip', label: 'Droga (Genérico)', format: (v) => v ? (item.droga ? `${v} (ID: ${item.droga})` : v) : (item.droga ? String(item.droga) : '—') },
            { key: 'accion_descrip', label: 'Acción Terapéutica', format: (v) => v ? (item.accion ? `${v} (ID: ${item.accion})` : v) : (item.accion ? String(item.accion) : '—') },
            { key: 'precio', label: 'Precio', format: (v) => (v !== undefined && v !== null && v !== 0) ? `$${v}` : (v === 0 ? '$0' : '—') },
            { key: 'vigencia', label: 'Vigencia de Precio' },
            { key: 'potencia', label: 'Potencia' },
            { key: 'unidadPotencia', label: 'Unidad de Potencia' },
            { key: 'unidades', label: 'Cantidad de Unidades' },
            { key: 'unidadUnidades', label: 'Unidad de las Unidades' },
            { key: 'forma', label: 'Forma Farmacéutica (ID)' },
            { key: 'via', label: 'Vía de Administración (ID)' },
            { key: 'laboratorio', label: 'Laboratorio (ID)' },
            { key: 'troquel', label: 'Número de Troquel' },
            { key: 'codigoDeBarras', label: 'Códigos de Barra', format: arrayFormat },
            { key: 'gtins', label: 'GTINs', format: arrayFormat },
            { key: 'atcs', label: 'Códigos ATC', format: arrayFormat },
            { key: 'heladera', label: 'Requiere Heladera', format: booleanFormat },
            { key: 'celiacos', label: 'Apto Celíacos', format: booleanFormat },
            { key: 'importado', label: 'Medicamento Importado', format: booleanFormat },
            { key: 'iva', label: 'IVA', format: (v) => v ? `${v}%` : '—' },
            { key: 'gravamen', label: 'Gravamen' },
            { key: 'tipoDeVenta', label: 'Tipo de Venta (ID)' },
            { key: 'controlSaludPublica', label: 'Control Salud Pública' },
            { key: 'tamanio', label: 'Tamaño' },
            { key: 'snomed', label: 'Código SNOMED' },
            { key: 'prospecto', label: 'ID Prospecto' },
            { key: 'fecha_act', label: 'Fecha de Actualización' },
            { key: 'ndrogas', label: 'Monodrogas (ndrogas)', format: jsonFormat },
            { key: 'cobs', label: 'Coberturas (cobs)', format: jsonFormat }
        ];

        const processedKeys = new Set<string>();
        const list: Array<{ label: string; key: string; value: string }> = [];

        for (const def of mapDefinitions) {
            processedKeys.add(def.key);
            const rawVal = item[def.key];
            const displayVal = def.format ? def.format(rawVal) : (rawVal !== undefined && rawVal !== null && rawVal !== '' ? String(rawVal) : '—');
            list.push({ label: def.label, key: def.key, value: displayVal });
        }

        for (const [k, v] of Object.entries(item)) {
            if (!processedKeys.has(k) && k !== 'droga' && k !== 'accion' && k !== 'search_text') {
                list.push({
                    label: k,
                    key: k,
                    value: jsonFormat(v)
                });
            }
        }

        return list;
    }
}
