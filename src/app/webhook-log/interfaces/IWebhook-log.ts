
export interface IWebhooklog {
    url: string;
    event: string;
    method: {
        type: string;
        default: 'POST';
        enum: ['POST', 'PUT', 'PATCH', 'GET'];
    };
    body: any; // a projections of data to send
    status: number;
    response: any; // ver por message y porque response cambia
    updatedAt: Date;
}
