interface IFiltros {
    name: string;
    component: any;
}

const filtrosLista: IFiltros[] = []; // lista de componentes posibles a usar

const get = (name) => { // obtener un componente
    return filtrosLista.find(item => item.name === name);
};

const register = (name, component) => { // agregar un componente a la lista
    filtrosLista.push({
        name, component
    });
};

const list = () => {
    return filtrosLista.map(i => i.component);
};

export const filtrosBiRegister = { get, register, list };

export function filtrosBi(name) { // agregamos nuevo componente a la lista (ejecutado al inicio en la carga de los componentes)
    return function decorator(target) {
        filtrosBiRegister.register(name, target);
    };
}