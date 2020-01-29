import { Component, Output, Input, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filtrosBiRegister } from './filtros.bi.decorator';
import { IArgumentoBi } from '../interfaces/IArgumentoBi.interface';

@Component({
    selector: 'filtro-bi',
    template: ''    // Debe quedar vacío, y cada atómo indicar que usa su propio template
})
export class FiltroBiComponent implements OnInit {
    @ViewChild('form', { static: true }) form: any;

    public argInstance: any;

    // Propiedades
    @Input() argumento: IArgumentoBi; // parámetro que contiene el esquema del componente a crear

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        public route: ActivatedRoute,
        private viewContainerRef: ViewContainerRef // Referencia al padre del componente que queremos cargar (?
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
        const component = filtrosBiRegister.get(this.argumento.componente).component; // obtenemos el tipo de componente de la lista
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component as any); // creamos el componente
        // asignamos referencia de la instancia actual al componente creado
        const componentReference = this.viewContainerRef.createComponent(componentFactory);
        componentReference.instance['argumento'] = this.argumento; // asignamos el componente recibido a la variable 'argumento'
        this.argInstance = componentReference.instance;
    }

    /**
     * Valida argumentos
     * Busca una referencia al formulario, y lo valida.
     * Cada argumento puede sobreescribir esta funcionalidad, implementando el metodo 'validateForm'.
     *
     * @protected
     * @memberof FiltroBiComponent
     */
    public validateForm() { // verifica el formulario de 'form'
        if (this.form) {
            for (const key in this.form.controls) {
                const frm = this.form.controls[key];
                frm.markAsTouched();
                if (frm.validator) {
                    frm.validator({ value: frm.value });
                }
            }
        }
        return (!this.form || !this.form.invalid);
    }

    // verifica formulario en la instancia actual
    get isValid() {
        if (this.argInstance) {
            return !this.argInstance.form || !this.argInstance.form.touched || (!this.argInstance.form.invalid);
        }
        return true;
    }
}
