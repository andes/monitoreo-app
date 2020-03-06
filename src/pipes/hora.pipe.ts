import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * Implementa un pipe de hora utilizando moment.js
 */
@Pipe({ name: 'hora' })
export class HoraPipe implements PipeTransform {
    transform(value: any): any {
        return moment(value).format('HH:mm');
    }
}
