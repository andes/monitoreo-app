
import { IPaciente } from './IPaciente';

export interface IPacienteMatch {
    id: String;
    paciente: IPaciente;
    _score: number;
}
