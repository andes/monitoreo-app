import { ActivatedRoute, Router } from '@angular/router';
import { SnomedService } from 'src/app/shared/snomed.service';
import { ElementosRupService } from '../../services/elementos-rup.service';
import { Unsubscribe } from '@andes/shared';
import { ISnomedConcept } from 'src/app/shared/ISnomedConcept';
import { take } from 'rxjs/operators';
import { Plex } from '@andes/plex';
import { OnInit, Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'rup-atomo-create-update',
    templateUrl: 'atomo-create-update.component.html'
})
export class RUPAtomoCreateUpdateComponent implements OnInit {

    @Input() items = [];
    @Output() itemsNew: EventEmitter<any[]> = new EventEmitter<any[]>();

    nuevoItem: any = {
        id: '',
        label: ''
    };
    showAgregarItem = false;

    valorNumericoType = [
        { id: 'integer', label: 'Entero' },
        { id: 'float', label: 'Decimales' }
    ];

    checkOrientacionType = [
        { id: 'vertical', label: 'Vertical' },
        { id: 'horizontal', label: 'Horizontal' }
    ];

    tipoAtomos = [
        { id: 'SelectOrganizacionComponent', nombre: 'Select Organizaciones' },
        { id: 'SelectProfesionalComponent', nombre: 'Select Profesionales' },
        { id: 'SelectSnomedComponent', nombre: 'Select Snomed Concept' },
        { id: 'SelectStaticoComponent', nombre: 'Select Estatico' },
        { id: 'ObservacionesComponent', nombre: 'Observaciones' },
        { id: 'ValorNumericoComponent', nombre: 'Valor Numerico' },
        { id: 'ChecklistComponent', nombre: 'CheckList' }
    ];

    tipoAtomo: { id: string; nombre: string } = null;

    titulo = 'Nuevo átomo';
    elementosRup = [];
    public id: string;
    public nombre: string;
    public elemento;
    public concepto;
    public conceptos: ISnomedConcept[] = [];


    params: any = {};

    constructor(
        private actr: ActivatedRoute,
        private snomedService: SnomedService,
        private elementosRUPService: ElementosRupService,
        private router: Router,
        private plex: Plex
    ) { }

    @Unsubscribe()
    searchConcept($event) {
        if ($event.query.length > 3) {
            const query = {
                search: $event.query,
                // semanticTag: ['procedimiento', 'elemento de registro']<
            };
            this.snomedService.get(query).subscribe((conceptos: ISnomedConcept[]) => {
                $event.callback(conceptos);
            });
        } else {
            $event.callback([]);
        }
    }

    ngOnInit() {
        this.id = this.actr.snapshot.params.id;

        if (this.id) {
            this.elementosRUPService.cache$.pipe(take(1)).subscribe((elementosRup: any) => {
                this.elementosRup = elementosRup;
                this.elemento = this.elementosRup.find(e => e.id === this.id);


                this.conceptos = [...(this.elemento.conceptos || [])];


                this.params = this.elemento.params ? { ...this.elemento.params } : {};
                this.items = this.params.items ? [...this.params.items] : [];


                this.tipoAtomo = this.tipoAtomos.find(item => item.id === this.elemento.componente);


                this.nombre = this.elemento.nombre;
                this.titulo = this.elemento.conceptos[0]?.term || 'Editar átomo';


            });
        } else {
            this.conceptos = [];
            this.createElemento();
        }
    }



    createElemento() {
        this.elemento = {
            nombre: '',
            componente: 'PRESTACION',
            conceptos: [],
            requeridos: [],
            esSolicitud: false,
            tipo: 'atomo',
            activo: true,
            defaultFor: [],
            frecuentes: [],
            params: {}
        };
    }

    onSave() {
        // Validación de conceptos
        if (!this.conceptos || !this.conceptos.length) {
            this.plex.toast('danger', 'Debe seleccionar al menos un concepto SNOMED');
            return;
        }
        // Validación de tipo de átomo
        if (!this.tipoAtomo) {
            this.plex.toast('danger', 'Debe seleccionar un tipo de átomo');
            return;
        }


        this.elemento.conceptos = [...this.conceptos];
        this.elemento.componente = this.tipoAtomo.id;
        this.elemento.nombre = this.nombre || this.conceptos[0]?.term || 'Átomo sin nombre';
        this.elemento.params = { ...this.params };

        if (this.items && this.items.length) {
            this.elemento.params.items = [...this.items];
        }



        this.elementosRUPService.save(this.elemento).subscribe(
            () => {
                this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
                this.plex.toast('success', 'Los datos se guardaron correctamente');
            },
            (err) => {
                this.plex.toast('danger', 'Error al guardar los datos');
            }
        );
    }

    volver() {
        this.router.navigate(['/rupers/elementos-rup'], { replaceUrl: true });
    }
    addItem() {

        (this.items) ? this.items.push(this.nuevoItem) : (this.items = [this.nuevoItem]);
        this.itemsNew.emit(this.items);
        this.nuevoItem = '';
        this.showAgregarItem = false;
        this.nuevoItem = {
            id: '',
            label: ''
        };
    }
    removeItem(i: number) {
        if (i >= 0) {
            this.items.splice(i, 1);
        }
    }

}
