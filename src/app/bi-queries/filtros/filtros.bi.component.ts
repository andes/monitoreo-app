import { Component, Output, Input, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filtrosBiRegister } from './filtros.bi.decorator';
import { IArgumentoBi } from '../interfaces/IArgumentoBi.interface';

@Component({
    selector: 'filtro-bi',
    template: ''    // Debe quedar vacío, y cada atómo indicar que usa 'rup.html' o su propio template
})
export class FiltroBiComponent implements OnInit {
    @ViewChild('form', { static: true }) form: any;

    // Eventos
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    public argInstance: any;

    // Propiedades
    @Input() argumento: IArgumentoBi; // parámetro que contiene el esquema del componente a crear

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        public route: ActivatedRoute,
        private viewContainerRef: ViewContainerRef
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
        const component = filtrosBiRegister.get(this.argumento.componente).component;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component as any);

        const componentReference = this.viewContainerRef.createComponent(componentFactory);

        // tslint:disable-next-line: no-string-literal
        componentReference.instance['argumento'] = this.argumento; // asignamos el componente recibido a la variable 'argumento'
        // Event bubbling
        componentReference.instance.change.subscribe(value => {
            this.emitChange(false);
        });
        this.argInstance = componentReference.instance;
    }

    /**
     * Emite el evento change con los nuevos datos de registro
     *
     * @protected
     * @memberof FiltroBiComponent
     */
    public emitChange(notifyObservers = true) {
        // Notifica al componente padre del cambio
        this.change.emit(this.argumento);
    }
    /**
     * valida argumentos
     * Si existe un formulario en el argumento, lo valida
     *
     * Cada argumento puede sobreescribir esta funcionalidad, implementando el metodo 'validate'.
     *
     * @protected
     * @memberof FiltroBiComponent
     */
    public validate() {
        const validForm = this.validateForm();
        return validForm;
    }

    /**
     * Busca una referencia al formulario, y lo valida.
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
    get isValid() {
        if (this.argInstance) {
            return !this.argInstance.form || !this.argInstance.form.touched || (!this.argInstance.form.invalid);
        }
        return true;
    }
}
