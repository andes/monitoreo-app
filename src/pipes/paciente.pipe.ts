import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paciente', pure: false })

export class PacientePipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        if (!value) {
            return null;
        } else if (value.alias) {
            return value.apellido + ', ' + value.alias;
        } else {
            return value.apellido + ', ' + value.nombre;
        }
    }
}
