// import { IPacienteMatch } from '../interfaces/IPacienteMatch.inteface';

export interface PacienteBuscarResultado {
    err: any;
    pacientes: any[];
    escaneado?: boolean;
    scan?: string;
}
