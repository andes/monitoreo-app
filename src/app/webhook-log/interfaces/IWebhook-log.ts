
export interface IWebhooklog {
    url: String;
    event: String;
    method: {
        type: String,
        default: 'POST',
        enum: ['POST', 'PUT', 'PATCH', 'GET']
    };
    body: any; // a projections of data to send
    status: Number;
    response: any; // ver por message y porque response cambia
    updatedAt: Date;
}
