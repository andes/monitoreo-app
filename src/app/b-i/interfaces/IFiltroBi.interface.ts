
import { IArgumentoBi } from './IArgumentoBi.interface';

export interface IFiltroBi {
    _id: string;
    nombre: string; // nombre de consulta
    coleccion: string;
    query: string;
    argumentos: IArgumentoBi[];
}
