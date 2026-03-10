export interface IInsumo {
    id?: string;
    nombre: string;
    codigo: {
        fuente: 'SIFAHO' | 'SNOMED';
        valor: string;
    }[];
    tipo: 'dispositivo' | 'nutricion' | 'magistral';
    estado: 'activo' | 'inactivo';
    requiereEspecificacion: boolean;
    observaciones?: string;
}
