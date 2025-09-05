export interface IQuery {
    nombre: string;
    _id: string;
    descripcion: string;
    coleccion: string;
    inactiva: string;
    parametros: IParametro[];
}

export interface IParametro {
    nombre: string;
    tipo: string;
    requerido: boolean;
}
