import { IDevice } from './IDevice';

export interface IPacienteApp {
    nombre: String;
    apellido: String;
    email: String;
    usuario: String;
    documento: String;
    nacionalidad: String;
    sexo: String;
    genero: String;
    fechaNacimiento: Date;
    telefono: String;
    password: String;
    pacientes: any;
    profesionalId: any;
    activacionApp: Boolean;
    permisos: [String];
    restablecerPassword: {
        codigo: String,
        fechaExpiracion: Date
    };
    devices: [IDevice];
}
