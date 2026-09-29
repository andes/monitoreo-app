import { Component, OnInit } from '@angular/core';
import { IPlexTableColumns } from '@andes/plex/src/lib/table/table.interfaces';

@Component({
    selector: 'app-visualizador-recetas',
    templateUrl: './visualizador-recetas.component.html',
    styleUrls: ['./visualizador-recetas.component.css']
})
export class VisualizadorRecetasComponent implements OnInit {

    public organizacion: string;
    public prescripcion: string;
    public busquedaPaciente: '';
    public filtros: any = {
        fechaDesde: null,
        fechaHasta: null,

    };


    public estados = [
        { id: 'vigente', nombre: 'Vigente' },
        { id: 'dispensada', nombre: 'Dispensada' },
        { id: 'vencida', nombre: 'Vencida' },
        { id: 'suspendida', nombre: 'Suspendida' }
    ];



    public recetasVisibles = [
        { fecha: new Date('2026-03-10'), estado: 'Vigente', efector: 'Hospital Castro Rendón', sistema: 'ANDES' },
        { fecha: new Date('2026-01-15'), estado: 'Dispensada', efector: 'Hospital Heller', sistema: 'SIFAHO' }
    ];



    constructor() { }

    ngOnInit(): void {
    }

}
