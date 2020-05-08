import { ISnomedConcept } from './ISnomedConcept';

export interface IElementoRUP {
    id: string;
    // Indica si este elemento está activo
    activo: boolean;
    // Vinculación al componente de la aplicación Angular
    componente: string;
    // Indica los semantic tags para los cuales este elemento es el registro por default
    defaultFor: SemanticTag[];
    // Tipo de elemento
    tipo: string;
    formulaImplementation?: string;
    // Indica si este elementoRUP aplica a una solicitud
    esSolicitud: boolean;

    privacy: string;

    // Indica si no muestra el motivo de consulta al validar
    motivoConsultaOpcional: boolean;

    // Indica los parámetros para instanciar el componente
    params: any;

    // Indica el estilo para aplicar al componente
    style: {
        columns: number,
        cssClass: string
    };
    // Conceptos SNOMED relacionados que se muestran e implementan de la misma manera.
    // Por ejemplo: "Toma de temperatura del paciente (SCTID: 56342008)" y
    //              "Toma de temperatura rectal del paciente (SCTID: 18649001")
    //              se implementan con el mismo elemento RUP "Toma de temperatura"
    conceptos: ISnomedConcept[];
    // Conceptos SNOMED que voy a tener que buscar por los registros de la HUDS del paciente
    // para poder armar por ejemplo la curva de peso.
    conceptosBuscar?: ISnomedConcept[];
    // Elementos RUP requeridos para la ejecución.
    // Por ejemplo, en "Control de Niño sano" es obligatorio ejecutar "Toma de peso"
    requeridos: {
        elementoRUP?: IElementoRUP,
        concepto: ISnomedConcept,
        // Indica estilos para la instancia del elementoRUP
        style?: {
            columns: number,
            cssClass: string
        },
        // Indica parámetros para la instancia del elementoRUP en formato {key: value}
        params?: any
    }[];
    // Elementos RUP más frecuentes para la ejecución.
    // Por ejemplo, en "Consulta de medicina general" se puede sugerir ejecutar "Signos vitales"
    frecuentes: ISnomedConcept[];

    inactiveAt?: Date;
}

export type SemanticTag =
    'objeto físico' |
    'estructura corporal' |
    'espécimen' |
    'hallazgo' |
    'sustancia' |
    'concepto especial' |
    'medio ambiente / localización' |
    'metadato' |
    'contexto social' |
    'entidad observable' |
    'procedimiento' |
    'calificador' |
    'fuerza física' |
    'escala de estadificación' |
    'elemento de registro' |
    'producto' |
    'fármaco de uso clínico' |
    'evento' |
    'organismo' |
    'situación';
