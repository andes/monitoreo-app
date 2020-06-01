import { IModulo } from 'src/app/modulos/interfaces/IModulo.interface';

export interface INovedad {
    _id?: string;
    titulo: string;
    fecha: Date;
    descripcion: string;
    modulo: IModulo;
    imagenes?: any[];
    activa: boolean;
}
