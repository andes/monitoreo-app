export interface IWebhook {
    id: string;
    event: string;
    url: string;
    method: string;
    trasform: string;
    active: boolean;
    nombre: string;
}
