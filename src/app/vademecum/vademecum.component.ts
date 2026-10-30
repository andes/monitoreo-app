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
    public medicamentosOriginales: IVademecumEntry[] = [];
    public medicamentos: IVademecumEntry[] = [];
    public selectedItem: IVademecumEntry = null;
    public atributos: Array<{ label: string; key: string; value: string }> = [];
    public loading = false;
    public searched = false;
    public showFiltros = true;

    public filtros = {
        droga: '',
        accion: '',
        atc: '',
        gtin: '',
        snomed: '',
        monodrogas: ''
    };

    public columns = [
        { key: 'nombre', label: 'Nombre Comercial / Presentación' },
        { key: 'droga', label: 'Droga (Genérico)' },
        { key: 'accion', label: 'Acción Terapéutica' },
        { key: 'precio', label: 'Precio' },
        { key: 'estado', label: 'Estado' }
    ];

    public get hayFiltrosActivos(): boolean {
        return Boolean(
            (this.filtros.droga && this.filtros.droga.trim()) ||
            (this.filtros.accion && this.filtros.accion.trim()) ||
            (this.filtros.atc && this.filtros.atc.trim()) ||
            (this.filtros.gtin && this.filtros.gtin.trim()) ||
            (this.filtros.snomed && this.filtros.snomed.trim()) ||
            (this.filtros.monodrogas && this.filtros.monodrogas.trim())
        );
    }

    public get tituloResultados(): string {
        if (this.hayFiltrosActivos) {
            return `Resultados (${this.medicamentos.length} de ${this.medicamentosOriginales.length})`;
        }
        return `Resultados (${this.medicamentos.length})`;
    }

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
            this.medicamentosOriginales = [];
            this.medicamentos = [];
            this.selectedItem = null;
            this.searched = false;
            return;
        }

        this.loading = true;
        this.searched = true;
        this.selectedItem = null;
        this.vademecumService.searchMedications({ q: this.searchTerm.trim(), limit: 50 }).subscribe(
            (data: IVademecumEntry[]) => {
                this.medicamentosOriginales = data || [];
                this.aplicarFiltros();
                this.loading = false;
            },
            () => {
                this.medicamentosOriginales = [];
                this.medicamentos = [];
                this.loading = false;
                this.plex.toast('danger', 'Error al consultar el vademécum');
            }
        );
    }

    public aplicarFiltros(): void {
        const filtroDroga = this.normalize(this.filtros.droga);
        const filtroAccion = this.normalize(this.filtros.accion);
        const filtroAtc = this.normalize(this.filtros.atc);
        const filtroGtin = this.normalize(this.filtros.gtin);
        const filtroSnomed = (this.filtros.snomed || '').trim().toLowerCase();
        const filtroMonodrogas = this.normalize(this.filtros.monodrogas);

        this.medicamentos = this.medicamentosOriginales.filter((item) => {
            // 1. Droga (genérico) substring
            if (filtroDroga) {
                const desc = this.normalize(item.droga_descrip);
                const id = item.droga ? String(item.droga) : '';
                if (!desc.includes(filtroDroga) && !id.includes(filtroDroga)) {
                    return false;
                }
            }

            // 2. Acción terapéutica substring
            if (filtroAccion) {
                const desc = this.normalize(item.accion_descrip);
                const id = item.accion ? String(item.accion) : '';
                if (!desc.includes(filtroAccion) && !id.includes(filtroAccion)) {
                    return false;
                }
            }

            // 3. Códigos ATC substring
            if (filtroAtc) {
                let atcs: any = item.atcs;
                if (typeof atcs === 'string') {
                    try { atcs = JSON.parse(atcs); } catch { atcs = [atcs]; }
                }
                const matchAtc = Array.isArray(atcs) && atcs.some(atc => this.normalize(atc).includes(filtroAtc));
                if (!matchAtc) {
                    return false;
                }
            }

            // 4. Códigos GTINs substring
            if (filtroGtin) {
                let gtins: any = item.gtins;
                if (typeof gtins === 'string') {
                    try { gtins = JSON.parse(gtins); } catch { gtins = [gtins]; }
                }
                const matchGtin = Array.isArray(gtins) && gtins.some(gtin => this.normalize(gtin).includes(filtroGtin));
                if (!matchGtin) {
                    return false;
                }
            }

            // 5. Código SNOMED (búsqueda completa)
            if (filtroSnomed) {
                const snomedVal = item.snomed ? String(item.snomed).trim().toLowerCase() : '';
                if (snomedVal !== filtroSnomed) {
                    return false;
                }
            }

            // 6. Monodrogas
            if (filtroMonodrogas) {
                let ndrogas: any = item.ndrogas;
                if (typeof ndrogas === 'string') {
                    try { ndrogas = JSON.parse(ndrogas); } catch { ndrogas = []; }
                }
                const matchNdrogas = Array.isArray(ndrogas) && ndrogas.some(nd => {
                    if (typeof nd === 'object' && nd !== null) {
                        return this.normalize(nd.ndroga).includes(filtroMonodrogas) ||
                               this.normalize(nd.pvalor).includes(filtroMonodrogas) ||
                               this.normalize((nd as any).droga_descrip).includes(filtroMonodrogas) ||
                               this.normalize((nd as any).nombre).includes(filtroMonodrogas);
                    }
                    return this.normalize(nd).includes(filtroMonodrogas);
                });
                if (!matchNdrogas) {
                    return false;
                }
            }

            return true;
        });
    }

    public limpiarFiltros(): void {
        this.filtros = {
            droga: '',
            accion: '',
            atc: '',
            gtin: '',
            snomed: '',
            monodrogas: ''
        };
        this.aplicarFiltros();
    }

    private normalize(val: any): string {
        if (val === undefined || val === null) {
            return '';
        }
        return String(val)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
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
