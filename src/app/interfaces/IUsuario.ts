export interface IUsuario {
    id: string;
    usuario: number;
    nombre: string;
    apellido: string;
    documento: string;
    foto: string;
    disclaimers?: any[];
    pacienteRestringido: any[];
}
