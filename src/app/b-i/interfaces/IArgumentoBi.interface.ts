
export interface IArgumentoBi {
    key: string;
    descripcion?: string;
    label: string; // label en HTML
    params: string; // tal vez cambiar nombre por label
    componente: string;
    tipo: string;
    nombre?: string; // name en html
    valor: any;  // contenido del parámetro
    required?: boolean; // campo requerido
}
