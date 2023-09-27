
export interface IConceptoTurneable {
    id: string;
    conceptId: string;
    term: string;
    fsn: string;
    semanticTag: string;
    noNominalizada: boolean;
    auditable: boolean;
    agendaDinamica: boolean;
    ambito: string[];
}
