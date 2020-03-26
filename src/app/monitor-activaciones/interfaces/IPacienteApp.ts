import { IDevice } from './IDevice';

export interface IPacienteApp {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    usuario: string;
    documento: string;
    nacionalidad: string;
    sexo: string;
    genero: string;
    fechaNacimiento: Date;
    telefono: string;
    password: string;
    pacientes: any;
    profesionalId: any;
    activacionApp: boolean;
    permisos: [string];
    restablecerPassword: {
        codigo: string,
        fechaExpiracion: Date
    };
    devices: [IDevice];
}
