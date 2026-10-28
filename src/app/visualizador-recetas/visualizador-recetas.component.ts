import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import * as moment from 'moment';
import { PrescripcionesService } from './services/prescripciones.service';
import { PacienteBuscarService } from '../services/paciente-buscar.service';
import { PermisosService } from '../services/permisos.service';

interface IPrescripcion {
    id: string;
    receta: any;
    clave: string;
    nombre: string;
    tipo: string;
    tipoNombre: string;
    estado: string;
    sistema: string;
    fecha: Date;
    fechaReferencia: Date;
    organizacion: string;
    organizacionId: string;
    idRegistro: string;
    prolongado: boolean;
    tiempoTratamiento: string;
    orden: number;
    total: number;
}

interface IGrupoPrescripciones {
    clave: string;
    nombre: string;
    tipoNombre: string;
    tiempoTratamiento: string;
    inicial: IPrescripcion[];
    todas: IPrescripcion[];
}

@Component({
    selector: 'app-visualizador-recetas',
    templateUrl: './visualizador-recetas.component.html',
    styleUrls: ['./visualizador-recetas.component.css']
})
export class VisualizadorRecetasComponent implements OnInit {

    public busquedaPaciente = '';
    // null: no hay búsqueda en curso; []: la búsqueda no encontró pacientes
    public pacientes: any[] = null;
    public buscandoPacientes = false;
    public paciente: any = null;

    public organizaciones: any[] = [];
    public organizacion: any = null;
    public prescripcion: string;
    public filtros: any = {
        fechaDesde: moment().subtract(6, 'months').startOf('day').toDate(),
        fechaHasta: moment().endOf('day').toDate(),
        estado: null
    };

    public estados = [
        { id: 'vigente', nombre: 'Vigente' },
        { id: 'pendiente', nombre: 'Pendiente' },
        { id: 'dispensada', nombre: 'Dispensada' },
        { id: 'vencida', nombre: 'Vencida' },
        { id: 'suspendida', nombre: 'Suspendida' }
    ];

    public tiposPrescripcion = [
        { id: 'medicamento', nombre: 'Medicamentos' },
        { id: 'magistral', nombre: 'Magistrales' },
        { id: 'nutricion', nombre: 'Nutriterápicos' },
        { id: 'dispositivo', nombre: 'Dispositivos médicos' }
    ];
    public sistemas = ['ANDES', 'RECETAR'];
    public tiposSeleccionados: string[] = [];
    public sistemasSeleccionados: string[] = [];

    public grupos: IGrupoPrescripciones[] = [];
    public gruposExpandidos = new Set<string>();
    public seleccionada: IPrescripcion = null;
    public detalle: any = null;
    public descargando = false;

    private prescripciones: IPrescripcion[] = [];
    private colorEstado = {
        vigente: 'success',
        pendiente: 'info',
        dispensada: 'success',
        vencida: 'danger',
        suspendida: 'danger',
        rechazada: 'danger'
    };

    constructor(
        private plex: Plex,
        private prescripcionesService: PrescripcionesService,
        private pacienteBuscar: PacienteBuscarService,
        private permisosService: PermisosService
    ) { }

    ngOnInit() {
        this.permisosService.organizaciones().subscribe(organizaciones => this.organizaciones = organizaciones);
    }

    buscarPaciente() {
        const texto = (this.busquedaPaciente || '').trim();
        const busqueda = texto ? this.pacienteBuscar.search(texto) : null;
        if (!busqueda) {
            this.pacientes = null;
            this.buscandoPacientes = false;
            return;
        }
        this.buscandoPacientes = true;
        busqueda.subscribe(
            (resultado: any) => {
                // Descarta la respuesta si el usuario siguió escribiendo o ya eligió un paciente
                if (texto !== (this.busquedaPaciente || '').trim() || this.paciente) {
                    return;
                }
                this.pacientes = resultado?.pacientes || [];
                this.buscandoPacientes = false;
            },
            () => this.buscandoPacientes = false
        );
    }

    seleccionarPaciente(paciente) {
        // El listado emite null cuando se vuelve a hacer clic sobre el paciente marcado
        if (!paciente || this.paciente) {
            return;
        }
        this.paciente = paciente;
        this.busquedaPaciente = paciente.documento;
        this.pacientes = null;
        this.buscandoPacientes = false;
        this.prescripcionesService.getPrescripciones(paciente.id).subscribe(recetas => {
            // Descarta la respuesta si mientras tanto se cambió de paciente
            if (this.paciente !== paciente) {
                return;
            }
            this.prescripciones = this.prepararPrescripciones(recetas);
            this.filtrar();
        });
    }

    cambiarPaciente() {
        this.busquedaPaciente = '';
        this.pacientes = null;
        this.paciente = null;
        this.prescripciones = [];
        this.grupos = [];
        this.gruposExpandidos.clear();
        this.cerrarDetalle();
    }

    edad(paciente): string {
        return paciente?.fechaNacimiento ? `${moment().diff(paciente.fechaNacimiento, 'years')} años` : '-';
    }

    localidad(paciente): string {
        return paciente?.direccion?.[0]?.ubicacion?.localidad?.nombre || '-';
    }

    financiador(paciente): string {
        return paciente?.financiador?.[0]?.nombre || '-';
    }

    onCambioFechas() {
        const error = this.errorRangoFechas();
        if (error) {
            this.plex.toast('danger', error);
        }
        this.filtrar();
    }

    toggleTipo(tipo: string) {
        this.tiposSeleccionados = this.toggle(this.tiposSeleccionados, tipo);
        this.filtrar();
    }

    toggleSistema(sistema: string) {
        this.sistemasSeleccionados = this.toggle(this.sistemasSeleccionados, sistema);
        this.filtrar();
    }

    filtrar() {
        if (this.errorRangoFechas()) {
            this.grupos = [];
            this.cerrarDetalle();
            return;
        }
        const desde = moment(this.filtros.fechaDesde).startOf('day');
        const hasta = moment(this.filtros.fechaHasta).endOf('day');
        const estado = this.filtros.estado?.id;
        const texto = this.normalizar(this.prescripcion);
        const efector = this.organizacion?.id ? String(this.organizacion.id) : null;

        const filtradas = this.prescripciones.filter(p =>
            moment(p.fechaReferencia).isBetween(desde, hasta, null, '[]')
            && (!estado || p.estado === estado)
            && (!this.tiposSeleccionados.length || this.tiposSeleccionados.includes(p.tipo))
            && (!this.sistemasSeleccionados.length || this.sistemasSeleccionados.includes(p.sistema))
            && (!texto || this.normalizar(p.nombre).includes(texto))
            && (!efector || p.organizacionId === efector)
        );

        this.grupos = this.agrupar(filtradas);
        if (this.seleccionada && !filtradas.includes(this.seleccionada)) {
            this.cerrarDetalle();
        }
    }

    toggleGrupo(grupo: IGrupoPrescripciones) {
        if (this.gruposExpandidos.has(grupo.clave)) {
            this.gruposExpandidos.delete(grupo.clave);
        } else {
            this.gruposExpandidos.add(grupo.clave);
        }
    }

    colorDeEstado(estado: string): string {
        return this.colorEstado[estado] || 'default';
    }

    seleccionar(prescripcion: IPrescripcion) {
        this.seleccionada = prescripcion;
        this.detalle = this.armarDetalle(prescripcion);
    }

    cerrarDetalle() {
        this.seleccionada = null;
        this.detalle = null;
    }

    descargarPdf() {
        if (!this.seleccionada || this.descargando) {
            return;
        }
        this.descargando = true;
        const informe = {
            idPrestacion: this.seleccionada.receta.idPrestacion,
            idRegistro: this.seleccionada.idRegistro,
            recetasIds: [this.seleccionada.id]
        };
        this.prescripcionesService.descargarPdf(informe, this.seleccionada.nombre || 'prescripcion').subscribe(
            () => this.descargando = false,
            () => this.descargando = false
        );
    }

    private prepararPrescripciones(recetas: any[]): IPrescripcion[] {
        const prescripciones = recetas.map(receta => this.aPrescripcion(receta));

        // Las recetas siguientes de un tratamiento prolongado tienen fechas futuras:
        // se filtran por la fecha de la primera receta de la serie para no separarlas del tratamiento
        const inicioSerie = new Map<string, Date>();
        prescripciones.filter(p => p.prolongado).forEach(p => {
            const serie = `${p.clave}|${p.idRegistro}`;
            const inicio = inicioSerie.get(serie);
            if (!inicio || moment(p.fecha).isBefore(inicio)) {
                inicioSerie.set(serie, p.fecha);
            }
        });
        prescripciones.forEach(p => {
            p.fechaReferencia = p.prolongado ? inicioSerie.get(`${p.clave}|${p.idRegistro}`) : p.fecha;
        });
        return prescripciones;
    }

    private aPrescripcion(receta): IPrescripcion {
        const datos = receta.medicamento || receta.insumo || {};
        const tipo = receta.insumo ? receta.insumo.tipo : (receta.medicamento?.esMagistral ? 'magistral' : 'medicamento');
        const nombre = receta.medicamento?.concepto?.term || receta.medicamento?.magistral?.nombre || receta.insumo?.nombre || '';
        const tiempo = datos.tiempoTratamiento;

        return {
            id: receta.id || receta._id,
            receta,
            clave: `${tipo}|${this.normalizar(receta.medicamento?.concepto?.conceptId || nombre)}`,
            nombre,
            tipo,
            tipoNombre: this.tiposPrescripcion.find(t => t.id === tipo)?.nombre || '',
            estado: this.estadoPrescripcion(receta),
            sistema: receta.origenExterno?.app ? receta.origenExterno.app.toUpperCase() : 'ANDES',
            fecha: receta.fechaRegistro,
            fechaReferencia: receta.fechaRegistro,
            organizacion: receta.organizacion?.nombre || '',
            organizacionId: receta.organizacion?.id ? String(receta.organizacion.id) : null,
            idRegistro: receta.idRegistro,
            prolongado: !!datos.tratamientoProlongado,
            tiempoTratamiento: tiempo?.nombre || (tiempo?.id ? `${tiempo.id} meses` : ''),
            orden: datos.ordenTratamiento ?? 0,
            total: Number(tiempo?.id) || null
        };
    }

    private estadoPrescripcion(receta): string {
        // Al dispensarse la receta queda finalizada: en la consulta se informa como dispensada
        if (receta.estadoDispensaActual?.tipo === 'dispensada' || receta.estadoActual?.tipo === 'finalizada') {
            return 'dispensada';
        }
        return receta.estadoActual?.tipo || '';
    }

    private agrupar(prescripciones: IPrescripcion[]): IGrupoPrescripciones[] {
        const porMedicamento = new Map<string, IPrescripcion[]>();
        prescripciones.forEach(p => porMedicamento.set(p.clave, [...(porMedicamento.get(p.clave) || []), p]));

        return Array.from(porMedicamento.values()).map(lista => {
            const recientes = [...lista].sort((a, b) => moment(b.fecha).diff(a.fecha));
            const ultima = recientes[0];
            // En tratamientos prolongados se muestra primero la receta inicial de la serie y luego las siguientes
            const serie = ultima.prolongado
                ? lista.filter(p => p.idRegistro === ultima.idRegistro).sort((a, b) => a.orden - b.orden)
                : [ultima];
            const todas = [...serie, ...recientes.filter(p => !serie.includes(p))];
            return {
                clave: ultima.clave,
                nombre: ultima.nombre,
                tipoNombre: ultima.tipoNombre,
                tiempoTratamiento: ultima.prolongado ? ultima.tiempoTratamiento : null,
                inicial: todas.slice(0, 1),
                todas
            };
        }).sort((a, b) => moment(b.inicial[0].fechaReferencia).diff(a.inicial[0].fechaReferencia));
    }

    private armarDetalle(p: IPrescripcion) {
        const receta = p.receta;
        const medicamento = receta.medicamento;
        const dosisDiaria = medicamento?.dosisDiaria;
        const fecha = moment(p.fecha);

        let dosis = '-';
        if (dosisDiaria?.dosis) {
            dosis = `${dosisDiaria.dosis} ${medicamento.presentacion || ''}`.trim();
            if (dosisDiaria.intervalo?.nombre) {
                dosis += ` cada ${dosisDiaria.intervalo.nombre}`;
            }
            if (dosisDiaria.dias) {
                dosis += ` durante ${dosisDiaria.dias} día(s)`;
            }
        }

        let cantidad = '-';
        if (medicamento?.cantEnvases) {
            cantidad = medicamento.cantidad
                ? `${medicamento.cantEnvases} envase(s) de ${medicamento.cantidad} ${medicamento.presentacion || ''}`.trim()
                : `${medicamento.cantEnvases} envase(s)`;
        } else if (receta.insumo?.cantidad) {
            cantidad = `${receta.insumo.cantidad} ${receta.insumo.unidades || 'unidad(es)'}`;
        }

        return {
            nombre: p.nombre,
            estado: p.estado,
            tratamiento: p.prolongado && p.total ? `RECETA ${p.orden + 1} DE ${p.total} TRATAMIENTO PROLONGADO` : null,
            paciente: [receta.paciente?.apellido, receta.paciente?.alias || receta.paciente?.nombre].filter(Boolean).join(', '),
            documento: receta.paciente?.documento || '-',
            diagnostico: receta.diagnostico?.term || receta.diagnostico?.descripcion || '-',
            profesional: [receta.profesional?.apellido, receta.profesional?.nombre].filter(Boolean).join(', ') || '-',
            efector: p.organizacion || '-',
            sistema: p.sistema,
            fechaPrescripcion: fecha.format('DD/MM/YYYY'),
            // La receta vence a los 30 días de su emisión (mismo criterio que el PDF)
            vigencia: `${fecha.format('DD/MM/YYYY')} al ${fecha.clone().add(30, 'days').format('DD/MM/YYYY')}`,
            dosis,
            cantidad,
            observaciones: dosisDiaria?.notaMedica || receta.insumo?.especificacion || '-'
        };
    }

    private errorRangoFechas(): string {
        const { fechaDesde, fechaHasta } = this.filtros;
        if (!fechaDesde || !fechaHasta) {
            return 'Debe ingresar el rango de fechas';
        }
        if (moment(fechaDesde).isAfter(fechaHasta)) {
            return 'La fecha desde debe ser anterior a la fecha hasta';
        }
        if (moment(fechaHasta).isAfter(moment(fechaDesde).add(6, 'months').endOf('day'))) {
            return 'El rango de fechas admite consultas de hasta 6 meses';
        }
        return null;
    }

    private toggle(lista: string[], valor: string): string[] {
        return lista.includes(valor) ? lista.filter(v => v !== valor) : [...lista, valor];
    }

    private normalizar(texto: string): string {
        return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    }
}
