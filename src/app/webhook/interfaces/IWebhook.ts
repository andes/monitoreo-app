export interface IWebhook {
    id: string;
    event: string;
    url: string;
    method: string;
    transform: string;
    active: boolean;
    name: string;
}
