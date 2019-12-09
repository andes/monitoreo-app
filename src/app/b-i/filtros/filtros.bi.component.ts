import { Component, Output, Input, OnInit, AfterViewInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filtrosBiRegister } from './filtros.bi.decorator';
import { IFiltroBi } from '../interfaces/IFiltroBi.interface';
import { IArgumentoBi } from '../interfaces/IArgumentoBi.interface';

@Component({
    selector: 'filtro-bi',
    template: ''
})
export class FiltroBiComponent implements OnInit {

    @Input() argumento: IArgumentoBi;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        public route: ActivatedRoute,
        private viewContainerRef: ViewContainerRef, // Referencia al padre del componente que queremos cargar
    ) { }

    ngOnInit() {
        this.loadComponent();
    }

    /**
     * Carga un componente dinámicamente
     * @private
     * @memberof FiltroBiComponent
     */
    private loadComponent() {
        // Cargamos el componente
        const component = filtrosBiRegister.get(this.argumento.componente).component; // trae el elemento de la BD
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component as any);
        const componentReference = this.viewContainerRef.createComponent(componentFactory);

        componentReference.instance.argumento = this.argumento;

    }
}
