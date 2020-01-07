interface IFiltros {
    name: string;
    component: any;
}

const filtrosLista: IFiltros[] = [];

const get = (name) => {
    return filtrosLista.find(item => item.name === name);
};

const register = (name, component) => {
    filtrosLista.push({
        name, component
    });
};

const list = () => {
    return filtrosLista.map(i => i.component);
};

export const filtrosBiRegister = { get, register, list };

export function filtrosBi(name) {
    return function decorator(target) {
        filtrosBiRegister.register(name, target);
    };
}
